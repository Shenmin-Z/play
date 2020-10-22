import React, { FC, useEffect, useState, useRef } from "react";
import { Title } from "../common";
import { ChatProvider } from "./chat-context";
import { Message } from "./types";

export let Chat: FC = () => {
  let [conn, setConn] = useState<WebSocket>(null);
  let [profile, setProfile] = useState(null);

  useEffect(() => {
    let conn = new WebSocket("ws://" + document.location.host + "/chat-ws");
    conn.onclose = () => {
      console.log("Closed.");
    };
    conn.onmessage = evt => {
      let messages: Message = JSON.parse(evt.data);
      if (messages.kind === "ProfileUploaded") {
        setProfile(messages.payload);
      }
    };
    setConn(conn);
  }, []);

  let inputRef = useRef<HTMLInputElement>();

  return (
    <ChatProvider>
      <div>
        <Title name="Chat" />
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
        <input
          ref={inputRef}
          type="file"
          accept=".jpg, .jpeg, .png"
          onChange={() => {
            let files = inputRef.current.files;
            if (files.length === 1) {
              conn.binaryType = "arraybuffer";
              conn.send(files[0]);
            }
          }}
        />
        <img src={"/public/chat-profile/" + profile} />
      </div>
    </ChatProvider>
  );
};
