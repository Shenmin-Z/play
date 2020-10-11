import React, { FC } from "react";
import { Toolbar } from "./toolbar";
import { Canvas } from "./canvas";

export let Preview: FC = () => {
  return (
    <div style={{ marginTop: 20, display: "flex", alignItems: "flex-start" }}>
      <Toolbar />
      <Canvas />
    </div>
  );
};
