import React, {
  FC,
  createContext,
  Dispatch,
  useContext,
  useReducer,
  useEffect
} from "react";
import {
  IncomingMessage,
  OutgoingMessage,
  User,
  Conversation,
  NewConversationMessage
} from "./types";

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
  ucMap: Map<string, string>;
  currentConversation: Conversation;
  hasUpdate: boolean;
  conversationNotification: Map<string, number>;
};

type ChatAction =
  | ["setStatus", ChatStatus]
  | ["setLang", ChatLanguage]
  | ["setWsConn", WebSocket]
  | ["setSelf", Partial<User>]
  | ["setContacts", User[]]
  | ["setClientUpdateNotification"]
  | ["clearClientUpdateNotification"]
  | ["setCurrentConversation", Conversation]
  | ["newConversation", Omit<Conversation, "history">]
  | ["killConversation", string]
  | ["newConversationMessage", NewConversationMessage]
  | ["addConversationNotification", string]
  | ["clearConversationNotification", string];

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
            wsJsonSender:
              payload === null
                ? null
                : m => {
                    (payload as WebSocket).send(JSON.stringify(m));
                  }
          };
        case "setSelf":
          return { ...state, self: { ...state.self, ...(payload as User) } };
        case "setContacts": {
          let clients = payload as User[];
          let map = new Map<string, User>();
          clients.forEach(c => {
            map.set(c.id, c);
          });
          return { ...state, contacts: map };
        }
        case "setClientUpdateNotification":
          return { ...state, hasUpdate: true };
        case "clearClientUpdateNotification":
          return { ...state, hasUpdate: false };
        case "setCurrentConversation":
          return { ...state, currentConversation: payload as Conversation };
        case "newConversation": {
          let { id, name, users } = payload as Conversation;
          let pm = state.conversations;
          let nm = new Map(pm);
          let nc = { id, name, users, history: [], alive: true };
          nm.set(id, nc);
          users.forEach(u => {
            if (u.id !== state.self.id) {
              state.ucMap.set(u.id, id);
            }
          });
          let result = { ...state, conversations: nm };
          if (users?.[0].id === state.self.id) {
            result.currentConversation = nc;
            result.status = "conversation";
          }
          return result;
        }
        case "killConversation": {
          let id = payload as string;
          let pm = state.conversations;
          let nm = new Map(pm);
          let nc = nm.get(id);
          if (!nc) return state;
          nc = { ...nc, alive: false };
          nm.set(id, nc);
          let result = { ...state, conversations: nm };
          if (state.currentConversation?.id === id) {
            result.currentConversation = {
              ...state.currentConversation,
              alive: false
            };
          }
          return result;
        }
        case "newConversationMessage": {
          let {
            id,
            user: _user,
            message,
            timestamp
          } = payload as NewConversationMessage;
          let pc = state.conversations.get(id);
          if (!pc) return state;
          let user = state.contacts.get(_user);
          if (!user) return state;
          let nc = {
            ...pc,
            history: [
              ...pc.history,
              {
                user,
                text: message,
                timestamp
              }
            ]
          };
          let nm = new Map(state.conversations);
          nm.set(id, nc);
          let result = { ...state, conversations: nm };
          if (state.currentConversation?.id === id) {
            result.currentConversation = nc;
          }
          return result;
        }
        case "addConversationNotification": {
          let id = payload as string;
          if (
            state.status === "conversation" &&
            id === state.currentConversation?.id
          )
            return state;
          let pc = state.conversationNotification.get(id) || 0;
          let pn = state.conversationNotification;
          let nn = new Map(pn);
          nn.set(id, pc + 1);
          return { ...state, conversationNotification: nn };
        }
        case "clearConversationNotification": {
          let id = payload as string;
          let pn = state.conversationNotification;
          let nn = new Map(pn);
          nn.delete(id);
          return { ...state, conversationNotification: nn };
        }
        default:
          return state;
      }
    },
    {
      status: "me",
      lang: "en",
      wsConn: null,
      wsJsonSender: null,
      self: { id: null, name: null, profile: false },
      en_zh: en => en,
      contacts: new Map(),
      conversations: new Map(),
      ucMap: new Map(),
      currentConversation: null,
      hasUpdate: false,
      conversationNotification: new Map()
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
          chatDispatch(["setSelf", { profile: true }]);
          break;
        }
        case "ClientCreated": {
          chatDispatch(["setSelf", message.payload]);
          break;
        }
        case "NameUpdated": {
          chatDispatch(["setSelf", { name: message.payload }]);
          break;
        }
        case "ClientList": {
          chatDispatch(["setContacts", message.payload]);
          break;
        }
        case "ClientUpdateNotification": {
          chatDispatch(["setClientUpdateNotification"]);
          break;
        }
        case "ConversationCreated": {
          chatDispatch([
            "newConversation",
            { ...message.payload, alive: true }
          ]);
          break;
        }
        case "ConversationKilled": {
          chatDispatch(["killConversation", message.payload]);
          break;
        }
        case "NewConversationMessage": {
          chatDispatch(["newConversationMessage", message.payload]);
          chatDispatch(["addConversationNotification", message.payload.id]);
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
