import React, { FC, ReactElement } from "react";

type Props = {
  children: ReactElement[];
};

export let RowGroup: FC<Props> = ({ children }) => {
  return (
    <>
      {children.map((i, idx) => (
        <i.type key={idx} {...i.props} isLast={idx === children.length - 1} />
      ))}
    </>
  );
};
