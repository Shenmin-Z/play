import React, { FC } from "react";
import { PlayButton } from "./playbutton";
import { Header } from "./header";

export let App: FC = () => {
  return (
    <div>
      <Header />
      <div
        style={{
          margin: "40px auto 0px auto",
          padding: "0 20px",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <PlayButton />
      </div>
    </div>
  );
};

App.displayName = "App Root";
