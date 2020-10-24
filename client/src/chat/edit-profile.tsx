import React, { FC } from "react";
import { useChatContext } from "./chat-context";
import { Row, RowGroup, ProfileImage } from "./common";
import { BG_GRAY, TEXT_GRAY } from "./colors";

export let EditProfile: FC = () => {
  let { chatState } = useChatContext();
  let { en_zh } = chatState;

  return (
    <div style={{ backgroundColor: BG_GRAY, height: "100%" }}>
      <RowGroup>
        <Row
          text={en_zh("Profile Photo", "头像")}
          addtional={<ProfileImage />}
          rightArrow={true}
        />
        <Row
          text={en_zh("Name", "昵称")}
          addtional={<div style={{ color: TEXT_GRAY }}>Name Here</div>}
          rightArrow={true}
        />
        <Row
          text={en_zh("ID", "ID")}
          addtional={<div style={{ color: TEXT_GRAY }}>xx-xxx-xxx</div>}
          rightArrow={true}
        />
      </RowGroup>
    </div>
  );
};
