package pixel

import (
	"bytes"
	"encoding/binary"
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
