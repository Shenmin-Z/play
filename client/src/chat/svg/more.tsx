import React, { FC } from "react";
import { SVG_BLACK } from "../colors";

type Props = {
  width: number;
  onClick: () => void;
};

export let More: FC<Props> = ({ width, onClick }) => {
  let radius = width / 25;
  let cy = width * 0.6;

  return (
    <svg width={width + 4} height={width + 4} onClick={onClick}>
      <g transform="translate(2, 2)" stroke={SVG_BLACK} strokeWidth={2}>
        <circle cx={radius} cy={cy} r={radius} />
        <circle cx={width / 2} cy={cy} r={radius} />
        <circle cx={width - radius} cy={cy} r={radius} />
      </g>
    </svg>
  );
};
