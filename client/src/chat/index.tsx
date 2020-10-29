import React, { FC, useEffect, useState, useRef } from "react";
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
        <div>
          {/*
        <form
          onSubmit={() => {
            let msg = document.getElementById("msg") as HTMLInputElement;
            if (!conn) {
              return false;
            }
            if (!msg.value) {
              return false;
            }
            conn.send(JSON.stringify({ kind: "aaa", payload: msg.value }));
            msg.value = "";
            return false;
          }}
        >
          <input type="submit" value="Send" />
          <input type="text" id="msg" size={64} autoFocus />
        </form>
          */}
        </div>
      </div>
    </ChatProvider>
  );
};

let Route: FC = () => {
  let { chatState } = useChatContext();
  let { status } = chatState;

  let content = null;
  switch (status) {
    case "chats":
      content = <Chats />;
      break;
    case "discover":
      content = <Discover />;
      break;
    case "contacts":
      content = <Contacts />;
      break;
    case "me":
      content = <Me />;
      break;
    case "my-profile":
      content = <EditProfile />;
      break;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh"
      }}
    >
      <Header />
      <div style={{ flexGrow: 1 }}>{content}</div>
      <Footer />
    </div>
  );
};
