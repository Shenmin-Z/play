import React, { FC } from "react";
import { Toolbar } from "./toolbar";
import { Canvas } from "./canvas";
import { ConfigBox } from "./conf-box";
import { PreviewProvider } from "./preview-context";

export let Preview: FC = () => {
  return (
    <PreviewProvider>
      <div
        style={{
          marginTop: 20,
          display: "flex",
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
