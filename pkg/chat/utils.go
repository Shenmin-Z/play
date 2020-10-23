package chat

import (
	"crypto/rand"
	"fmt"
	"io/ioutil"
	"os"
)

func Pseudo_uuid() (uuid string) {
	b := make([]byte, 4)

	_, err := rand.Read(b)
	if err != nil {
		fmt.Println("Error: ", err)
		return
	}

	uuid = fmt.Sprintf("%x-%x", b[0:2], b[2:])
	return
}

const path = "client/public/chat-profile"

func writeImage(id string, m []byte) {
	os.MkdirAll(path, 0744)
	ioutil.WriteFile(path+"/"+id, m, 0644)
}

func deleteImage(id string) {
	os.Remove(path + "/" + id)
}
