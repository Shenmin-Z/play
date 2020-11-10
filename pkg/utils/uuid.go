package utils

import (
	"crypto/rand"
	"fmt"
)

func PseudoUuid() (uuid string) {
	b := make([]byte, 4)

	_, err := rand.Read(b)
	if err != nil {
		fmt.Println("Error: ", err)
		return
	}

	uuid = fmt.Sprintf("%x-%x", b[0:2], b[2:])
	return
}

func PseudoUuid8() (uuid string) {
	b := make([]byte, 8)

	_, err := rand.Read(b)
	if err != nil {
		fmt.Println("Error: ", err)
		return
	}

	uuid = fmt.Sprintf("%x-%x-%x-%x", b[0:2], b[2:4], b[4:6], b[6:])
	return
}
