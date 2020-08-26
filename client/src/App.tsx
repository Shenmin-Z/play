import React, { FC } from "react";
import { PlayButton } from "./playbutton";

export let App: FC = () => {
  return (
    <div
      style={{
        maxWidth: 480,
        margin: "0 auto"
      }}
    >
      <PlayButton />
    </div>
  );
};
