import React, { FC, useReducer, Reducer, useRef, useEffect } from "react";
import { useChatContext } from "./chat-context";
import { BG_GRAY, BG_WHITE, TEXT_GRAY } from "./colors";
import { imageSrc, formatTime } from "./common";
import { Wifi, Smile, Add } from "./svg";
import { ChatMessage } from "./types";

type State = {
  textarea: {
    height: string;
    content: string;
  };
  bottomHeight: number;
};

type Action =
  | ["setTextareaHeight", string]
  | ["setTextareaContent", string]
  | ["setBottomHeight", number];

export let Conversation: FC = () => {
  let { chatState } = useChatContext();
  let { self, currentConversation, en_zh, wsJsonSender } = chatState;

  let [state, dispath] = useReducer<Reducer<State, Action>>(
    (state, action) => {
      let [kind, payload] = action;
      switch (kind) {
        case "setTextareaHeight": {
          return {
            ...state,
            textarea: { ...state.textarea, height: payload as string }
          };
        }
        case "setTextareaContent": {
          return {
            ...state,
            textarea: { ...state.textarea, content: payload as string }
          };
        }
        case "setBottomHeight":
          return { ...state, bottomHeight: payload as number };
        default:
          return state;
      }
    },
    {
      textarea: { height: "auto", content: "" },
      bottomHeight: 50
    }
  );

  let { textarea, bottomHeight } = state;

  let textareaRef = useRef<HTMLTextAreaElement>(null);
  let bottomRef = useRef<HTMLDivElement>(null);
  let containerRef = useRef<HTMLDivElement>(null);
  let adjustTextAreaHeight = () => {
    if (!textareaRef.current) return;

    let textarea = textareaRef.current;
    let previous = textarea.style.height;
    textarea.style.height = "auto";
    let nextHeight = textarea.scrollHeight + "px";
    textarea.style.height = previous;
    dispath(["setTextareaHeight", nextHeight]);
  };
  let scrollToBottom = () => {
    if (!containerRef.current) return;
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  };
  let adjustDialogHeight = () => {
    if (!bottomRef.current) return;
    dispath(["setBottomHeight", bottomRef.current.offsetHeight]);
  };
  let history = currentConversation?.history || [];
  useEffect(scrollToBottom, [bottomHeight, history.length]);
  if (!currentConversation) return null;

  return (
    <div
      ref={containerRef}
      style={{
        backgroundColor: BG_GRAY,
        height: `calc(100vh - 40px - ${bottomHeight}px)`,
        overflow: "auto"
      }}
    >
      <div style={{ margin: "10px 10px 0 10px" }}>
        {history.map((i, idx) => {
          let showTime = true;
          if (idx > 0) {
            showTime = history[idx].timestamp - history[idx - 1].timestamp > 60;
          }
          return (
            <ChatSingle key={i.timestamp} showTime={showTime} content={i} />
          );
        })}
      </div>
      <div
        ref={bottomRef}
        style={{
          display: "flex",
          alignItems: "flex-end",
          backgroundColor: BG_WHITE,
          padding: "0 3px",
          width: "100vw",
          maxWidth: 600 - 6,
          position: "absolute",
          bottom: 0
        }}
      >
        <div style={{ margin: "7px 5px" }}>
          <Wifi width={26} />
        </div>
        <textarea
          ref={textareaRef}
          rows={1}
          value={textarea.content}
          onChange={e => {
            dispath(["setTextareaContent", e.target.value]);
            setTimeout(adjustDialogHeight, 0);
          }}
          style={{
            flexGrow: 1,
            padding: 0,
            margin: "8px 2px",
            border: "8px solid #fff",
            borderRadius: "5px",
            outline: "none",
            resize: "none",
            fontSize: "18px",
            height: textarea.height,
            overflow: "hidden"
          }}
          onFocus={scrollToBottom}
          onInput={adjustTextAreaHeight}
        />
        <div style={{ margin: "7px 5px" }}>
          <Smile width={26} />
        </div>
        {textarea.content === "" ? (
          <div style={{ margin: "7px 5px" }}>
            <Add width={26} />
          </div>
        ) : (
          <div
            style={{
              backgroundColor: "#07C160",
              padding: 7,
              minWidth: 45,
              borderRadius: 5,
              color: "#fff",
              textAlign: "center",
              margin: "0 6px 10px 2px",
              cursor: "pointer"
            }}
            onClick={() => {
              if (currentConversation.alive === false) {
                alert(en_zh("The other side has left.", "对方已离开。"));
              } else {
                wsJsonSender({
                  kind: "NewConversationMessage",
                  payload: {
                    id: currentConversation.id,
                    sender: self.id,
                    message: textarea.content
                  }
                });
                dispath(["setTextareaContent", ""]);
                setTimeout(() => {
                  adjustTextAreaHeight();
                  adjustDialogHeight();
                  scrollToBottom();
                }, 0);
              }
            }}
          >
            {en_zh("Send", "发送")}
          </div>
        )}
      </div>
    </div>
  );
};

type ChatProps = {
  content: ChatMessage;
  showTime: boolean;
};

let ChatSingle: FC<ChatProps> = ({ content, showTime }) => {
  let { timestamp, user, text } = content;
  let { chatState } = useChatContext();
  let { en_zh, self, contacts } = chatState;
  user = contacts.get(user.id) || user;
  let isSelf = self.id === user.id;
  let time = formatTime(timestamp, en_zh);

  return (
    <div>
      {showTime && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            color: TEXT_GRAY,
            fontSize: "14px"
          }}
        >
          <span>{time}</span>
        </div>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: isSelf ? "flex-end" : "flex-start",
          alignItems: "flex-start",
          margin: `
            10px 
            ${isSelf ? "0px" : "60px"} 
            10px 
            ${isSelf ? "60px" : "0px"}
          `
        }}
      >
        <img
          src={imageSrc(user)}
          style={{
            width: 40,
            height: 40,
            borderRadius: "5px",
            order: isSelf ? 1 : 0
          }}
        />
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              width: 10,
              height: 10,
              [isSelf ? "right" : "left"]: 12,
              top: 15,
              backgroundColor: isSelf ? "#95EC69" : "#fff",
              transform: "rotate(45deg)"
            }}
          />
          <div
            style={{
              backgroundColor: isSelf ? "#95EC69" : "#fff",
              [isSelf ? "marginRight" : "marginLeft"]: 15,
              padding: 10,
              borderRadius: "5px",
              fontSize: "17px",
              whiteSpace: "break-spaces",
              maxWidth: "calc(100vw - 110px)",
              overflow: "auto"
            }}
          >
            {text}
          </div>
        </div>
      </div>
    </div>
  );
};
