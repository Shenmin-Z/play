import React, { FC, useReducer } from "react";

const SIZE = 40;
const BG = "rgb(241, 243, 244)";
const BUTTON = "rgb(220, 222, 224)";

type Mode = "move" | "resize" | "rd1" | "rd2";

type State = {
  mode: Mode;
};

type Action = ["setMode", Mode];

type Reducer = {
  (p: State, a: Action): State;
};

export let Toolbar: FC = () => {
  let [state, dispatch] = useReducer<Reducer>(
    (state, action) => {
      let [type, payload] = action;
      switch (type) {
        case "setMode": {
          return { ...state, mode: payload };
        }
        default:
          return state;
      }
    },
    { mode: null }
  );

  let { mode } = state;

  return (
    <div
      style={{
        width: SIZE,
        backgroundColor: BG,
        border: `10px solid ${BG}`,
        borderRadius: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "default"
      }}
    >
      <Button
        title="move"
        onMouseOver={() => {
          dispatch(["setMode", "move"]);
        }}
        onMouseLeave={() => {
          dispatch(["setMode", null]);
        }}
      >
        <TextIcon text="Move" active={mode === "move"} activeText={"M"} />
      </Button>
      <Button
        title="resize"
        onMouseOver={() => {
          dispatch(["setMode", "resize"]);
        }}
        onMouseLeave={() => {
          dispatch(["setMode", null]);
        }}
      >
        <TextIcon text="Resize" active={mode === "resize"} activeText={"R"} />
      </Button>
      <Button
        title="repeat direction 1"
        onMouseOver={() => {
          dispatch(["setMode", "rd1"]);
        }}
        onMouseLeave={() => {
          dispatch(["setMode", null]);
        }}
      >
        <TextIcon text="RD1" active={mode === "rd1"} activeText={"1"} />
      </Button>
      <Button
        title="repeat direction 2"
        onMouseOver={() => {
          dispatch(["setMode", "rd2"]);
        }}
        onMouseLeave={() => {
          dispatch(["setMode", null]);
        }}
      >
        <TextIcon text="RD2" active={mode === "rd2"} activeText={"2"} />
      </Button>
    </div>
  );
};

type ButtonProps = {
  title: string;
  onMouseOver: () => void;
  onMouseLeave: () => void;
};

let Button: FC<ButtonProps> = ({
  title,
  children,
  onMouseOver,
  onMouseLeave
}) => {
  return (
    <div
      style={{
        width: SIZE,
        height: SIZE,
        lineHeight: SIZE + "px",
        borderRadius: "50%",
        textAlign: "center",
        backgroundColor: BUTTON,
        margin: "5px"
      }}
      title={title}
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  );
};

type TextIconProps = {
  text: string;
  active: boolean;
  activeText: string;
};

let TextIcon: FC<TextIconProps> = ({ text, active, activeText }) => {
  return (
    <span
      style={{
        fontSize: active ? 16 : 8,
        fontWeight: active ? "bold" : "normal",
        color: "rgb(98, 99, 101)"
      }}
    >
      {active ? activeText : text}
    </span>
  );
};
