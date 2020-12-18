package pixel

import (
	"fmt"
	"time"
)

const (
	white       = "\u001b[47;1m"
	black       = "\u001b[40;1m"
	reset       = "\u001b[0m"
	clearScreen = "\u001b[2J"
	begenning   = "\u001b[0;0H"
	nextLine    = "\u001b[1E"
)

func play(meta PixelMeta, frames []BitMap) {
	ticker := time.NewTicker(time.Second / time.Duration(meta.fps))
	quit := make(chan struct{})

	i := 0

	for {
		select {
		case <-ticker.C:
			if i < len(frames) {
				fmt.Printf("%s%s%s", clearScreen, begenning, reset)
				output := renderFrame(frames[i])
				fmt.Print(output)
				i++
			} else {
				close(quit)
			}
		case <-quit:
			ticker.Stop()
			return
		}
	}
}

func renderFrame(frame BitMap) string {
	result := ""
	for lNum, line := range frame {
		prev := uint8(255)
		text := ""
		for _, i := range line {
			if i != prev {
				if i == 0 {
					text += black
				}
				if i == 1 {
					text += white
				}
			}
			text += " "
			prev = i
		}
		if lNum < len(frame)-1 {
			text += nextLine
		}
		result += text
	}
	return result
}
