import React, { FC, CSSProperties } from "react";

export let ConfigBox: FC = () => {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        backgroundColor: "rgb(243, 243, 243)",
        padding: 10
      }}
    >
      <div>
        <label style={formLabelStyle}>Width: </label>
        <input style={formInputStyle(false)} type="text" />
      </div>
      <div>
        <label style={formLabelStyle}>Height: </label>
        <input style={formInputStyle(false)} type="text" />
      </div>
    </div>
  );
};

let formLabelStyle: CSSProperties = {
  display: "block",
  color: "var(--form-label)",
  marginBottom: "0.5rem",
  fontSize: ".875rem",
  fontWeight: 700
};

let formInputStyle: (e: boolean) => CSSProperties = e => ({
  width: 100,
  boxSizing: "border-box",
  border: `${e ? "2" : "1"}px solid ${e ? "#FF5630" : "rgb(226, 232, 240)"}`,
  borderRadius: ".5rem",
  marginBottom: "0.5rem",
  color: "rgb(74,85,104)",
  padding: ".5rem .75rem",
  lineHeight: 1.25,
  outline: "none"
});
