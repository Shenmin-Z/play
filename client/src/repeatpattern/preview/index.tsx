import React, { FC } from "react";
import { Toolbar } from "./toolbar";
import { Canvas } from "./canvas";
import { ConfigBox } from "./conf-box";
import { PreviewProvider } from "./preview-context";
import { useRepeatContext } from "../repeat-context";

export let Preview: FC = () => {
  let { repeatState } = useRepeatContext();
  let cw = repeatState.canvasSize.w;

  return (
    <PreviewProvider>
      <div
        style={{
          marginTop: 10,
          maxWidth: cw,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between"
        }}
      >
        <Toolbar />
        <ConfigBox />
      </div>
      <Canvas />
    </PreviewProvider>
  );
};
