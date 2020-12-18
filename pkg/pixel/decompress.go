package pixel

import (
	"bytes"
	"encoding/binary"
	"io/ioutil"
	"log"
	"os"
)

func fromPixelFrame(realWidth int, realHeight int, frame PixelFrame) BitMap {
	bitMap := make(BitMap, realHeight)
	for i := range bitMap {
		bitMap[i] = make([]uint8, realWidth)
	}

	dataInt16 := make([]uint16, len(frame)/2)
	binary.Read(bytes.NewReader(frame), binary.LittleEndian, &dataInt16)

	row := 0
	for i := 0; i < len(dataInt16); {
		numOfPairs := int(dataInt16[i])
		for j := 0; j < numOfPairs; j++ {
			start, end := dataInt16[i+j*2+1], dataInt16[i+j*2+2]
			for k := start; k <= end; k++ {
				bitMap[row][k] = 1
			}
		}
		i = i + 1 + numOfPairs*2
		row = row + 1
	}
	return bitMap
}

func Decompress(binaryFilePath string) {
	bin, err := ioutil.ReadFile(binaryFilePath)
	if err != nil {
		log.Fatal(err)
		os.Exit(2)
	}

	meta := PixelMeta{
		binary.LittleEndian.Uint16(bin[0:]),
		binary.LittleEndian.Uint16(bin[2:]),
		binary.LittleEndian.Uint16(bin[4:]),
		binary.LittleEndian.Uint16(bin[6:]),
		binary.LittleEndian.Uint16(bin[8:]),
	}
	data := bin[10:]

	frames := make([]BitMap, 0)
	for i := 0; i < len(data); {
		frameLen := int(binary.LittleEndian.Uint32(data[i : i+4]))
		frames = append(frames, fromPixelFrame(
			int(meta.realWidth),
			int(meta.realHeight),
			data[i+4:i+4+frameLen]),
		)
		i = i + 4 + frameLen
	}

	play(meta, frames)
}
