package main

import (
	"flag"
	"log"
	"os"

	"github.com/shenmin-z/draw/pkg/pixel"
)

func main() {
	outFile := flag.String("o", "./out.pixel", "path to output directory")
	width := flag.Int("w", 100, "width")
	height := flag.Int("h", 100, "height")
	fps := flag.Int("f", 5, "frame rate")

	binaryFilePath := flag.String("d", "", "path to binary file to be decompressed")

	flag.Parse()
	imgFiles := flag.Args()

	if *binaryFilePath != "" {
		pixel.Decompress(*binaryFilePath)
		return
	}

	if len(imgFiles) == 0 {
		log.Println("Must supply images.")
		os.Exit(2)
	}

	imgs := pixel.DecodeImages(imgFiles)

	pixel.Compress(imgs, *width, *height, *fps, *outFile)
}
