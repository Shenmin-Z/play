package chat

import (
	"net/http"
)

func ChatWS() {
	hub := newHub()
	conMap := newConMap()
	go hub.run()
	http.HandleFunc("/chat-ws", func(w http.ResponseWriter, r *http.Request) {
		serveWs(hub, conMap, w, r)
	})
}
