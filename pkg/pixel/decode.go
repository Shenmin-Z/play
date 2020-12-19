package pixel

import (
	"image"
	"log"
	"os"
	"regexp"
	"sort"
	"strconv"
	"sync"
)

const concurrentLimit = 20

type decodeTask struct {
	index   int
	imgFile string
}

func DecodeImages(imgFiles []string) []image.Image {
	sortFiles(imgFiles)
	imgs := make([]image.Image, len(imgFiles))
	wg := sync.WaitGroup{}
	wg.Add(len(imgFiles))
	ch := make(chan decodeTask)

	for i := 0; i < concurrentLimit; i++ {
		go func() {
			for {
				task, ok := <-ch
				if !ok {
					return
				}
				f, err := os.Open(task.imgFile)
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

				imgs[task.index] = img
				wg.Done()
			}
		}()
	}

	for i, imgFile := range imgFiles {
		ch <- decodeTask{i, imgFile}
	}
	close(ch)

	wg.Wait()
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
