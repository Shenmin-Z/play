import React, { FC, useEffect, ReactElement, useRef } from "react";
import { ChatProvider, useChatContext } from "./chat-context";
import { Header } from "./header";
import { Footer } from "./footer";
import { Conversation } from "./conversation";
import { Chats } from "./chats";
import { Contacts } from "./contacts";
import { Discover } from "./discover";
import { Me } from "./me";
import { EditProfile } from "./edit-profile";
import { BG_GRAY } from "./colors";

export let Chat: FC = () => {
  useEffect(() => {
    let meta = document.querySelector("meta[name=viewport]");
    if (!meta) return;
    let previous = meta.getAttribute("content");
    meta.setAttribute("content", previous + ", user-scalable=no");
    return () => {
      meta.setAttribute("content", previous);
    };
  }, []);

  return (
    <ChatProvider>
      {/* Hack to hide address bar :( */}
      <div style={{ height: 2000 }} />
      <div
        style={{
          position: "fixed",
          width: "100vw",
          height: "100%",
          background: "#4A5568",
          top: 0,
          zIndex: 3,
          font: `Arial, "微软雅黑"`
        }}
      >
        <Route />
      </div>
    </ChatProvider>
  );
};

let Route: FC = () => {
  let { chatState, chatDispatch } = useChatContext();
  let { status, wsJsonSender, hasUpdate } = chatState;

  let statusRef = useRef(status);
  statusRef.current = status;

  useEffect(() => {
    switch (status) {
      case "contacts": {
        if (!wsJsonSender) return;
        wsJsonSender({ kind: "GetClientList" });
        chatDispatch(["clearClientUpdateNotification"]);
      }
    }
  }, [status, wsJsonSender]);

  useEffect(() => {
    if (hasUpdate) {
      wsJsonSender({ kind: "GetClientList" });
      chatDispatch(["clearClientUpdateNotification"]);
    }
  }, [hasUpdate]);

  let display = (show: boolean, elm: ReactElement) => (
    <div style={{ display: show ? "block" : "none", flexGrow: 1 }}>{elm}</div>
  );

  return (
    <div
      style={{
        background: BG_GRAY,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        maxWidth: 600,
        margin: "auto"
      }}
    >
      <Header />
      {display(status === "conversation", <Conversation />)}
      {display(status === "chats", <Chats />)}
      {display(status === "discover", <Discover />)}
      {display(status === "contacts", <Contacts />)}
      {display(status === "me", <Me />)}
      {display(status === "my-profile", <EditProfile />)}
      <Footer />
    </div>
  );
};
