import React, { FC, useEffect } from "react";
import { Tabs, Image, getEmptyImage } from "./images";
import { Preview } from "./preview";
import { RepeatProvider, useRepeatContext } from "./repeat-context";

export let RepeatPattern: FC = () => {
  useEffect(() => {
    let prev = document.body.style.background;
    document.body.style.background = "#F1FFEE";
    return () => {
      document.body.style.background = prev;
    };
  });

  return (
    <div style={{ marginTop: 20, zIndex: 0 }}>
      <RepeatProvider>
        <ImageTabs />
        <Preview />
      </RepeatProvider>
    </div>
  );
};

let ImageTabs: FC = () => {
  let { repeatState, repeatDispatch } = useRepeatContext();
  let { images } = repeatState;
  let elements = images.map(i => {
    let fileName = i.file?.name;

    return {
      element: <Image {...i} key={i.id} />,
      id: i.id + "",
      title: fileName || "Empty - " + i.id
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
      onActiveChange={id => {
        repeatDispatch(["setActive", parseInt(id)]);
      }}
    />
  );
};
