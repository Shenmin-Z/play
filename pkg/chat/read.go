package chat

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/gorilla/websocket"
)

func (c *Client) read() {
	var readErr error
	defer func() {
		c.cleanAndPrint(readErr, "READ ")
	}()

	c.conn.SetReadDeadline(time.Now().Add(pongWait))
	c.conn.SetPongHandler(func(string) error {
		c.conn.SetReadDeadline(time.Now().Add(pongWait))
		return nil
	})

	for {
		messageType, message, err := c.conn.ReadMessage()
		if err != nil {
			readErr = err
			break
		}

		// 1. Incoming message is binary
		if messageType == websocket.BinaryMessage {
			if message[0] == 1 {
				// first byte is type: 1 means UPLOAD_AND_CROP
				// when type is 1: the next 4*2 bytes are (x,y,w,h), the rest is file
				err := writeImage(c.Id, message[1:])
				if err != nil {
					fmt.Printf("error: %v", err)
				}
				c.send <- Message{
					Kind: "ProfileUploaded",
				}
				c.notify()
				c.Profile = true
				continue
			}
		}

		// 2. Incoming message is JSON
		incoming := Message{}
		if err := json.Unmarshal(message, &incoming); err != nil {
			fmt.Printf("Invalid incoming message: %v", err)
		}
		switch incoming.Kind {
		case "UpdateName":
			name, err := incoming.Payload.(string)
			if !err {
				continue
			}
			c.Name = name
			c.send <- Message{
				Kind:    "NameUpdated",
				Payload: c.Name,
			}
			c.notify()
		case "GetClientList":
			clients := make([]*Client, len(c.hub.clients))
			idx := 0
			for c := range c.hub.clients {
				clients[idx] = c
				idx++
			}
			c.send <- Message{
				Kind:    "ClientList",
				Payload: clients,
			}
		}
	}
}

func (c *Client) notify() {
	c.hub.broadcast <- BroadCast{
		Targets: []string{},
		Message: Message{
			Kind: "ClientUpdateNotification",
		},
	}
}
