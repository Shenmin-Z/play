import React, { FC } from "react";
import { Row, RowGroup, ProfileImageOther } from "./common";
import { BG_GRAY } from "./colors";

export let Contacts: FC = () => {
  return (
    <div style={{ backgroundColor: BG_GRAY, height: "100%" }}>
      <RowGroup>
        <Row
          text="Ooruri"
          image={
            <ProfileImageOther src="/public/chat-images/bird_ooruri.png" />
          }
        />
        <Row
          text="Kokemomo"
          image={
            <ProfileImageOther src="/public/chat-images/plant_kokemomo.png" />
          }
        />
      </RowGroup>
    </div>
  );
};
