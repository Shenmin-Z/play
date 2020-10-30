import React, {
  FC,
  createContext,
  Dispatch,
  useContext,
  useReducer,
  useEffect
} from "react";
import { IncomingMessage, OutgoingMessage, User, Conversation } from "./types";

export type ChatStatus =
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
  en_zh: (en: string, zh: string) => string;
  wsConn: WebSocket;
  wsJsonSender: (m: OutgoingMessage) => void;
  self: User;
  contacts: Map<string, User>;
  conversations: Map<string, Conversation>;
};

type ChatAction =
  | ["setStatus", ChatStatus]
  | ["setLang", ChatLanguage]
  | ["setWsConn", WebSocket]
  | ["setSelf", Partial<User>];

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
          return {
            ...state,
            lang: payload as ChatLanguage,
            en_zh: (en, zh) => (payload === "en" ? en : zh)
          };
        case "setStatus":
          return { ...state, status: payload as ChatStatus };
        case "setWsConn":
          return {
            ...state,
            wsConn: payload as WebSocket,
            wsJsonSender: m => {
              (payload as WebSocket).send(JSON.stringify(m));
            }
          };
        case "setSelf":
          return { ...state, self: { ...state.self, ...(payload as User) } };
        default:
          return state;
      }
    },
    {
      status: "my-profile",
      lang: "en",
      wsConn: null,
      wsJsonSender: null,
      self: { id: null, name: null, hasProfile: false },
      en_zh: en => en,
      contacts: new Map(),
      conversations: new Map()
    }
  );

  useEffect(function connect(retry = 5) {
    let protocol = location.protocol === "https:" ? "wss" : "ws";
    let conn = new WebSocket(
      `${protocol}://` + document.location.host + "/chat-ws"
    );
    conn.onopen = () => {
      console.log("WS Connected.");
      retry = 5;
      chatDispatch(["setWsConn", conn]);
    };
    conn.onclose = () => {
      if (retry < 1) {
        console.log("Connection lost.");
      } else {
        let delay = Math.pow(2, 6 - retry);
        console.log(`Connection lost, retrying in ${delay} seconds...`);
        setTimeout(() => {
          connect(retry - 1);
        }, delay * 1000);
      }
      chatDispatch(["setWsConn", null]);
    };
    conn.onmessage = e => {
      let message: IncomingMessage = JSON.parse(e.data);
      switch (message.kind) {
        case "ProfileUploaded": {
          chatDispatch(["setSelf", { hasProfile: true }]);
          break;
        }
        case "ClientCreated": {
          chatDispatch(["setSelf", { id: message.payload }]);
          break;
        }
        case "NameUpdated": {
          chatDispatch(["setSelf", { name: message.payload }]);
          break;
        }
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
