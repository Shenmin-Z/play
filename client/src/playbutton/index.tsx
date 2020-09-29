import React, { FC } from "react";
import { Example } from "./example";
import { Upload } from "./upload";
import { Title } from "../common";

export let PlayButton: FC = () => {
  return (
    <div>
      <Title name="Add A Play Button" />
      <Example />
      <Upload />
    </div>
  );
};
