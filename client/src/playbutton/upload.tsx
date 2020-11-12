import React, { FC, useRef, CSSProperties, useReducer } from "react";
import axios, { AxiosError } from "axios";
import { useForm } from "./form";

type UploadState = {
  imgFile: File;
  newImg: string;
  blobUrl: string;
};

type UploadAction = ["setImgFile", File] | ["setNewImg", string];

type UploadReducer = {
  (p: UploadState, c: UploadAction): UploadState;
};

export let Upload: FC = () => {
  let [uploadState, uploadDispatch] = useReducer<UploadReducer>(
    (state, action) => {
      let [type, payload] = action;
      let newState = state;
      switch (type) {
        case "setImgFile":
          newState = { ...state, imgFile: payload as File };
          if (!payload) {
            newState.newImg = null;
            newState.blobUrl = null;
          } else {
            if (newState.blobUrl) {
              URL.revokeObjectURL(newState.blobUrl);
            }
            newState.blobUrl = URL.createObjectURL(payload);
          }
          break;
        case "setNewImg":
          newState = { ...state, newImg: payload as string };
          break;
      }
      return newState;
    },
    {
      imgFile: null,
      newImg: null,
      blobUrl: null
    }
  );
  let { imgFile, newImg, blobUrl } = uploadState;

  let inputRef = useRef<HTMLInputElement>();

  let { formElm, serviceUrl, error } = useForm();

  let callService = async () => {
    if (!imgFile) {
      return;
    }
    try {
      let res = await axios({
        method: "post",
        url: serviceUrl,
        data: imgFile
      });
      let { data } = res;
      uploadDispatch(["setNewImg", data]);
    } catch (e) {
      let error: AxiosError = e;
      console.error(error?.response?.data);
    }
  };

  return (
    <div>
      {formElm}
      <div style={uploadAreaStyle(!!imgFile)}>
        {imgFile ? (
          <div style={centerStyle}>
            <img
              src={blobUrl}
              style={{
                maxHeight: "100%",
                maxWidth: "100%"
              }}
            />
            <div
              style={{ position: "absolute", right: 8, top: 8 }}
              onClick={() => {
                uploadDispatch(["setImgFile", null]);
              }}
            >
              ❌
            </div>
          </div>
        ) : (
          <div
            style={centerStyle}
            onClick={() => {
              if (inputRef.current) {
                inputRef.current.click();
              }
            }}
            onDrop={e => {
              e.preventDefault();

              if (e.dataTransfer.items) {
                if (e.dataTransfer.items[0].kind === "file") {
                  let file = e.dataTransfer.items[0].getAsFile();
                  uploadDispatch(["setImgFile", file]);
                }
              } else {
                uploadDispatch(["setImgFile", e.dataTransfer.files[0]]);
              }
            }}
            onDragOver={e => {
              e.preventDefault();
            }}
          >
            Click Or Drag&Drop To Upload
          </div>
        )}
        <input
          key={imgFile + ""}
          style={{
            display: "none"
          }}
          ref={inputRef}
          type="file"
          accept=".jpg, .jpeg, .png"
          onChange={() => {
            let files = inputRef.current.files;
            if (files.length === 1) {
              uploadDispatch(["setImgFile", files[0]]);
            } else if (files.length === 0) {
              uploadDispatch(["setImgFile", null]);
            }
          }}
        />
      </div>
      {blobUrl && !error && (
        <div style={{ textAlign: "center", marginTop: 20, marginBottom: 20 }}>
          <span style={submitStyle} onClick={callService}>
            Submit
          </span>
        </div>
      )}
      {newImg && (
        <div style={centerStyle}>
          <img
            src={`data:image/jpeg;base64,${newImg}`}
            style={{
              maxHeight: "100%",
              maxWidth: "100%"
            }}
            alt="generated image"
          />
        </div>
      )}
    </div>
  );
};

let centerStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative"
};

let submitStyle: CSSProperties = {
  cursor: "pointer",
  backgroundColor: "#0078D7",
  borderRadius: ".5rem",
  fontSize: 18,
  color: "#fff",
  lineHeight: 1.25,
  padding: ".5rem .75rem"
};

let uploadAreaStyle: (f: boolean) => CSSProperties = file => ({
  cursor: "pointer",
  border: "2px dashed #0087F7",
  borderRadius: 5,
  background: "white",
  minHeight: 100,
  ...(file ? {} : { height: 1 }) // browser bug :(
});
