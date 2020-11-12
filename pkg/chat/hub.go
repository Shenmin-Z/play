package chat

import (
	"fmt"

	"github.com/shenmin-z/draw/pkg/utils"
)

type Hub struct {
	clients    map[string]*Client
	broadcast  chan BroadCast
	register   chan *Client
	unregister chan *Client
}

func newHub() *Hub {
	return &Hub{
		broadcast:  make(chan BroadCast),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		clients:    make(map[string]*Client),
	}
}

func (h *Hub) run() {
	for {
		select {
		case client := <-h.register:
			h.clients[client.Id] = client
		case client := <-h.unregister:
			if _, ok := h.clients[client.Id]; ok {
				client.conn.Close()
				deleteImage(client.Id)
				for conversation := range client.conversations {
					for _, iClient := range conversation.Clients {
						if iClient.Id != client.Id {
							if _, ok := h.clients[iClient.Id]; ok {
								iClient.send <- Message{
									Kind:    "ConversationKilled",
									Payload: conversation.Id,
								}
							}
						}
					}
					delete(client.conMap, conversation.Id)
				}
				delete(h.clients, client.Id)
				close(client.send)
			}
		case message := <-h.broadcast:
			listeners := h.clients
			// if Targets's length is 0, send to all clients
			// otherwise, only specified clients
			if len(message.Targets) > 0 {
				listeners = make(map[string]*Client)
				for _, c := range h.clients {
					for _, t := range message.Targets {
						if t == c.Id {
							listeners[c.Id] = c
						}
					}
				}
			}
			for _, client := range listeners {
				select {
				case client.send <- message.Message:
				default:
					fmt.Println(
						utils.Magenta("BROADCAST"),
						utils.Info("Failed to send to client channel."),
					)
					delete(h.clients, client.Id)
					close(client.send)
				}
			}
		}
	}
}
