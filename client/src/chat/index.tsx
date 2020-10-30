import React, { FC, useEffect, ReactElement } from "react";
import { ChatProvider, useChatContext } from "./chat-context";
import { Header } from "./header";
import { Footer } from "./footer";
import { Chats } from "./chats";
import { Contacts } from "./contacts";
import { Discover } from "./discover";
import { Me } from "./me";
import { EditProfile } from "./edit-profile";

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
      <div
        style={{
          position: "fixed",
          width: "100vw",
          height: "100vh",
          backgroundColor: "#fff",
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
  let { chatState } = useChatContext();
  let { status } = chatState;

  let display = (show: boolean, elm: ReactElement) => (
    <div style={{ display: show ? "block" : "none", flexGrow: 1 }}>{elm}</div>
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh"
      }}
    >
      <Header />
      {display(status === "chats", <Chats />)}
      {display(status === "discover", <Discover />)}
      {display(status === "contacts", <Contacts />)}
      {display(status === "me", <Me />)}
      {display(status === "my-profile", <EditProfile />)}
      <Footer />
    </div>
  );
};
