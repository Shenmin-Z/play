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
      <div style={{ padding: "0 2px" }}>
        <svg viewBox="0 0 4 3" style={{ width: 30 }}>
          <path
            d="M 0 1 L 2 1 L 2 0 L 4 1.5 L 2 3 L 2 2 L 0 2 Z"
            fill="#171717"
            strokeWidth={0}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
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
