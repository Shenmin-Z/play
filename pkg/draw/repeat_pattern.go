package draw

import (
	"image"
	"math"

	"github.com/disintegration/imaging"
	"github.com/fogleman/gg"
)

type ImageDetail struct {
	W  int
	H  int
	X  int
	Y  int
	R1 struct {
		X int
		Y int
	}
	R2 struct {
		X int
		Y int
	}
}

type ImageInfo struct {
	Image  image.Image
	Detail ImageDetail
}

type Canvas struct {
	W int
	H int
}

type point struct {
	x int
	y int
}

func Repeat(images []ImageInfo, canvas Canvas) image.Image {
	cw, ch := canvas.W, canvas.H

	dc := gg.NewContext(cw, ch)

	dc.DrawRectangle(0, 0, float64(cw), float64(ch))
	dc.SetRGB255(255, 255, 255)
	dc.Fill()

	for i := 0; i < len(images); i++ {
		image := images[i]
		points := allPoints(image.Detail, canvas)
		resizedImage := imaging.Resize(image.Image, image.Detail.W, image.Detail.H, imaging.Lanczos)
		for j := 0; j < len(points); j++ {
			ra, rb := points[j].x, points[j].y
			px := image.Detail.X + ra*image.Detail.R1.X + rb*image.Detail.R2.X
			py := image.Detail.Y + ra*image.Detail.R1.Y + rb*image.Detail.R2.Y
			dc.DrawImage(resizedImage, px, py)
		}
	}

	return dc.Image()
}

func allPoints(detail ImageDetail, canvas Canvas) []point {
	cw, ch := canvas.W, canvas.H

	a1, b1, a2, b2 := detail.R1.X, detail.R1.Y, detail.R2.X, detail.R2.Y
	x, y, w, h := detail.X, detail.Y, detail.W, detail.H

	if a1*a1+b1*b1 < 5 || a2*a2+b2*b2 < 5 {
		return make([]point, 0)
	}

	w1 := -w - x
	w2 := cw - x
	h1 := -h - y
	h2 := ch - y

	getI := func(j int) []point {
		l1, r1 := sort(float64(w1-j*a2)/float64(a1), float64(w2-j*a2)/float64(a1))
		l2, r2 := sort(float64(h1-j*b2)/float64(b1), float64(h2-j*b2)/float64(b1))
		left := int(math.Ceil(math.Max(l1, l2)))
		right := int(math.Floor(math.Min(r1, r2)))
		if left <= right {
			result := make([]point, 0)
			for i := left; i <= right; i++ {
				result = append(result, point{x: i, y: j})
			}
			return result
		}
		return make([]point, 0)
	}

	result := getI(0)

	if math.Abs(math.Atan(float64(a1)/float64(b1))-math.Atan(float64(a2)/float64(b2))) > 0.1 {
		j := 1
		for {
			tmp := getI(j)
			if len(tmp) > 0 {
				result = append(result, tmp...)
				j++
			} else {
				break
			}
		}
		j = -1
		for {
			tmp := getI(j)
			if len(tmp) > 0 {
				result = append(result, tmp...)
				j--
			} else {
				break
			}
		}
	}

	return result
}

func sort(a float64, b float64) (float64, float64) {
	if a < b {
		return a, b
	} else {
		return b, a
	}
}
