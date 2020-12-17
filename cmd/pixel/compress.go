package main

import (
	"flag"
	"image"
	"log"
	"os"

	"github.com/shenmin-z/draw/pkg/pixel"
)

func main() {
	outFile := flag.String("o", "./out.pixel", "path to output directory")
	width := flag.Int("w", 100, "width")
	height := flag.Int("h", 100, "height")
	fps := flag.Int("f", 5, "frame rate")

	flag.Parse()
	imgFiles := flag.Args()

	if len(imgFiles) == 0 {
		log.Println("Must supply images.")
		os.Exit(2)
	}

	var imgs []image.Image
	for _, imgFile := range imgFiles {
		f, err := os.Open(imgFile)
		if err != nil {
			log.Fatal(err)
			os.Exit(2)
		}
		defer f.Close()

		img, _, err := image.Decode(f)
		if err != nil {
			log.Fatal(err)
			os.Exit(2)
		}

		imgs = append(imgs, img)
	}

	pixel.ToBinary(imgs, *width, *height, *fps, *outFile)
}
