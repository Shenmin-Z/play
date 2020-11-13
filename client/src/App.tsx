import React, { FC } from "react";
import { PlayButton } from "./playbutton";
import { RepeatPattern } from "./repeatpattern";
import { Chat } from "./chat";
import { Home } from "./home";
import { About } from "./about";
import { Header } from "./header";
import { RouteProvider, useRouteContext } from "./context";
import { Menu } from "./common";

export let App: FC = () => {
  return (
    <RouteProvider>
      <Content />
    </RouteProvider>
  );
};

App.displayName = "App Root";

let Content: FC = () => {
  let [r0, r1] = useRouteContext();

  return (
    <>
      {r0 === "tools" && r1 === "chat" && <Chat />}
      <div>
        <Header />
        <div style={{ position: "relative", zIndex: 0 }}>
          <div
            style={{
              margin: "40px auto 20px auto",
              padding: "0 20px",
              display: "flex",
              flexDirection: "column"
            }}
          >
            {r0 === "home" && <Home />}
            {r0 === "about" && <About />}
            {r0 === "tools" && (
              <>
                {r1 === "play-button" && <PlayButton />}
                {r1 === "repeat-pattern" && <RepeatPattern />}
                <Menu />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
