package chat

type Message struct {
	Kind    string `json:"kind"`
	Payload string `json:"payload"`
}

type BroadCast struct {
	Targets []string `json:"targets"`
	Message Message  `json:"message"`
}
