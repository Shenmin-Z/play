import React, { FC } from "react";
import { SVG_BLACK, FOOTER } from "../colors";

type Props = {
  width: number;
  highlight: boolean;
};

const R1 = 0.06;
const R2 = 0.15;

export let Discover: FC<Props> = ({ width: w, highlight }) => {
  let strokeWidth = w * 0.06;
  let d1 = `
  M ${w / 2} ${w / 2}
  m 0 -${w * 0.45}
  a ${w * 0.45} ${w * 0.45} 0 0 0 0 ${w * 0.9}
  a ${w * 0.45} ${w * 0.45} 0 0 0 0 -${w * 0.9}
  z
  `;
  let d2 = `
  M ${w / 2 - w * R1} ${w / 2 - w * R1} 
  L ${w / 2 + w * R2} ${w / 2 - w * R2} 
  L ${w / 2 + w * R1} ${w / 2 + w * R1} 
  L ${w / 2 - w * R2} ${w / 2 + w * R2}
  Z`;

  return (
    <svg width={w + 4} height={w + 4}>
      <g
        transform="translate(2, 2)"
        stroke={SVG_BLACK}
        strokeWidth={highlight ? 0 : strokeWidth}
      >
        <path
          d={d1 + " " + d2}
          fillRule="evenodd"
          fill={highlight ? FOOTER : "none"}
        />
      </g>
    </svg>
  );
};
