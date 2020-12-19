package pixel

import (
	"fmt"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"
)

const (
	white       = "\u001b[47;1m"
	black       = "\u001b[40;1m"
	reset       = "\u001b[0m"
	begenning   = "\u001b[0;0H"
	showCursor  = "\u001b[?25h"
	hiedeCursor = "\u001b[?25l"
)

func play(meta PixelMeta, frames []BitMap) {
	ticker := time.NewTicker(time.Second / time.Duration(meta.fps))
	quit := make(chan struct{})

	c := make(chan os.Signal)
	signal.Notify(c, os.Interrupt, syscall.SIGTERM)

	i := 0

	fmt.Print(hiedeCursor)

	for {
		select {
		case <-c:
			fmt.Print(showCursor)
			os.Exit(0)
		case <-ticker.C:
			if i < len(frames) {
				fmt.Printf("%s%s", begenning, reset)
				output := renderFrame(frames[i])
				fmt.Print(output)
				i++
			} else {
				close(quit)
			}
		case <-quit:
			ticker.Stop()
			fmt.Print(showCursor)
			return
		}
	}
}

func renderFrame(frame BitMap) string {
	var sb strings.Builder
	for lNum, line := range frame {
		prev := uint8(255)
		for _, i := range line {
			if i != prev {
				if i == 0 {
					fmt.Fprintf(&sb, "%s", black)
				}
				if i == 1 {
					fmt.Fprintf(&sb, "%s", white)
				}
			}
			fmt.Fprintf(&sb, "  ")
			prev = i
		}
		if lNum < len(frame)-1 {
			fmt.Fprintf(&sb, "\n")
		}
	}
	return sb.String()
}
