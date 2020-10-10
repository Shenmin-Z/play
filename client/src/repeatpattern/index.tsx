import React, { FC } from "react";
import { Tabs, Image, getEmptyImage } from "./images";
import { RepeatProvider, useRepeatContext } from "./rContext";

export let RepeatPattern: FC = () => {
  return (
    <div style={{ marginTop: 40 }}>
      <RepeatProvider>
        <ImageTabs />
      </RepeatProvider>
    </div>
  );
};

let ImageTabs: FC = () => {
  let { repeatState, repeatDispatch } = useRepeatContext();
  let { images } = repeatState;
  let elements = images.map(i => {
    return {
      element: <Image {...i} key={i.id} />,
      id: i.id + "",
      title: "Empty - " + i.id
    };
  });

  return (
    <Tabs
      content={elements}
      addNew={() => {
        let newImage = getEmptyImage();
        repeatDispatch(["newImage", newImage]);
        return newImage.id + "";
      }}
      removeElement={id => {
        repeatDispatch(["removeImage", parseInt(id)]);
        if (
          repeatState.images.length === 1 &&
          repeatState.images[0].id + "" === id
        ) {
          let newImage = getEmptyImage();
          repeatDispatch(["newImage", newImage]);
        }
      }}
    />
  );
};
