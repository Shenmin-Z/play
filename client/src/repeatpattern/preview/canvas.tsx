import React, { FC, useReducer } from "react";
import { ConfigBox } from "./conf-box";
import { PreviewImage } from "./preview-image";
import { useRepeatContext } from "../repeat-context";
import { usePreviewContext } from "./preview-context";

type Props = {
  width?: number;
  height?: number;
};

export let Canvas: FC<Props> = ({ width = 1024, height = 1024 }) => {
  let { repeatState } = useRepeatContext();
  let { previewState } = usePreviewContext();
  let { images } = repeatState;

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
    switch (previewState.mode) {
      case "move":
        return "grab";
      default:
        return "default";
    }
  })();

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
          style={{
            width,
            height,
            backgroundColor: "#ffffff",
            backgroundSize: "50px 50px",
            backgroundImage:
              "radial-gradient(circle, rgb(110, 110, 110) 1px, rgba(0, 0, 0, 0) 1px)",
            position: "relative"
          }}
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
