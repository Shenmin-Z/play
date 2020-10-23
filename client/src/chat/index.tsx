import React, { FC, useEffect, useState, useRef } from "react";
import { Title } from "../common";
import { ChatProvider } from "./chat-context";

export let Chat: FC = () => {
  let [conn, setConn] = useState<WebSocket>(null);
  let [profile, setProfile] = useState(null);

  useEffect(() => {
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