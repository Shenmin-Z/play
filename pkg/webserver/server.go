package webserver

import (
	"net/http"

	"github.com/shenmin-z/draw/pkg/chat"
)

func Serve() {
	static()
	generate()
	chat.ChatWS()
	http.ListenAndServe(":3000", nil)
}
