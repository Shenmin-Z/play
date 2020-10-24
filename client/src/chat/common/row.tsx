import React, { FC, ReactElement } from "react";
import { RightArrow } from "../svg";
import { LINE_GRAY, BG_GRAY } from "../colors";

type Props = {
  image?: ReactElement;
  text: string;
  addtional?: ReactElement;
  rightArrow?: boolean;
  onClick?: () => void;
  isLast?: boolean;
};

export let Row: FC<Props> = ({
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
        <div style={{ fontSize: "17px" }}>{text}</div>
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
