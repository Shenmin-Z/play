import React, { FC } from "react";
import { useChatContext } from "./chat-context";
import { BG_GRAY } from "./colors";
import { LeftArrow, More } from "./svg";

export let Header: FC = () => {
  let { chatState, chatDispatch } = useChatContext();
  let { status, en_zh, currentConversation, self, contacts } = chatState;

  let text = null;
  let hasArrow = false;
  let onClick = () => {};

  switch (status) {
    case "conversation": {
      let { name, users } = currentConversation;
      if (!name) {
        let other = (users || []).find(i => i.id !== self.id);
        name = (contacts.get(other.id) || other).name;
      }
      text = (
        <div
          style={{
            flexGrow: 1,
            marginRight: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          {name}
          <More width={15} onClick={() => {}} />
        </div>
      );
      hasArrow = true;
      onClick = () => {
        chatDispatch(["setStatus", "chats"]);
      };
      break;
    }
    case "chats":
      text = en_zh("Chats", "聊天");
      break;
    case "contacts":
      text = en_zh("Contacts", "通讯录");
      break;
    case "discover":
      text = en_zh("Discover", "发现");
      break;
    case "my-profile":
      text = en_zh("My Profile", "个人信息");
      hasArrow = true;
      onClick = () => {
        chatDispatch(["setStatus", "me"]);
      };
      break;
  }

  if (text === null) return null;

  return (
    <div
      style={{
        height: 40,
        backgroundColor: BG_GRAY,
        fontSize: "18px",
        fontWeight: 500,
        display: "flex",
        alignItems: "center",
        paddingLeft: status === "conversation" ? 10 : 20,
        borderBottom: "1px solid #E9E9E9"
      }}
    >
      {hasArrow && (
        <>
          <LeftArrow width={7} onClick={onClick} />
          <div style={{ width: 15 }} />
        </>
      )}
      {text}
    </div>
  );
};
