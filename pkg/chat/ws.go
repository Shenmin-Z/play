package chat

import (
	"net/http"
)

func ChatWS() {
	hub := newHub()
	go hub.run()
	http.HandleFunc("/chat-ws", func(w http.ResponseWriter, r *http.Request) {
		serveWs(hub, w, r)
	})
}
