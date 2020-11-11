import React, { FC } from "react";
import { useChatContext, ChatStatus } from "./chat-context";
import { FOOTER } from "./colors";
import { Chats, Contacts, Discover, Me } from "./svg";

export let Footer: FC = () => {
  let { chatState } = useChatContext();
  let { status } = chatState;

  if (
    status !== "chats" &&
    status !== "contacts" &&
    status !== "discover" &&
    status !== "me"
  )
    return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        backgroundColor: "#F7F7F7",
        width: "100vw",
        maxWidth: 600,
        height: 70,
        margin: "auto",
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
        fontSize: "13px"
      }}
    >
      <Icon type="chats" zh="聊天" en="Chats" />
      <Icon type="contacts" zh="通讯录" en="Contacts" />
      <Icon type="discover" zh="发现" en="Discover" />
      <Icon type="me" zh="我" en="Me" />
    </div>
  );
};

type Props = {
  type: ChatStatus;
  zh: string;
  en: string;
};

const W = 26;

let Icon: FC<Props> = ({ type, zh, en }) => {
  let { chatState, chatDispatch } = useChatContext();
  let { en_zh, status, conversationNotification } = chatState;

  let createClick = (s: ChatStatus) => () => {
    chatDispatch(["setStatus", s]);
  };

  let active = status === type;

  let icon = (() => {
    switch (type) {
      case "chats": {
        let counts = Array.from(conversationNotification.values()).reduce(
          (p, i) => p + i,
          0
        );
        return (
          <div style={{ position: "relative" }}>
            <Chats width={W} highlight={active} />
            <div
              style={{
                display: counts > 0 ? "block" : "none",
                position: "absolute",
                top: 0,
                right: -4,
                width: 15,
                height: 15,
                lineHeight: "15px",
                borderRadius: "50%",
                textAlign: "center",
                color: "#fff",
                background: "#EE0000",
                fontSize: "10px"
              }}
            >
              {counts}
            </div>
          </div>
        );
      }
      case "contacts":
        return <Contacts width={W} highlight={active} />;
      case "discover":
        return <Discover width={W} highlight={active} />;
      case "me":
        return <Me width={W} highlight={active} />;
      default:
        return null;
    }
  })();

  return (
    <div
      style={{
        color: active ? FOOTER : "#000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}
      onClick={createClick(type)}
    >
      {icon}
      {en_zh(en, zh)}
    </div>
  );
};
