import React, { FC } from "react";
import { BG_GRAY, TEXT_BLACK, TEXT_GRAY } from "./colors";
import { RightArrow } from "./svg";
import { ProfileImage, Row, RowSpace } from "./common";
import { useChatContext } from "./chat-context";

export let Me: FC = () => {
  let { chatDispatch, chatState } = useChatContext();
  let { en_zh, lang, self } = chatState;

  return (
    <div style={{ backgroundColor: BG_GRAY, height: "100%" }}>
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          backgroundColor: "#fff",
          padding: 20
        }}
        onClick={() => {
          chatDispatch(["setStatus", "my-profile"]);
        }}
      >
        <ProfileImage />
        <div
          style={{
            flexGrow: 1,
            margin: "12px 0 12px 15px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}
        >
          <div style={{ color: TEXT_BLACK, fontSize: "20px", fontWeight: 600 }}>
            {self.name || self.id}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ color: TEXT_GRAY, fontSize: "15px" }}>
              ID: {self.id}
            </div>
            <RightArrow width={6} />
          </div>
        </div>
      </div>
      <RowSpace />
      <Row
        text={en_zh("Settings", "设置")}
        rightArrow={true}
        onClick={() => {
          chatDispatch(["setLang", lang === "en" ? "zh" : "en"]);
        }}
        isLast={true}
      />
    </div>
  );
};
