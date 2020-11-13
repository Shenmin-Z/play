import React, { FC } from "react";
import { ChatRow, imageSrc, formatTime } from "./common";
import { useChatContext } from "./chat-context";

export let Chats: FC = () => {
  let { chatState, chatDispatch } = useChatContext();
  let {
    conversations,
    contacts,
    self,
    en_zh,
    conversationNotification
  } = chatState;

  return (
    <div
      style={{
        backgroundColor: "#fff",
        height: "calc(100vh - 111px)",
        overflow: "auto"
      }}
    >
      {Array.from(conversations.values()).map(c => {
        if (c.users.length === 2) {
          let other = c.users.find(i => i.id !== self.id);
          other = contacts.get(other.id) || other;
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
              notifications={conversationNotification.get(c.id) || 0}
              onClick={() => {
                chatDispatch(["setCurrentConversation", c]);
                chatDispatch(["setStatus", "conversation"]);
                chatDispatch(["clearConversationNotification", c.id]);
              }}
            />
          );
        }
      })}
    </div>
  );
};
