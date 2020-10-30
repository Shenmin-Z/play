package chat

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
	"github.com/shenmin-z/draw/pkg/utils"
)

const (
	writeWait  = 10 * time.Second
	pongWait   = 60 * time.Second
	pingPeriod = (pongWait * 9) / 10
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

type Client struct {
	id   string
	name string
	hub  *Hub
	conn *websocket.Conn
	send chan Message
}

func (c *Client) cleanAndPrint(err error, kind string) {
	c.hub.unregister <- c
	c.conn.Close()
	deleteImage(c.id)
	kindMsg := utils.Magenta(kind)
	errMsg := fmt.Sprintf("%s@%s closed.", c.name, c.id)
	if err == nil {
		fmt.Println(kindMsg, errMsg)
	} else {
		fmt.Println(kindMsg, errMsg, utils.Info(err))
	}
}

func serveWs(hub *Hub, w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		return
	}
	client := &Client{
		id:   utils.PseudoUuid(),
		hub:  hub,
		conn: conn,
		send: make(chan Message),
	}
	client.hub.register <- client

	go client.write()
	go client.read()
}
