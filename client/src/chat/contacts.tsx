import React, { FC } from "react";
import { Row, RowGroup, ProfileImageOther } from "./common";
import { BG_GRAY } from "./colors";
import { imageSrc } from "./common";
import { useChatContext } from "./chat-context";

export let Contacts: FC = () => {
  let { chatState, chatDispatch } = useChatContext();
  let { contacts, wsJsonSender, self, ucMap, conversations } = chatState;

  return (
    <div
      style={{
        backgroundColor: BG_GRAY,
        height: "calc(100vh - 111px)",
        overflow: "auto"
      }}
    >
      <RowGroup>
        {Array.from(contacts.values()).map(c => (
          <Row
            key={c.id}
            text={c.name}
            image={<ProfileImageOther src={imageSrc(c)} />}
            onClick={() => {
              if (c.id === self.id) return;
              let existingConversation = conversations.get(ucMap.get(c.id));
              if (existingConversation) {
                chatDispatch(["setCurrentConversation", existingConversation]);
                chatDispatch(["setStatus", "conversation"]);
                chatDispatch([
                  "clearConversationNotification",
                  existingConversation.id
                ]);
              } else {
                wsJsonSender({
                  kind: "CreateConversation",
                  payload: {
                    name: "",
                    users: [self.id, c.id]
                  }
                });
              }
            }}
          />
        ))}
      </RowGroup>
    </div>
  );
};
