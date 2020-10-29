import React, { FC } from "react";
import { ChatRow } from "./common";

export let Chats: FC = () => {
  return (
    <div>
      <ChatRow
        img="/public/chat-images/bird_ooruri.png"
        title="Ooruri"
        latest="Okay."
        time="8:57 AM"
      />
      <ChatRow
        img="/public/chat-images/plant_kokemomo.png"
        title="Kokemomo"
        latest="See ya"
        time="Yesterday"
      />
    </div>
  );
};
