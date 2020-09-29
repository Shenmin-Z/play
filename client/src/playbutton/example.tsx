import React, { FC, CSSProperties } from "react";

let imgStyle: CSSProperties = {
  width: "100%"
};

export let Example: FC = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        margin: "10px 0"
      }}
    >
      <div>
        <img
          style={imgStyle}
          src="/public/img/playbutton/input.jpg"
          alt="input image"
        />
      </div>
      <div
        style={{
          padding: "0 2px",
          fontFamily: `Arial, "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", "Segoe UI Symbol"`,
          fontSize: 24
        }}
      >
        🡆
      </div>
      <div>
        <img
          style={imgStyle}
          src="/public/img/playbutton/output.jpg"
          alt="output image"
        />
      </div>
    </div>
  );
};
