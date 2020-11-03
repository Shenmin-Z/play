import React, { FC, useReducer, Reducer } from "react";
import { useChatContext } from "./chat-context";
import { BG_GRAY, BG_WHITE, TEXT_GRAY } from "./colors";
import { Wifi, Smile, Add } from "./svg";

type State = {
  textarea: {
    height: string;
  };
};

type Action = ["setTextareaHeight", string];

export let Conversation: FC = () => {
  let { chatState } = useChatContext();
  let { conversations } = chatState;

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
      <div style={{ flexGrow: 1 }}></div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          backgroundColor: BG_WHITE
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
