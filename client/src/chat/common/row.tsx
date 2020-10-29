import React, { FC, ReactElement } from "react";
import { RightArrow } from "../svg";
import { LINE_GRAY, BG_GRAY, TEXT_BLACK, TEXT_GRAY } from "../colors";

type RowProps = {
  image?: ReactElement;
  text: string;
  addtional?: ReactElement;
  rightArrow?: boolean;
  onClick?: () => void;
  isLast?: boolean;
};

export let Row: FC<RowProps> = ({
  image,
  text,
  addtional,
  rightArrow,
  onClick,
  isLast
}) => {
  return (
    <div
      style={{
        backgroundColor: "#fff",
        display: "flex",
        minHeight: 50,
        alignItems: "stretch",
        width: "100vw"
      }}
      onClick={onClick || (() => {})}
    >
      {image || null}
      <div
        style={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginLeft: "20px",
          paddingRight: "20px",
          borderBottom: isLast ? "" : `1px solid ${LINE_GRAY}`
        }}
      >
        <div style={{ fontSize: "17px", color: TEXT_BLACK }}>{text}</div>
        <div style={{ display: "flex", alignItems: "center" }}>
          {addtional || null}
          <div style={{ width: 10 }} />
          {rightArrow === true && <RightArrow width={6} />}
        </div>
      </div>
    </div>
  );
};

export let RowSpace: FC = () => {
  return (
    <div style={{ width: "100vw", height: 10, backgroundColor: BG_GRAY }}></div>
  );
};

type RowGroupProps = {
  children: ReactElement[];
};

export let RowGroup: FC<RowGroupProps> = ({ children }) => {
  return (
    <>
      {children.map((i, idx) => (
        <i.type key={idx} {...i.props} isLast={idx === children.length - 1} />
      ))}
    </>
  );
};

type ChatRowProps = {
  img: string;
  title: string;
  latest: string;
  time: string;
};

export let ChatRow: FC<ChatRowProps> = ({ img, title, latest, time }) => {
  return (
    <div
      style={{
        backgroundColor: "#fff",
        display: "flex",
        height: 60,
        alignItems: "stretch",
        width: "100vw",
        paddingLeft: 20
      }}
    >
      <img src={img} style={{ maxWidth: 40, height: 40, margin: "10px 0" }} />
      <div
        style={{
          flexGrow: 1,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginLeft: "20px",
          padding: "15px 20px 0 0",
          borderBottom: `1px solid ${LINE_GRAY}`
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ color: TEXT_BLACK, fontSize: "17px" }}>{title}</div>
          <div style={{ color: TEXT_GRAY, fontSize: "12px" }}>{latest}</div>
        </div>
        <div style={{ paddingRight: 20, color: TEXT_GRAY, fontSize: "12px" }}>
          {time}
        </div>
      </div>
    </div>
  );
};
