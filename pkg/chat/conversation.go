package chat

import (
	"github.com/shenmin-z/draw/pkg/utils"
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
	for i := 0; i < len(m[id].Clients); i++ {
		member := m[id].Clients[i]
		member.send <- Message{
			Kind:    "ConversationCreated",
			Payload: *m[id],
		}
	}
}

type ConversationMessage struct {
	Id      string `json:"id"`
	Client  string `json:"client"`
	Message string `json:"message"`
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
				Id:      id,
				Client:  client.Id,
				Message: msg,
			},
		}
	}
}
