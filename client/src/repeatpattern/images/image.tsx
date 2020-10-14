import React, {
  FC,
  CSSProperties,
  useEffect,
  useRef,
  useReducer,
  useState
} from "react";
import { useRepeatContext } from "../repeat-context";

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

type State = {
  blobUrl: string;
  applyBtnHovered: boolean;
  resetBtnHovered: boolean;
  buf: ImageInfo;
  originalSize: {
    width: number;
    height: number;
  };
};

type Action =
  | ["setBlobUrl", string]
  | ["setApplyBtnHovered", boolean]
  | ["setResetBtnHovered", boolean]
  | ["setBuf", ImageInfo]
  | ["setOriginalSize", State["originalSize"]];

type Reducer = {
  (p: State, a: Action): State;
};

export let Image: FC<ImageInfo> = props => {
  let { repeatDispatch } = useRepeatContext();

  let [state, dispatch] = useReducer<Reducer>(
    (state, action) => {
      let [type, payload] = action;
      switch (type) {
        case "setBlobUrl":
          return { ...state, blobUrl: payload as string };
        case "setApplyBtnHovered":
          return { ...state, applyBtnHovered: payload as boolean };
        case "setResetBtnHovered":
          return { ...state, resetBtnHovered: payload as boolean };
        case "setBuf":
          return { ...state, buf: payload as ImageInfo };
        case "setOriginalSize":
          return { ...state, originalSize: payload as State["originalSize"] };
        default:
          return state;
      }
    },
    {
      blobUrl: props.file ? URL.createObjectURL(props.file) : null,
      applyBtnHovered: false,
      resetBtnHovered: false,
      buf: { ...props },
      originalSize: {
        height: null,
        width: null
      }
    }
  );

  let { blobUrl, applyBtnHovered, resetBtnHovered, buf, originalSize } = state;

  let syncImage = (newImg?: ImageInfo) => {
    repeatDispatch(["setImage", newImg || buf]);
  };

  useEffect(() => {
    if (blobUrl) return;
    if (props.file) {
      dispatch(["setBlobUrl", URL.createObjectURL(props.file)]);
    }
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [props.file, blobUrl]);

  useEffect(() => {
    dispatch(["setBuf", props]);
  }, [props]);

  let inputRef = useRef<HTMLInputElement>();

  return (
    <div style={{ display: "flex" }}>
      <div
        style={{ marginRight: 20, display: "flex", flexDirection: "column" }}
      >
        {blobUrl ? (
          <img
            src={blobUrl}
            alt="selected image"
            onLoad={e => {
              let img = e.target as HTMLImageElement;
              let { width, height } = img;
              img.style.maxWidth = "120px";
              img.style.maxWidth = "120px";
              dispatch(["setBuf", { ...buf, w: width, h: height }]);
              dispatch(["setOriginalSize", { width, height }]);
              repeatDispatch(["setImage", { ...buf, w: width, h: height }]);
            }}
          />
        ) : (
          <label
            style={{
              cursor: "pointer",
              border: "2px dashed #0087F7",
              borderRadius: 5,
              background: "white",
              height: 100,
              width: 100,
              lineHeight: "100px",
              textAlign: "center"
            }}
          >
            <input
              style={{ display: "none" }}
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
            Upload
          </label>
        )}
      </div>
      <div>
        <div style={formRow}>
          <Field
            label="Width"
            value={buf.w}
            onChange={v => dispatch(["setBuf", { ...buf, w: v }])}
          />
          <span style={{ width: 20 }} />
          <Field
            label="Height"
            value={buf.h}
            onChange={v => dispatch(["setBuf", { ...buf, h: v }])}
          />
        </div>
        <div style={formRow}>
          <Field
            label="X"
            value={buf.x}
            onChange={v => dispatch(["setBuf", { ...buf, x: v }])}
          />
          <span style={{ width: 20 }} />
          <Field
            label="Y"
            value={buf.y}
            onChange={v => dispatch(["setBuf", { ...buf, y: v }])}
          />
        </div>
        <div style={formRow}>
          <Field
            label="r1.x"
            value={buf.r1?.x}
            onChange={v =>
              dispatch(["setBuf", { ...buf, r1: { ...buf.r1, x: v } }])
            }
          />
          <span style={{ width: 20 }} />
          <Field
            label="r1.y"
            value={buf.r1?.y}
            onChange={v =>
              dispatch(["setBuf", { ...buf, r1: { ...buf.r1, y: v } }])
            }
          />
        </div>
        <div style={formRow}>
          <Field
            label="r2.x"
            value={buf.r2?.x}
            onChange={v =>
              dispatch(["setBuf", { ...buf, r2: { ...buf.r2, x: v } }])
            }
          />
          <span style={{ width: 20 }} />
          <Field
            label="r2.y"
            value={buf.r2?.y}
            onChange={v =>
              dispatch(["setBuf", { ...buf, r2: { ...buf.r2, y: v } }])
            }
          />
        </div>
        <div
          style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}
        >
          <div
            onMouseOver={() => {
              dispatch(["setResetBtnHovered", true]);
            }}
            onMouseLeave={() => {
              dispatch(["setResetBtnHovered", false]);
            }}
            onClick={() => {
              let newImg = {
                ...buf,
                w: originalSize.width,
                h: originalSize.height,
                x: 0,
                y: 0,
                r1: {
                  x: null,
                  y: null
                },
                r2: {
                  x: null,
                  y: null
                }
              };
              dispatch(["setBuf", newImg]);
              syncImage(newImg);
            }}
            style={{
              border: "1px solid transparent",
              borderRadius: 4,
              color: "rgb(62, 115, 157)",
              backgroundColor: resetBtnHovered
                ? "rgb(160, 199, 228)"
                : "rgb(225, 236, 244)",
              textAlign: "center",
              height: 30,
              width: 64,
              lineHeight: "30px",
              cursor: "pointer",
              marginRight: 20
            }}
          >
            Reset
          </div>
          <div
            onMouseOver={() => {
              dispatch(["setApplyBtnHovered", true]);
            }}
            onMouseLeave={() => {
              dispatch(["setApplyBtnHovered", false]);
            }}
            onClick={() => {
              syncImage();
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
              width: 64,
              lineHeight: "30px",
              cursor: "pointer"
            }}
          >
            Apply
          </div>
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
  let [minus, setMinus] = useState(null);

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
        value={minus || (value ?? "")}
        onChange={e => {
          let value = e.target.value;
          if (/^-?[0-9]*$/.test(value)) {
            let parsed = parseInt(value);
            let intValue = isNaN(parsed) ? null : parsed;
            if (value === "-") {
              setMinus("-");
            } else {
              setMinus(null);
            }
            onChange(intValue);
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
