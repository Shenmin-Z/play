import React, { FC, useReducer, useRef } from "react";
import { ConfigBox } from "./conf-box";
import { PreviewImage } from "./preview-image";
import { useRepeatContext } from "../repeat-context";
import { usePreviewContext } from "./preview-context";

export let Canvas: FC = () => {
  let { repeatState, repeatDispatch } = useRepeatContext();
  let { previewState } = usePreviewContext();
  let { images, canvasSize, active: activeId } = repeatState;
  let { w: width, h: height } = canvasSize;
  let { mode } = previewState;

  let [state, dispatch] = useReducer(
    (state: { overflow: string }, action: ["toggleOverflow"]) => {
      let [type] = action;
      switch (type) {
        case "toggleOverflow":
          return {
            ...state,
            overflow: state.overflow === "auto" ? "hidden" : "auto"
          };
        default:
          return state;
      }
    },
    { overflow: "auto" }
  );

  let cursor = (() => {
    switch (mode) {
      case "move":
        return "grab";
      default:
        return "default";
    }
  })();

  let divRef = useRef<HTMLDivElement>();
  let mouseUp = (e: { clientX: number; clientY: number }) => {
    let active = images.find(i => i.id === activeId);
    if ((mode === "rd1" && !active.r1) || (mode === "rd2" && !active.r2)) {
      let { left, top } = divRef.current.getBoundingClientRect();
      let [x, y] = [e.clientX - left - active.x, e.clientY - top - active.y];
      repeatDispatch([
        "setImage",
        {
          ...active,
          [mode === "rd1" ? "r1" : "r2"]: {
            x,
            y
          }
        }
      ]);
    }
  };

  return (
    <div
      style={{
        marginLeft: 10,
        position: "relative",
        width: "calc(100vw - 110px)",
        minWidth: 450,
        maxWidth: width,
        cursor
      }}
    >
      <div
        style={{
          overflow: state.overflow,
          maxHeight: "calc(100vh - 420px)"
        }}
      >
        <div
          ref={divRef}
          style={{
            width,
            height,
            backgroundColor: "#ffffff",
            backgroundSize: "50px 50px",
            backgroundImage:
              "radial-gradient(circle, rgb(110, 110, 110) 1px, rgba(0, 0, 0, 0) 1px)",
            position: "relative"
          }}
          onMouseUp={mouseUp}
        >
          {images.map(i => (
            <PreviewImage
              image={i}
              key={"" + i.id + i.file?.name}
              toggleOverflow={() => {
                dispatch(["toggleOverflow"]);
              }}
            />
          ))}
        </div>
      </div>
      <ConfigBox />
    </div>
  );
};
