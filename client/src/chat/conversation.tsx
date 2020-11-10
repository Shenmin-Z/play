import React, { FC, useReducer, Reducer } from "react";
import { useChatContext } from "./chat-context";
import { BG_GRAY, BG_WHITE, TEXT_GRAY } from "./colors";
import { imageSrc } from "./common";
import { Wifi, Smile, Add } from "./svg";
import { ChatMessage } from "./types";

type State = {
  textarea: {
    height: string;
  };
};

type Action = ["setTextareaHeight", string];

export let Conversation: FC = () => {
  let { chatState } = useChatContext();
  let { self, currentConversation } = chatState;
  let history = currentConversation.history;

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
        default:
          return state;
      }
    },
    {
      textarea: { height: "auto" }
    }
  );

  let { textarea } = state;

  return (
    <div
      style={{
        backgroundColor: BG_GRAY,
        height: "100%",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <div style={{ flexGrow: 1, margin: "10px 10px 0 10px" }}>
        {history.map(i => (
          <ChatSingle key={i.timestamp} showTime content={i} />
        ))}
        <ChatSingle
          showTime
          content={{
            user: {
              id: "aaa",
              name: "text",
              profile: false
            },
            text: "test test test test",
            timestamp: 1604978909600
          }}
        />
        <ChatSingle
          showTime
          content={{
            user: self,
            text: "hello hello hello hello hello hello",
            timestamp: 1604984653366
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          backgroundColor: BG_WHITE,
          padding: "0 3px"
        }}
      >
        <div style={{ margin: "7px 5px" }}>
          <Wifi width={26} />
        </div>
        <textarea
          rows={1}
          style={{
            flexGrow: 1,
            padding: 0,
            margin: "8px 2px",
            border: "8px solid #fff",
            borderRadius: "5px",
            outline: "none",
            resize: "none",
            fontSize: "18px",
            height: textarea.height
          }}
          onInput={({ target }) => {
            let textarea = target as HTMLTextAreaElement;
            let previous = textarea.style.height;
            textarea.style.height = "auto";
            let nextHeight = textarea.scrollHeight + "px";
            textarea.style.height = previous;
            dispath(["setTextareaHeight", nextHeight]);
          }}
        />
        <div style={{ margin: "7px 5px" }}>
          <Smile width={26} />
        </div>
        <div style={{ margin: "7px 5px" }}>
          <Add width={26} />
        </div>
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
  let { en_zh, self } = chatState;
  let isSelf = self.id === user.id;

  let time = (() => {
    let time = new Date(timestamp);
    let hours = time.getHours();
    let isAM = hours <= 12;
    hours = hours > 12 ? hours - 12 : hours;
    let minutes = time.getMinutes() + "";
    minutes = minutes.length === 1 ? "0" + minutes : minutes;
    return en_zh(
      `${hours}:${minutes} ${isAM ? "AM" : "PM"}`,
      `${isAM ? "上午" : "下午"} ${hours}:${minutes}`
    );
  })();

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
              whiteSpace: "break-spaces"
            }}
          >
            {text}
          </div>
        </div>
      </div>
    </div>
  );
};
