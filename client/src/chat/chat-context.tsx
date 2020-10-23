import React, {
  FC,
  createContext,
  Dispatch,
  useContext,
  useReducer,
  useEffect
} from "react";
import { Message } from "./types";

type ChatStatus =
  | "chats"
  | "contacts"
  | "discover"
  | "me"
  | "conversation"
  | "my-profile";
type ChatLanguage = "zh" | "en";

type ChatState = {
  status: ChatStatus;
  lang: ChatLanguage;
  wsConn: WebSocket;
};

type ChatAction =
  | ["setStatus", ChatStatus]
  | ["setLang", ChatLanguage]
  | ["setWsConn", WebSocket];

type ChatReducer = {
  (p: ChatState, a: ChatAction): ChatState;
};

type ChatContext = {
  chatState: ChatState;
  chatDispatch: Dispatch<ChatAction>;
};

let ChatContext = createContext<ChatContext>(null);

export let useChatContext = () => useContext(ChatContext);

export let ChatProvider: FC = props => {
  let [chatState, chatDispatch] = useReducer<ChatReducer>(
    (state, action) => {
      let [type, payload] = action;
      switch (type) {
        case "setLang":
          return { ...state, lang: payload as ChatLanguage };
        case "setStatus":
          return { ...state, status: payload as ChatStatus };
        case "setWsConn":
          return { ...state, wsConn: payload as WebSocket };
        default:
          return state;
      }
    },
    {
      status: "my-profile",
      lang: "en",
      wsConn: null
    }
  );

  useEffect(function connect(retry = true) {
    let protocol = location.protocol === "https:" ? "wss" : "ws";
    let conn = new WebSocket(
      `${protocol}://` + document.location.host + "/chat-ws"
    );
    conn.onopen = () => {
      console.log("WS Connected.");
      retry = true;
      chatDispatch(["setWsConn", conn]);
    };
    conn.onclose = () => {
      if (!retry) {
        console.log("Connection lost.");
      } else {
        console.log("Connection lost, trying...");
        setTimeout(() => {
          connect(true);
        }, 2000);
      }
      chatDispatch(["setWsConn", null]);
    };
    conn.onmessage = e => {
      let messages: Message = JSON.parse(e.data);
      if (messages.kind === "ProfileUploaded") {
        //setProfile(messages.payload);
      }
    };
  }, []);

  return (
    <ChatContext.Provider
      value={{
        chatDispatch,
        chatState
      }}
    >
      {props.children}
    </ChatContext.Provider>
  );
};
