import React, { FC } from "react";
import { SVG_BLACK, FOOTER } from "../colors";

type Props = {
  width: number;
  highlight: boolean;
};

export let Me: FC<Props> = ({ width: w, highlight }) => {
  let strokeWidth = w * 0.06;
  let d = `
  M ${w * 0.08} ${w * 0.9}
  l 0 -${w * 0.08}
  L ${w / 2 - w * 0.06} ${w * 0.7}
  l 0 -${w * 0.08}
  a ${w * 0.2} ${w * 0.2} 0 0 1 -${w * 0.1} -${w * 0.15}
  l 0 -${w * 0.2}
  a ${w * 0.2} ${w * 0.3} 0 0 1 ${w * 0.35} 0
  l 0 ${w * 0.2}
  a ${w * 0.2} ${w * 0.2} 0 0 1 -${w * 0.1} ${w * 0.15}
  l 0 ${w * 0.08}
  L ${w - w * 0.08} ${w * 0.9 - w * 0.08}
  l 0 ${w * 0.08}
  Z
  `;

  return (
    <svg width={w + 4} height={w + 4}>
      <g
        transform="translate(2, 2)"
        stroke={SVG_BLACK}
        strokeWidth={highlight ? 0 : strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={d} fill={highlight ? FOOTER : "none"} />
      </g>
    </svg>
  );
};
