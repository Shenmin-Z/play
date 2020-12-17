package pixel

import (
	"bytes"
	"encoding/binary"
	"image"
	"log"
	"os"

	"github.com/disintegration/imaging"
)

type PixelMeta struct {
	width      uint16
	height     uint16
	realWidth  uint16
	realHeight uint16
	fps        uint16
}

// Data of all frames
// each frame:
// 4 bytes: length of frame
// x bytes: frame data
type PixelData = []byte

// Data of all lines
// each line:
// 2 bytes number of paris
// x paris of [start, end]
type PixelFrame = []byte

func toPixelFrame(input BitMap) PixelFrame {
	resInt16 := []uint16{}

	// 0: black; 1: white
	isWhite := false
	for y := range input {
		buf := []uint16{0}

		for x := range input[y] {
			if input[y][x] == 0 {
				if isWhite {
					buf = append(buf, uint16(x-1))
				}
				isWhite = false
			} else {
				if !isWhite {
					buf = append(buf, uint16(x))
				}
				isWhite = true
			}
		}
		if isWhite {
			buf = append(buf, uint16(len(input[y])-1))
			isWhite = false
		}

		numOfPairs := len(buf) / 2
		buf[0] = uint16(numOfPairs)

		resInt16 = append(resInt16, buf...)
	}

	byteBuf := new(bytes.Buffer)
	binary.Write(byteBuf, binary.LittleEndian, resInt16)

	return byteBuf.Bytes()
}

func ToBinary(imgs []image.Image, w int, h int, fps int, out string) {
	var data PixelData
	var realWidth int
	var realHeight int

	for _, img := range imgs {
		resized := imaging.Fit(img, w, h, imaging.NearestNeighbor)
		gImg := gray(resized)

		if realWidth == 0 {
			realWidth = gImg.Rect.Dx()
			realHeight = gImg.Rect.Dy()
		}

		mono := mono(gImg, 240)
		frame := toPixelFrame(mono)

		byteBuf := new(bytes.Buffer)
		binary.Write(byteBuf, binary.LittleEndian, uint32(len(frame)))
		data = append(data, byteBuf.Bytes()...)
		data = append(data, frame...)
	}

	meta := PixelMeta{
		uint16(w),
		uint16(h),
		uint16(realWidth),
		uint16(realHeight),
		uint16(fps),
	}

	outBinaryFile, err := os.Create(out)
	if err != nil {
		log.Println("Couldn't create " + out)
		os.Exit(2)
	}
	defer outBinaryFile.Close()

	err = binary.Write(outBinaryFile, binary.LittleEndian, meta)
	if err != nil {
		log.Fatal(err)
	}
	_, err = outBinaryFile.Write(data)
	if err != nil {
		log.Fatal(err)
	}
}
