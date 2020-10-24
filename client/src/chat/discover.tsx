import React, { FC } from "react";
import { useChatContext } from "./chat-context";
import { Row } from "./common";
import { BG_GRAY } from "./colors";

export let Discover: FC = () => {
  let { chatState } = useChatContext();
  let { en_zh } = chatState;

  return (
    <div style={{ backgroundColor: BG_GRAY, height: "100%" }}>
      <Row text={en_zh("Moments", "朋友圈")} rightArrow={true} isLast={true} />
    </div>
  );
};
