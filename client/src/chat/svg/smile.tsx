import React, { FC } from "react";
import { SVG_BLACK } from "../colors";

type Props = {
  width: number;
};

export let Smile: FC<Props> = ({ width }) => {
  let strokeWidth = width * 0.06;

  let d = `M ${width / 2 - width * 0.28} ${width / 2 + width * 0.06}
  A ${width * 0.28} ${width * 0.24} 0 0 0 ${width / 2 + width * 0.28} ${
    width / 2 + width * 0.06
  }
  Z`;

  return (
    <svg width={width + 4} height={width + 4}>
      <g
        transform="translate(2, 2)"
        stroke={SVG_BLACK}
        strokeWidth={strokeWidth}
      >
        <circle cx={width / 2} cy={width / 2} r={width / 2} fill="none" />
        <circle
          cx={width / 2 - width * 0.2}
          cy={width / 2 - width * 0.15}
          r={width / 20}
        />
        <circle
          cx={width / 2 + width * 0.2}
          cy={width / 2 - width * 0.15}
          r={width / 20}
        />
        <path d={d} fill="none" />
      </g>
    </svg>
  );
};
