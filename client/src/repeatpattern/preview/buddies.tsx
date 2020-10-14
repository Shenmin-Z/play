import React, { FC, useMemo } from "react";
import { ImageInfo } from "../images";
import { useRepeatContext } from "../repeat-context";
import { usePreviewContext } from "./preview-context";

type Props = {
  image: ImageInfo;
  src: string;
};

export let ImageBuddies: FC<Props> = ({ image, src }) => {
  let { previewState } = usePreviewContext();
  let { mode } = previewState;

  let { repeatState } = useRepeatContext();
  let { canvasSize } = repeatState;
  let { w: cw, h: ch } = canvasSize;
  let { x, y, w, h, r1, r2 } = image;

  let { x: a1, y: b1 } = r1 || { x: 10000, y: 10000 };
  let { x: a2, y: b2 } = r2 || { x: 10000, y: 10000 };

  let allPoints = useMemo(() => {
    if (isNothing(r1) && isNothing(r2)) return [];

    let w1 = -w - x;
    let w2 = cw - x;
    let h1 = -h - y;
    let h2 = ch - y;

    let getI = (j: number): [number, number][] => {
      let range1 = sort((w1 - j * a2) / a1, (w2 - j * a2) / a1);
      let range2 = sort((h1 - j * b2) / b1, (h2 - j * b2) / b1);
      let left = Math.ceil(Math.max(range1[0], range2[0]));
      let right = Math.floor(Math.min(range1[1], range2[1]));
      if (left <= right) {
        let result = [];
        for (let i = left; i <= right; i++) {
          result.push([i, j]);
        }
        return result;
      }
      return [];
    };

    let allPoints = getI(0);

    if (Math.abs(Math.atan(a1 / b1) - Math.atan(a2 / b2)) > 0.05) {
      let j = 1;
      while (true) {
        let tmp = getI(j);
        if (tmp.length > 0) {
          allPoints = allPoints.concat(tmp);
          j++;
        } else {
          break;
        }
      }
      j = -1;
      while (true) {
        let tmp = getI(j);
        if (tmp.length > 0) {
          allPoints = allPoints.concat(tmp);
          j--;
        } else {
          break;
        }
      }
    }

    return allPoints;
  }, [cw, ch, x, y, w, h, a1, b1, a2, b2]);

  return (
    <>
      {allPoints.map(i => (
        <img
          key={i.join(",")}
          src={src}
          onDragStart={e => {
            e.preventDefault();
          }}
          style={{
            position: "absolute",
            width: w,
            height: h,
            opacity: mode !== null ? 0.5 : 1,
            transform: `translate3d(${i[0] * a1 + i[1] * a2}px, ${
              i[0] * b1 + i[1] * b2
            }px, 0px)`
          }}
        />
      ))}
    </>
  );
};

let isNothing = (x: any) => x === null || x === undefined;
let sort = (a: number, b: number) => (a <= b ? [a, b] : [b, a]);
