package webserver

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"image"
	"image/jpeg"
	"log"
	"net/http"
	"strconv"

	"github.com/shenmin-z/draw/pkg/draw"
)

func generate() {
	http.HandleFunc("/api/image/playbutton", func(rw http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(rw, "Method Not Supported", http.StatusMethodNotAllowed)
			return
		}

		radius, err := strconv.ParseFloat(r.URL.Query().Get("radius"), 64)
		if err != nil {
			http.Error(rw, "Radius should be a number.", http.StatusBadRequest)
			return
		}
		label := r.URL.Query().Get("label")

		img, _, err := image.Decode(r.Body)
		if err != nil {
			http.Error(rw, "Failed To Decode Image", http.StatusBadRequest)
			return
		}

		img, err = draw.Button(img, radius/100, label)
		if err != nil {
			http.Error(rw, err.Error(), http.StatusInternalServerError)
			return
		}

		b64Image(img, rw)
	})

	http.HandleFunc("/api/image/repeatpattern", func(rw http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(rw, "Method Not Supported", http.StatusMethodNotAllowed)
			return
		}

    // Parse parameters
		count, err := strconv.Atoi(r.FormValue("image-count"))
		if err != nil {
			http.Error(rw, "Invalid count", http.StatusBadRequest)
			return
		}
		canvas := draw.Canvas{}
		if err := json.Unmarshal([]byte(r.FormValue("canvas")), &canvas); err != nil {
			http.Error(rw, "Invalid canvas", http.StatusBadRequest)
			return
		}
		images := make([]draw.ImageInfo, count)
		for i := 0; i < count; i++ {
			detail := draw.ImageDetail{}
			if err := json.Unmarshal([]byte(r.FormValue("detail-"+strconv.Itoa(i))), &detail); err != nil {
				http.Error(rw, "Invalid image detail", http.StatusBadRequest)
				return
			}
			file, _, err := r.FormFile("file-" + strconv.Itoa(i))
			defer file.Close()
			if err != nil {
				http.Error(rw, "Invalid image file", http.StatusBadRequest)
				return
			}
			img, _, err := image.Decode(file)
			if err != nil {
				http.Error(rw, "Failed To Decode Image", http.StatusBadRequest)
				return
			}
			images[i] = draw.ImageInfo{
				Image:  img,
				Detail: detail,
			}
		}

		img := draw.Repeat(images, canvas)

		b64Image(img, rw)
	})
}

func b64Image(img image.Image, rw http.ResponseWriter) {
	opt := jpeg.Options{
		Quality: 100,
	}

	buffer := new(bytes.Buffer)
	if err := jpeg.Encode(buffer, img, &opt); err != nil {
		http.Error(rw, "Failed To Process Image", http.StatusInternalServerError)
		return
	}

	rw.Header().Set("Content-Type", "text/jpeg; charset=utf-8")
	b64 := base64.StdEncoding.EncodeToString(buffer.Bytes())
	rw.Header().Set("Content-Length", strconv.Itoa(len(b64)))
	if _, err := rw.Write([]byte(b64)); err != nil {
		log.Println("Unable to write image.")
	}
}
