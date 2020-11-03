import React, { FC } from "react";
import { SVG_BLACK } from "../colors";

type Props = {
  width: number;
};

const SQRT2 = Math.sqrt(2);

const R1 = 0.8;
let p0 = (x: number, y: number, r: number) => `
M ${x} ${y}
L ${x + (R1 * r) / SQRT2} ${y - (R1 * r) / SQRT2}
A ${r} ${r} 0 0 1 ${x + (R1 * r) / SQRT2} ${y + (R1 * r) / SQRT2}
Z
`;

const R2 = 2.4;
const R3 = 2.65;
let p1 = (x: number, y: number, r: number) => `
M ${x + (R2 * r) / SQRT2} ${y - (R2 * r) / SQRT2}
L ${x + (R3 * r) / SQRT2} ${y - (R3 * r) / SQRT2}
A ${R3 * r} ${R3 * r} 0 0 1 ${x + (R3 * r) / SQRT2} ${y + (R3 * r) / SQRT2}
L ${x + (R2 * r) / SQRT2} ${y + (R2 * r) / SQRT2}
A ${R2 * r} ${R2 * r} 0 0 0 ${x + (R2 * r) / SQRT2} ${y - (R2 * r) / SQRT2}
`;

const R4 = 4.4;
const R5 = 4.65;
let p2 = (x: number, y: number, r: number) => `
M ${x + (R4 * r) / SQRT2} ${y - (R4 * r) / SQRT2}
L ${x + (R5 * r) / SQRT2} ${y - (R5 * r) / SQRT2}
A ${R5 * r} ${R5 * r} 0 0 1 ${x + (R5 * r) / SQRT2} ${y + (R5 * r) / SQRT2}
L ${x + (R4 * r) / SQRT2} ${y + (R4 * r) / SQRT2}
A ${R4 * r} ${R4 * r} 0 0 0 ${x + (R4 * r) / SQRT2} ${y - (R4 * r) / SQRT2}
`;

export let Wifi: FC<Props> = ({ width }) => {
  let strokeWidth = width * 0.06;
  let x = width * 0.28;
  let y = width / 2;
  let r = width * 0.09;

  return (
    <svg width={width + 4} height={width + 4}>
      <g
        transform="translate(2, 2)"
        stroke={SVG_BLACK}
        strokeWidth={strokeWidth}
      >
        <circle cx={width / 2} cy={width / 2} r={width / 2} fill="none" />
        <path d={p0(x, y, r)} />
        <path d={p1(x, y, r)} />
        <path d={p2(x, y, r)} />
      </g>
    </svg>
  );
};
