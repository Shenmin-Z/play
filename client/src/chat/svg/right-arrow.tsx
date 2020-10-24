import React, { FC } from "react";
import { TEXT_GRAY } from "../colors";

type Props = {
  width: number;
};

export let RightArrow: FC<Props> = ({ width }) => {
  return (
    <svg width={width + 4} height={2 * width + 4}>
      <g
        transform="translate(2, 2)"
        stroke={TEXT_GRAY}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1={0} y1={0} x2={width} y2={width} />
        <line x1={width} y1={width} x2={0} y2={width * 2} />
      </g>
    </svg>
  );
};
