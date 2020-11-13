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
        width: "100%"
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
    <div style={{ width: "100%", height: 10, backgroundColor: BG_GRAY }}></div>
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
  notifications: number;
  onClick?: () => void;
};

export let ChatRow: FC<ChatRowProps> = ({
  img,
  title,
  latest,
  time,
  notifications,
  onClick
}) => {
  return (
    <div
      onClick={onClick || (() => {})}
      style={{
        backgroundColor: "#fff",
        display: "flex",
        height: 60,
        alignItems: "stretch",
        width: "100%",
        boxSizing: "border-box",
        paddingLeft: 20,
        position: "relative"
      }}
    >
      <img
        src={img}
        style={{
          maxWidth: 40,
          height: 40,
          margin: "10px 0",
          borderRadius: "5px"
        }}
      />
      <div
        style={{
          display: notifications > 0 ? "block" : "none",
          position: "absolute",
          top: 3,
          left: 48,
          width: 15,
          height: 15,
          lineHeight: "15px",
          borderRadius: "50%",
          textAlign: "center",
          color: "#fff",
          background: "#EE0000",
          fontSize: "10px"
        }}
      >
        {notifications}
      </div>
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
          <div
            style={{
              color: TEXT_GRAY,
              fontSize: "12px",
              lineHeight: "20px",
              height: 20,
              maxWidth: "calc(100vw - 160px)",
              overflow: "hidden"
            }}
          >
            {latest}
          </div>
        </div>
        <div style={{ color: TEXT_GRAY, fontSize: "12px", minWidth: 45 }}>
          {time}
        </div>
      </div>
    </div>
  );
};
