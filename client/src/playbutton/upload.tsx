import React, { FC, useState, useRef, useEffect, CSSProperties } from "react";
import axios from "axios";
import { useForm } from "./form";
import { buildUrl } from "../util";

export let Upload: FC = () => {
  let [imgFile, setImgFile] = useState<File>(null);
  let [newImg, setNewImg] = useState<string>(null);
  let [blobUrl, setBlobUrl] = useState<string>(null);
  let inputRef = useRef<HTMLInputElement>();

  let { form, label, radius } = useForm();
  let [serviceUrl, setServiceUrl] = useState<string>(null);

  useEffect(() => {
    setServiceUrl(buildUrl("/api/image/playbutton", { label, radius }));
  }, [label, radius]);

  useEffect(() => {
    if (!imgFile) {
      setNewImg(null);
    }
  }, [imgFile]);

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
      setNewImg(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    let blobUrl: string;
    if (imgFile) {
      let blobUrl = URL.createObjectURL(imgFile);
      setBlobUrl(blobUrl);
    }
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [imgFile]);

  return (
    <div>
      {form}
      <div
        style={{
          cursor: "pointer",
          border: "2px dashed #0087F7",
          borderRadius: 5,
          background: "white",
          minHeight: 100,
          height: 1 // browser bug :(
        }}
      >
        {imgFile ? (
          <div style={centerStyle}>
            <img src={blobUrl} />
            <div
              style={{ position: "absolute", right: 8, top: 8 }}
              onClick={() => {
                setImgFile(null);
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
              setImgFile(files[0]);
            } else if (files.length === 0) {
              setImgFile(null);
            }
          }}
        />
      </div>
      <div style={{ textAlign: "center", marginTop: 20, marginBottom: 20 }}>
        <span
          style={{
            cursor: "pointer",
            backgroundColor: "#0078D7",
            borderRadius: ".5rem",
            fontSize: 18,
            color: "var(--baby-powder)",
            lineHeight: 1.25,
            padding: ".5rem .75rem"
          }}
          onClick={callService}
        >
          Submit
        </span>
      </div>
      {newImg && (
        <div
          style={{
            minHeight: 100,
            height: 1 // browser bug :(
          }}
        >
          <div style={centerStyle}>
            <img
              src={`data:image/jpeg;base64,${newImg}`}
              alt="generated image"
            />
          </div>
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
