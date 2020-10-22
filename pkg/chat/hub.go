package chat

type Hub struct {
	clients    map[*Client]bool
	broadcast  chan BroadCast
	register   chan *Client
	unregister chan *Client
}

func newHub() *Hub {
	return &Hub{
		broadcast:  make(chan BroadCast),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		clients:    make(map[*Client]bool),
	}
}

func (h *Hub) run() {
	for {
		select {
		case client := <-h.register:
			h.clients[client] = true
		case client := <-h.unregister:
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.send)
				deleteImage(client.id)
			}
		case message := <-h.broadcast:
			listeners := h.clients
			if len(message.Targets) > 0 {
				listeners = make(map[*Client]bool)
				for c := range h.clients {
					for _, t := range message.Targets {
						if t == c.id {
							listeners[c] = true
						}
					}
				}
			}
			for client := range listeners {
				select {
				case client.send <- message.Message:
				default:
					delete(h.clients, client)
					close(client.send)
					deleteImage(client.id)
				}
			}
		}
	}
}
