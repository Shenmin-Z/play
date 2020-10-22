import React, {
  FC,
  createContext,
  Dispatch,
  useContext,
  useReducer
} from "react";

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
};

type ChatAction = ["setStatus", ChatStatus] | ["setLang", ChatLanguage];

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
        default:
          return state;
      }
    },
    {
      status: "my-profile",
      lang: "en"
    }
  );

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
