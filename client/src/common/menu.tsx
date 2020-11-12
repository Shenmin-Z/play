import React, { FC, CSSProperties, useReducer } from "react";

type MenuState = {
  show: boolean;
  transitionStatus: "start" | "end";
};

type MenuAction = ["setTransitionStatus", "start" | "end"] | ["toggleShow"];

type MenuReducer = {
  (p: MenuState, c: MenuAction): MenuState;
};

export let Menu: FC = () => {
  let [menuState, menuDispatch] = useReducer<MenuReducer>(
    (state, action) => {
      let [type, payload] = action;
      switch (type) {
        case "toggleShow":
          return { ...state, show: !state.show };
        case "setTransitionStatus":
          return { ...state, transitionStatus: payload };
        default:
          return state;
      }
    },
    {
      show: false,
      transitionStatus: "start"
    }
  );

  let toggleShow = () => {
    if (menuState.show) {
      menuDispatch(["setTransitionStatus", "start"]);
      setTimeout(() => {
        menuDispatch(["toggleShow"]);
      }, 500);
    } else {
      menuDispatch(["toggleShow"]);
      setTimeout(() => {
        menuDispatch(["setTransitionStatus", "end"]);
      });
    }
  };

  return (
    <>
      {menuState.show && (
        <div
          style={{
            width: "100%",
            height: "100%",
            marginTop: 40,
            position: "fixed",
            opacity: menuState.transitionStatus === "end" ? 1 : 0,
            transition: "opacity 0.5s ease 0s",
            top: 0,
            left: 0,
            backgroundColor: "#ffffff"
          }}
        >
          <div
            style={{
              transform: `translate(0px, ${
                menuState.transitionStatus === "end" ? 40 : 80
              }px)`,
              transition: "transform 0.5s ease 0s",
              paddingLeft: 20
            }}
          >
            <div>
              <div
                style={{
                  color: "#6d6d6d",
                  fontSize: 14,
                  fontWeight: 700,
                  lineHeight: 3,
                  textAlign: "start",
                  letterSpacing: "0.08em"
                }}
              >
                TOOLS
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {[
                ["Add a Play Button", "#play-button"],
                ["Create a Repeat Pattern", "#repeat-pattern"],
                ["Chat", "#chat"]
              ].map(([name, hash]) => (
                <a
                  key={name}
                  style={linkStyle}
                  href={hash}
                  onClick={toggleShow}
                >
                  {name}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
      <div
        style={{
          backgroundColor: "#20232a",
          bottom: 20,
          right: 20,
          width: 50,
          height: 50,
          cursor: "pointer",
          position: "fixed",
          zIndex: 3,
          borderRadius: "50%"
        }}
        onClick={toggleShow}
      >
        <svg viewBox="0 0 4 4">
          <g
            stroke="#fff"
            strokeWidth={0.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1={1.2} y1={1.3} x2={2.8} y2={1.3} />
            <line x1={1.2} y1={2} x2={2.8} y2={2} />
            <line x1={1.2} y1={2.7} x2={2.8} y2={2.7} />
          </g>
        </svg>
      </div>
    </>
  );
};

let linkStyle: CSSProperties = {
  color: "#1a1a1a",
  borderBottom: "1px solid transparent",
  marginTop: 5,
  textDecoration: "none"
};
