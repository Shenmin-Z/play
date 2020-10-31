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
	Id      string `json:"id"`
	Name    string `json:"name"`
	Profile bool   `json:"profile"`
	hub     *Hub
	conn    *websocket.Conn
	send    chan Message
}

func (c *Client) cleanAndPrint(err error, kind string) {
	c.hub.unregister <- c
	c.conn.Close()
	deleteImage(c.Id)
	kindMsg := utils.Magenta(kind)
	errMsg := fmt.Sprintf("%s closed.", c.Name)
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
		Id:   utils.PseudoUuid(),
		Name: utils.GenerateName(),
		hub:  hub,
		conn: conn,
		send: make(chan Message, 1),
	}
	client.hub.register <- client
	client.notify()

	go client.write()
	go client.read()
}
