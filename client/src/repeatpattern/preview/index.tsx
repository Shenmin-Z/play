import React, { FC } from "react";
import { Toolbar } from "./toolbar";
import { Canvas } from "./canvas";
import { PreviewProvider } from "./preview-context";

export let Preview: FC = () => {
  return (
    <PreviewProvider>
      <div style={{ marginTop: 20, display: "flex", alignItems: "flex-start" }}>
        <Toolbar />
        <Canvas />
      </div>
    </PreviewProvider>
  );
};
