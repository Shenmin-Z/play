import React, { FC, CSSProperties, ChangeEvent, useReducer } from "react";
import axios from "axios";
import { useRepeatContext } from "../repeat-context";
import { ImageInfo } from "../images";

const BG = "rgb(241, 243, 244)";

type State = {
  applyBtnHovered: boolean;
  downloadBtnHovered: boolean;
  buf: {
    w: number;
    h: number;
  };
};

type Action =
  | ["setApplyBtnHovered", boolean]
  | ["setDownloadBtnHovered", boolean]
  | ["setBuf", Partial<State["buf"]>];

type Reducer = {
  (p: State, a: Action): State;
};

export let ConfigBox: FC = () => {
  let { repeatState, repeatDispatch } = useRepeatContext();

  let { canvasSize, images } = repeatState;
  let { w, h } = canvasSize;

  let [state, dispatch] = useReducer<Reducer>(
    (state, action) => {
      let [type, payload] = action;
      switch (type) {
        case "setApplyBtnHovered":
          return { ...state, applyBtnHovered: payload as boolean };
        case "setDownloadBtnHovered":
          return { ...state, downloadBtnHovered: payload as boolean };
        case "setBuf":
          return {
            ...state,
            buf: { ...state.buf, ...(payload as State["buf"]) }
          };
        default:
          return state;
      }
    },
    {
      applyBtnHovered: false,
      downloadBtnHovered: false,
      buf: {
        w,
        h
      }
    }
  );
  let { applyBtnHovered, downloadBtnHovered, buf } = state;

  let onChange = (x: "w" | "h") => (e: ChangeEvent<HTMLInputElement>) => {
    let { value } = e.target;
    if (/^\d*$/.test(value)) {
      let intValue = parseInt(value);
      let v: number | string = isNaN(intValue) ? "" : intValue;
      dispatch(["setBuf", { [x]: v }]);
    }
  };

  return (
    <div
      style={{
        backgroundColor: BG,
        border: `10px solid ${BG}`,
        borderRadius: 10,
        display: "flex",
        alignItems: "center"
      }}
    >
      <div style={fieldStyle}>
        <label style={formLabelStyle}>Width:</label>
        <input
          style={formInputStyle(false)}
          value={buf.w}
          onChange={onChange("w")}
          type="text"
        />
      </div>
      <div style={fieldStyle}>
        <label style={formLabelStyle}>Height:</label>
        <input
          style={formInputStyle(false)}
          value={buf.h}
          onChange={onChange("h")}
          type="text"
        />
      </div>
      <div
        onMouseOver={() => {
          dispatch(["setApplyBtnHovered", true]);
        }}
        onMouseLeave={() => {
          dispatch(["setApplyBtnHovered", false]);
        }}
        onClick={() => {
          repeatDispatch(["setCanvas", buf]);
        }}
        style={{
          border: "1px solid transparent",
          borderRadius: 4,
          color: "#ffffff",
          backgroundColor: applyBtnHovered
            ? "rgb(0, 119, 204)"
            : "rgb(38, 132, 255)",
          textAlign: "center",
          height: 30,
          lineHeight: "30px",
          padding: "0 10px",
          cursor: "pointer"
        }}
      >
        Apply
      </div>
      <div style={{ width: 10 }} />
      <div
        onMouseOver={() => {
          dispatch(["setDownloadBtnHovered", true]);
        }}
        onMouseLeave={() => {
          dispatch(["setDownloadBtnHovered", false]);
        }}
        style={{
          border: "1px solid transparent",
          borderRadius: 4,
          color: "rgb(62, 115, 157)",
          backgroundColor: downloadBtnHovered
            ? "rgb(160, 199, 228)"
            : "rgb(225, 236, 244)",
          textAlign: "center",
          height: 30,
          lineHeight: "30px",
          padding: "0 10px",
          cursor: "pointer",
          marginRight: 20
        }}
        onClick={() => {
          let formData = new FormData();
          images.forEach((i, idx) => {
            formData.append(`file-${idx}`, i.file);
            formData.append(`detail-${idx}`, detailString(i));
          });
          formData.append("image-count", images.length + "");
          formData.append("canvas", JSON.stringify({ w, h }));
          axios({
            method: "post",
            url: "/api/image/repeatpattern",
            data: formData,
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }).then(({ data }) => {
            let a = document.createElement("a");
            a.href = "data:image/jpeg;base64," + data;
            a.download = "repeat.jpeg";
            a.click();
          });
        }}
      >
        Download
      </div>
    </div>
  );
};

let fieldStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  marginRight: "1em"
};

let formLabelStyle: CSSProperties = {
  display: "block",
  color: "var(--form-label)",
  marginRight: ".5em",
  fontSize: ".875rem",
  fontWeight: 700
};

let formInputStyle: (e: boolean) => CSSProperties = e => ({
  width: 80,
  boxSizing: "border-box",
  border: `${e ? "2" : "1"}px solid ${e ? "#FF5630" : "rgb(226, 232, 240)"}`,
  borderRadius: ".5rem",
  color: "rgb(74,85,104)",
  padding: ".5rem .75rem",
  lineHeight: 1.25,
  outline: "none"
});

let detailString = (i: ImageInfo) => {
  let result = {
    W: Math.round(i.w),
    H: Math.round(i.h),
    X: Math.round(i.x),
    Y: Math.round(i.y),
    R1: {
      X: Math.round(i.r1?.x ?? 100000),
      Y: Math.round(i.r1?.y ?? 100000)
    },
    R2: {
      X: Math.round(i.r2?.x ?? 100000),
      Y: Math.round(i.r2?.y ?? 100000)
    }
  };
  return JSON.stringify(result);
};
