package chat

import (
	"bytes"
	"encoding/binary"
	"image"
	"image/jpeg"
	"os"

	"github.com/disintegration/imaging"
)

const path = "client/public/chat-profile"

type UploadCrop struct {
	X uint16
	Y uint16
	W uint16
	H uint16
}

func writeImage(id string, m []byte) error {
	var parsed UploadCrop
	if err := binary.Read(bytes.NewReader(m[:8]), binary.LittleEndian, &parsed); err != nil {
		return err
	}
	img, _, err := image.Decode(bytes.NewReader(m[8:]))
	if err != nil {
		return err
	}
	if err := os.MkdirAll(path, 0744); err != nil {
		return err
	}

	x, y, w, h := int(parsed.X), int(parsed.Y), int(parsed.W), int(parsed.H)
	cropped := imaging.Crop(img, image.Rect(x, y, x+w, y+h))
	resized := imaging.Resize(cropped, 100, 100, imaging.Lanczos)
	file, err := os.OpenFile(path+"/"+id, os.O_WRONLY|os.O_CREATE, 0644)
	defer file.Close()
	if err != nil {
		return err
	}
	if err := jpeg.Encode(file, resized, nil); err != nil {
		return err
	}
	return nil
}

func deleteImage(id string) {
	os.Remove(path + "/" + id)
}
