import React, { FC } from "react";
import { ChatRow, imageSrc, formatTime } from "./common";
import { useChatContext } from "./chat-context";

export let Chats: FC = () => {
  let { chatState, chatDispatch } = useChatContext();
  let { conversations, self, en_zh } = chatState;

  return (
    <div>
      {Array.from(conversations.values()).map(c => {
        if (c.users.length === 2) {
          let other = c.users.find(i => i.id !== self.id);
          let latest = c.history[c.history.length - 1] || {
            text: "",
            timestamp: 0
          };
          return (
            <ChatRow
              key={c.id}
              img={imageSrc(other)}
              title={other.name}
              latest={latest.text}
              time={formatTime(latest.timestamp, en_zh)}
              onClick={() => {
                chatDispatch(["setCurrentConversation", c]);
                chatDispatch(["setStatus", "conversation"]);
              }}
            />
          );
        }
      })}
      <ChatRow
        img="/public/chat-images/bird_ooruri.png"
        title="Ooruri"
        latest="Okay."
        time="8:57 AM"
      />
      <ChatRow
        img="/public/chat-images/plant_kokemomo.png"
        title="Kokemomo"
        latest="See ya"
        time="Yesterday"
      />
    </div>
  );
};
