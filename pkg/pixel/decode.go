package pixel

import (
	"image"
	"log"
	"os"
	"regexp"
	"sort"
	"strconv"
)

func DecodeImages(imgFiles []string) []image.Image {
	sortFiles(imgFiles)
	imgs := make([]image.Image, len(imgFiles))
	count := make(chan struct{}, len(imgFiles))
	// max 10 concurrent since can't have too many open files
	guard := make(chan struct{}, 10)

	for i, imgFile := range imgFiles {
		guard <- struct{}{}
		go func(i int, imgFile string) {
			f, err := os.Open(imgFile)
			if err != nil {
				log.Fatal(err)
				os.Exit(2)
			}

			img, _, err := image.Decode(f)
			f.Close()
			if err != nil {
				log.Fatal(err)
				os.Exit(2)
			}

			imgs[i] = img
			count <- struct{}{}
			<-guard
		}(i, imgFile)
	}

	for i := 0; i < len(imgFiles); i++ {
		<-count
	}

	return imgs
}

func sortFiles(imgFiles []string) {
	numRgx := regexp.MustCompile(`(\d+)\.\w+$`)
	sort.SliceStable(imgFiles, func(i, j int) bool {
		si := numRgx.FindStringSubmatch(imgFiles[i])
		sj := numRgx.FindStringSubmatch(imgFiles[j])
		var ni, nj int
		if len(si) == 2 {
			ni, _ = strconv.Atoi(si[1])
		} else {
			ni = 0
		}
		if len(sj) == 2 {
			nj, _ = strconv.Atoi(sj[1])
		} else {
			nj = 0
		}
		return ni < nj
	})
}
