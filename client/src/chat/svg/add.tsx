import React, { FC } from "react";
import { SVG_BLACK } from "../colors";

type Props = {
  width: number;
};

const R = 0.27;

export let Add: FC<Props> = ({ width }) => {
  let strokeWidth = width * 0.06;

  return (
    <svg width={width + 4} height={width + 4}>
      <g
        transform="translate(2, 2)"
        stroke={SVG_BLACK}
        strokeWidth={strokeWidth}
      >
        <circle cx={width / 2} cy={width / 2} r={width / 2} fill="none" />
        <line
          x1={width / 2 - width * R}
          y1={width / 2}
          x2={width / 2 + width * R}
          y2={width / 2}
        />
        <line
          x1={width / 2}
          y1={width / 2 - width * R}
          x2={width / 2}
          y2={width / 2 + width * R}
        />
      </g>
    </svg>
  );
};
