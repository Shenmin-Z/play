package webserver

import (
	"bytes"
	"encoding/base64"
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

		img, err = button.Button(img, radius, label)
		if err != nil {
			http.Error(rw, err.Error(), http.StatusInternalServerError)
			return
		}
		opt := jpeg.Options{
			Quality: 90,
		}
		buffer := new(bytes.Buffer)
		if err = jpeg.Encode(buffer, img, &opt); err != nil {
			http.Error(rw, "Failed To Process Image", http.StatusInternalServerError)
			return
		}

		rw.Header().Set("Content-Type", "text/jpeg; charset=utf-8")
		b64 := base64.StdEncoding.EncodeToString(buffer.Bytes())
		rw.Header().Set("Content-Length", strconv.Itoa(len(b64)))
		if _, err := rw.Write([]byte(b64)); err != nil {
			log.Println("Unable to write image.")
		}
	})
}
