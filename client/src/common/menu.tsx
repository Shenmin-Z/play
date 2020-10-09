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
            width: "100vw",
            height: "100vh",
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
                  textTransform: "uppercase",
                  textAlign: "start",
                  letterSpacing: "0.08em"
                }}
              >
                Tools
              </div>
            </div>
            <ul
              style={{
                listStyle: "none",
                paddingLeft: 0
              }}
            >
              <li>
                <a style={linkStyle} href="#play-button" onClick={toggleShow}>
                  Add A Play Button
                </a>
              </li>
              <li>
                <a
                  style={linkStyle}
                  href="#repeat-pattern"
                  onClick={toggleShow}
                >
                  Create A Repeat Pattern
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}
      <div
        style={{
          backgroundColor: "#20232a",
          bottom: 44,
          color: "#61dafb",
          cursor: "pointer",
          position: "fixed",
          right: 20,
          zIndex: 3,
          borderRadius: "50%",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 0 20px rgba(0, 0, 0, 0.3)"
        }}
        onClick={toggleShow}
      >
        <div
          style={{
            padding: "0 20px"
          }}
        >
          <div
            style={{
              height: 60
            }}
          >
            <div
              style={{
                width: 20,
                height: 20
              }}
            ></div>
          </div>
        </div>
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
