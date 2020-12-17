package pixel

import (
	"image"
)

type BitMap = [][]uint8

func gray(img image.Image) *image.Gray {
	size := img.Bounds().Size()

	gImg := image.NewGray(image.Rect(0, 0, size.X, size.Y))

	for x := 0; x < size.X; x++ {
		for y := 0; y < size.Y; y++ {
			gImg.Set(x, y, img.At(x, y))
		}
	}

	return gImg
}

func mono(img *image.Gray, threshold uint8) BitMap {
	size := img.Bounds().Size()

	bitMap := make(BitMap, size.Y)
	for i := range bitMap {
		bitMap[i] = make([]uint8, size.X)
	}

	for x := 0; x < size.X; x++ {
		for y := 0; y < size.Y; y++ {
			var grayValue uint8
			if img.GrayAt(x, y).Y > threshold {
				grayValue = 1
			}
			bitMap[y][x] = grayValue
		}
	}

	return bitMap
}
