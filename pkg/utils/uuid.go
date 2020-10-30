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
