import React, { FC } from "react";
import { Row, RowGroup, ProfileImageOther } from "./common";
import { BG_GRAY } from "./colors";
import { imageSrc } from "./common";
import { useChatContext } from "./chat-context";

export let Contacts: FC = () => {
  let { chatState } = useChatContext();
  let { contacts, wsJsonSender, self } = chatState;

  return (
    <div style={{ backgroundColor: BG_GRAY, height: "100%" }}>
      <RowGroup>
        {Array.from(contacts.values()).map(c => (
          <Row
            key={c.id}
            text={c.name}
            image={<ProfileImageOther src={imageSrc(c)} />}
            onClick={() => {
              if (c.id === self.id) return;
              wsJsonSender({
                kind: "CreateConversation",
                payload: {
                  name: "",
                  users: [self.id, c.id]
                }
              });
            }}
          />
        ))}
      </RowGroup>
    </div>
  );
};
