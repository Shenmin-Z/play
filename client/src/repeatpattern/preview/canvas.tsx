import React, { FC } from "react";
import { ConfigBox } from "./confbox";

type Props = {
  width?: number;
  height?: number;
};

export let Canvas: FC<Props> = ({ width = 1024, height = 1024 }) => {
  return (
    <div
      style={{
        flexGrow: 1,
        marginLeft: 10,
        overflow: "auto",
        position: "relative"
      }}
    >
      <div
        style={{
          width,
          height,
          backgroundColor: "#ffffff",
          backgroundSize: "50px 50px",
          backgroundImage:
            "radial-gradient(circle, rgb(110, 110, 110) 1px, rgba(0, 0, 0, 0) 1px)"
        }}
      ></div>
      <ConfigBox />
    </div>
  );
};
