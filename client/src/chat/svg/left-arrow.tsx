import React, { FC } from "react";

type Props = {
  width: number;
  onClick: () => void;
};

export let LeftArrow: FC<Props> = ({ width, onClick }) => {
  return (
    <svg width={width + 4} height={2 * width + 4} onClick={onClick}>
      <g
        transform="translate(2, 2)"
        stroke="#171717"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1={width} y1={0} x2={0} y2={width} />
        <line x1={0} y1={width} x2={width} y2={width * 2} />
      </g>
    </svg>
  );
};
