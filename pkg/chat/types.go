package chat

import (
	"encoding/json"
)

type IncomingMessage struct {
	Kind    string          `json:"kind"`
	Payload json.RawMessage `json:"payload"`
}

type Message struct {
	Kind    string      `json:"kind"`
	Payload interface{} `json:"payload"`
}

type BroadCast struct {
	Targets []string `json:"targets"`
	Message Message  `json:"message"`
}
