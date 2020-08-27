import React, { FC } from "react";
import { PlayButton } from "./playbutton";

export let App: FC = () => {
  return (
    <div
      style={{
        maxWidth: 480,
        margin: "0 auto",
        padding: 5
      }}
    >
      <PlayButton />
    </div>
  );
};
