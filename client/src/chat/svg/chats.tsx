//https://stackoverflow.com/questions/39193276/how-can-i-merge-two-shapes-in-svg

import React, { FC } from "react";
import { SVG_BLACK, FOOTER } from "../colors";

type Props = {
  width: number;
  highlight: boolean;
};

export let Chats: FC<Props> = ({ width: w, highlight }) => {
  let strokeWidth = highlight ? 0 : w * 0.06;
  let points = `${w * 0.18},${w * 0.95} ${w * 0.25},${w * 0.4} ${w * 0.8},${
    w * 0.6
  }`;

  return (
    <svg width={w + 4} height={w + 4}>
      <g transform="translate(2, 2)" strokeWidth={highlight ? 0 : strokeWidth}>
        <defs>
          <rect id="canvas" width="100%" height="100%" fill="white" />
          <polygon id="tail" stroke="white" points={points} />
          <ellipse
            id="ellipse"
            cx={w / 2}
            cy={w / 2}
            rx={w * 0.47}
            ry={w * 0.4}
          />
          <mask id="c1">
            <use href="#canvas" />
            <use href="#tail" />
          </mask>
          <mask id="c2">
            <use href="#canvas" />
            <use href="#ellipse" />
          </mask>
        </defs>
        <polygon
          stroke={SVG_BLACK}
          id="tail"
          points={points}
          fill={highlight ? FOOTER : "none"}
          mask={highlight ? "" : "url(#c2)"}
        />
        <use
          href="#ellipse"
          stroke={SVG_BLACK}
          fill={highlight ? FOOTER : "none"}
          mask={highlight ? "" : "url(#c1)"}
        />
      </g>
    </svg>
  );
};
