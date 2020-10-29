import React, { FC } from "react";
import { useChatContext } from "../chat-context";

export let ProfileImage: FC = () => {
  let { chatState } = useChatContext();
  let { self } = chatState;

  return (
    <div style={{ margin: "5px 0" }}>
      <img
        height={60}
        src={
          self.hasProfile
            ? `/public/chat-profile/${self.id}`
            : "/public/chat-images/pet_cat_oddeye_black.png"
        }
      />
    </div>
  );
};

export let ProfileImageOther: FC<{ src: string }> = ({ src }) => {
  return (
    <div style={{ margin: "5px 0 5px 20px" }}>
      <img style={{ maxWidth: 40, height: 40 }} src={src} />
    </div>
  );
};
