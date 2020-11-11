package chat

import (
	"github.com/shenmin-z/draw/pkg/utils"
	"time"
)

type Conversation struct {
	Id      string    `json:"id"`
	Name    string    `json:"name"`
	Clients []*Client `json:"users"`
}

type ConMap map[string]*Conversation

func newConMap() ConMap {
	return make(ConMap)
}

func (m ConMap) create(name string, clients []*Client) {
	id := utils.PseudoUuid8()
	m[id] = &Conversation{
		Id:      id,
		Name:    name,
		Clients: clients,
	}
	for i := 0; i < len(clients); i++ {
		member := clients[i]
		member.conversations[m[id]] = true
		member.send <- Message{
			Kind:    "ConversationCreated",
			Payload: *m[id],
		}
	}
}

type ConversationMessage struct {
	Id        string `json:"id"`
	Client    string `json:"user"`
	Message   string `json:"message"`
	Timestamp int64  `json:"timestamp"`
}

func (m ConMap) newMessage(id string, client *Client, msg string) {
	con, ok := m[id]
	if !ok {
		return
	}
	for i := 0; i < len(con.Clients); i++ {
		member := con.Clients[i]
		member.send <- Message{
			Kind: "NewConversationMessage",
			Payload: ConversationMessage{
				Id:        id,
				Client:    client.Id,
				Message:   msg,
				Timestamp: time.Now().Unix(),
			},
		}
	}
}
