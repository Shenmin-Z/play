package button

import (
	"image"

	"github.com/fogleman/gg"
)

func Button(img image.Image, radius float64, label string) (image.Image, error) {
	bounds := img.Bounds()
	width, height := bounds.Dx(), bounds.Dy()
	w := float64(width)
	h := float64(height)
	var r float64
	//if less than 1, consider as percentage
	if radius < 1 && radius > 0 {
		min := w
		if h < min {
			min = h
		}
		r = radius * min
	} else if radius >= 1 {
		r = radius
	} else {
		min := w
		if h < w {
			min = h
		}
		r = min / 5
	}

	dc := gg.NewContext(width, height)
	dc.DrawImage(img, 0, 0)

	// Draw Triangle
	rr := r / 4
	dc.MoveTo(w/2-rr, h/2-rr*2)
	dc.LineTo(w/2+rr*2, h/2)
	dc.LineTo(w/2-rr, h/2+rr*2)
	dc.ClosePath()

	dc.Clip()
	dc.InvertMask()

	dc.DrawCircle(w/2, h/2, r)

	dc.SetRGBA(1, 1, 1, .95)
	dc.Fill()

	if label != "" {
		fontSize := h / 8
		if err := dc.LoadFontFace("static/fonts/arial.ttf", fontSize); err != nil {
			return nil, err
		}
		sw, sh := dc.MeasureString(label)

		margin := fontSize / 3 * 2
		padding := margin / 2
		rounded := padding / 2
		dc.DrawRoundedRectangle(margin, h-margin-2*padding-sh, sw+padding*2, sh+padding*2, rounded)
		dc.SetRGBA(0, 0, 0, .8)
		dc.Fill()

		dc.SetRGB(1, 1, 1)
		dc.DrawString(label, margin+padding, h-margin-padding)
	}

	return dc.Image(), nil
}
