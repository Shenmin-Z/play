import React, { FC } from "react";
import { useChatContext } from "../chat-context";
import { User } from "../types";

export let ProfileImage: FC = () => {
  let { chatState } = useChatContext();
  let { self } = chatState;

  return (
    <div style={{ margin: "5px 0" }}>
      <img height={60} src={imageSrc(self)} />
    </div>
  );
};

export let imageSrc = (user: User) =>
  user.profile
    ? `/public/chat-profile/${user.id}`
    : "/public/chat-images/pet_cat_oddeye_black.png";

export let ProfileImageOther: FC<{ src: string }> = ({ src }) => {
  return (
    <div style={{ margin: "5px 0 5px 20px" }}>
      <img style={{ maxWidth: 40, height: 40 }} src={src} />
    </div>
  );
};
