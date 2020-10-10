import React, { FC, CSSProperties, useState, useEffect, useRef } from "react";
import { useRepeatContext } from "../rContext";

export type ImageInfo = {
  id: number;
  file: File;
  w: number;
  h: number;
  x: number;
  y: number;
  r1?: {
    x: number;
    y: number;
  };
  r2?: {
    x: number;
    y: number;
  };
};

let counter = 0;
export let getEmptyImage: () => ImageInfo = () => {
  counter++;
  return {
    id: counter,
    file: null,
    w: null,
    h: null,
    x: counter - 1,
    y: counter - 1
  };
};
export let initEmptyImage = getEmptyImage();

export let Image: FC<ImageInfo> = props => {
  let { repeatDispatch } = useRepeatContext();

  let [blobUrl, setBlobUrl] = useState(
    props.file ? URL.createObjectURL(props.file) : null
  );

  useEffect(() => {
    if (blobUrl) return;
    if (props.file) {
      setBlobUrl(URL.createObjectURL(props.file));
    }
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [props.file, blobUrl]);

  let inputRef = useRef<HTMLInputElement>();

  return (
    <div style={{ display: "flex" }}>
      <div style={{ marginRight: 20 }}>
        {blobUrl ? (
          <img src={blobUrl} alt="selected image" />
        ) : (
          <input
            type="file"
            ref={inputRef}
            accept=".jpg, .jpeg, .png"
            onChange={() => {
              let files = inputRef.current.files;
              if (files.length === 1) {
                repeatDispatch(["setImage", { ...props, file: files[0] }]);
              }
            }}
          />
        )}
      </div>
      <div>
        <div style={formRow}>
          <Field
            label="Width"
            value={props.w}
            onChange={v => repeatDispatch(["setImage", { ...props, w: v }])}
          />
          <span style={{ width: 20 }} />
          <Field
            label="Height"
            value={props.h}
            onChange={v => repeatDispatch(["setImage", { ...props, h: v }])}
          />
        </div>
        <div style={formRow}>
          <Field
            label="X"
            value={props.x}
            onChange={v => repeatDispatch(["setImage", { ...props, x: v }])}
          />
          <span style={{ width: 20 }} />
          <Field
            label="Y"
            value={props.y}
            onChange={v => repeatDispatch(["setImage", { ...props, y: v }])}
          />
        </div>
        <div style={formRow}>
          <Field
            label="r1.x"
            value={props.r1?.x}
            onChange={v =>
              repeatDispatch(["setImage", { ...props, r1: { ...props, x: v } }])
            }
          />
          <span style={{ width: 20 }} />
          <Field
            label="r1.y"
            value={props.r1?.y}
            onChange={v =>
              repeatDispatch(["setImage", { ...props, r1: { ...props, y: v } }])
            }
          />
        </div>
        <div style={formRow}>
          <Field
            label="r2.x"
            value={props.r2?.x}
            onChange={v =>
              repeatDispatch(["setImage", { ...props, r2: { ...props, x: v } }])
            }
          />
          <span style={{ width: 20 }} />
          <Field
            label="r2.y"
            value={props.r2?.y}
            onChange={v =>
              repeatDispatch(["setImage", { ...props, r2: { ...props, y: v } }])
            }
          />
        </div>
      </div>
    </div>
  );
};

type FieldProps = {
  label: string;
  value: number;
  onChange: (v: number) => void;
};

let Field: FC<FieldProps> = ({ label, value, onChange }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: 170
      }}
    >
      <label style={formLabelStyle}>{label}: </label>
      <input
        style={formInputStyle(false)}
        type="text"
        value={value ?? ""}
        onChange={e => {
          let value = e.target.value;
          if (/^[0-9]+$/.test(value)) {
            onChange(parseInt(value));
          }
        }}
      />
    </div>
  );
};

let formRow: CSSProperties = {
  display: "flex"
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
