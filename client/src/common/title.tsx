import React, { FC } from "react";

type Props = {
  name: string;
};

export let Title: FC<Props> = ({ name }) => {
  return (
    <h1
      style={{
        marginTop: 20,
        fontSize: 40,
        lineHeight: "45px",
        color: "rgb(40, 44, 52)",
        fontWeight: 700
      }}
    >
      {name}
    </h1>
  );
};
