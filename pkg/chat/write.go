package chat

import (
	"encoding/json"
	"errors"
	"time"

	"github.com/gorilla/websocket"
)

func (c *Client) write(conMap ConMap) {
	ticker := time.NewTicker(pingPeriod)

	var writeErr error

	defer func() {
		ticker.Stop()
		c.cleanAndPrint(writeErr, "WRITE", conMap)
	}()

	flush := func(message Message) error {
		w, err := c.conn.NextWriter(websocket.TextMessage)
		if err != nil {
			return err
		}
		jsonMsg, err := json.Marshal(message)
		if err != nil {
			return err
		}
		w.Write(jsonMsg)

		if err := w.Close(); err != nil {
			return err
		}
		return nil
	}

	flush(Message{
		Kind:    "ClientCreated",
		Payload: c,
	})

out:
	for {
		select {
		case message, ok := <-c.send:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				writeErr = errors.New("Client send channel is closed.")
				break out
			}

			if err := flush(message); err != nil {
				writeErr = err
				break out
			}
		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				writeErr = err
				break out
			}
		}
	}
}
