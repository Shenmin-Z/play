import React, { FC } from "react";
import { Example } from "./example";
import { Upload } from "./upload";

export let PlayButton: FC = () => {
  return (
    <div>
      <Example />
      <Upload />
    </div>
  );
};
