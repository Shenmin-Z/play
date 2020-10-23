package chat

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
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
	hub  *Hub
	conn *websocket.Conn
	send chan Message
}

func (c *Client) readPump() {
	defer func() {
		c.hub.unregister <- c
		c.conn.Close()
		deleteImage(c.id)
	}()

	c.conn.SetReadDeadline(time.Now().Add(pongWait))
	c.conn.SetPongHandler(func(string) error {
		c.conn.SetReadDeadline(time.Now().Add(pongWait))
		return nil
	})

	for {
		messageType, message, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}

		if messageType == websocket.BinaryMessage {
			writeImage(c.id, message)
			c.hub.broadcast <- BroadCast{
				Targets: []string{c.id},
				Message: Message{
					Kind:    "ProfileUploaded",
					Payload: c.id,
				},
			}
			continue
		}

		incoming := Message{}
		if err := json.Unmarshal(message, &incoming); err != nil {
			log.Printf("Invalid incoming message: %v", err)
		}
		fmt.Println(incoming)
	}
}

func (c *Client) writePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.conn.Close()
		deleteImage(c.id)
	}()
	for {
		select {
		case message, ok := <-c.send:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			messageString, err := json.Marshal(message)
			if err != nil {
				log.Printf("Error writing response: %v", err)
				return
			}
			w.Write(messageString)

			n := len(c.send)
			for i := 0; i < n; i++ {
				messageString, err := json.Marshal(<-c.send)
				if err != nil {
					log.Printf("Error writing response: %v", err)
					break
				}
				w.Write(messageString)
			}

			if err := w.Close(); err != nil {
				return
			}
		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

func serveWs(hub *Hub, w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	client := &Client{
		id:   Pseudo_uuid(),
		hub:  hub,
		conn: conn,
		send: make(chan Message),
	}
	client.hub.register <- client

	go client.writePump()
	go client.readPump()
}
