import React, { FC, useState, useEffect, useRef } from "react";
import { Subject, fromEvent, merge } from "rxjs";
import { tap, switchMap, pairwise, takeUntil, filter } from "rxjs/operators";
import { useRepeatContext } from "../repeat-context";
import { usePreviewContext } from "./preview-context";
import { ImageInfo } from "../images";

type Props = {
  src: string;
  image: ImageInfo;
  type: "r1" | "r2";
  toggleOverflow: () => void;
};

export let BuddyImage: FC<Props> = ({ src, image, type, toggleOverflow }) => {
  let { repeatDispatch } = useRepeatContext();

  let { previewState } = usePreviewContext();
  let { mode } = previewState;

  let { w, h } = image;

  let r = image[type];

  let [start$] = useState(() => new Subject<null>());

  let enableRef = useRef<boolean>(false);
  enableRef.current =
    (mode === "rd1" && type === "r1") || (mode === "rd2" && type === "r2");

  useEffect(() => {
    let move$ = merge(
      fromEvent(document, "mousemove"),
      fromEvent(document, "touchmove")
    );
    let end$ = merge(
      fromEvent(document, "mouseup"),
      fromEvent(document, "touchend")
    );

    let subscription = start$
      .pipe(
        filter(() => enableRef.current),
        tap(toggleOverflow),
        switchMap(() =>
          move$.pipe(
            pairwise(),
            tap(([a, b]) => {
              let dx = 0,
                dy = 0;
              if (a.type === "touchmove") {
                let { pageX: ax, pageY: ay } = (a as TouchEvent).touches[0];
                let { pageX: bx, pageY: by } = (b as TouchEvent).touches[0];
                dx = bx - ax;
                dy = by - ay;
              }
              if (a.type === "mousemove") {
                let { clientX: ax, clientY: ay } = a as MouseEvent;
                let { clientX: bx, clientY: by } = b as MouseEvent;
                dx = bx - ax;
                dy = by - ay;
              }
              repeatDispatch([
                "setRepeat",
                {
                  id: image.id,
                  type,
                  dx,
                  dy
                }
              ]);
            }),
            takeUntil(end$.pipe(tap(toggleOverflow)))
          )
        )
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (isNothing(r) || isNothing(r.x) || isNothing(r.y)) return null;

  return (
    <img
      src={src}
      onMouseDown={() => {
        start$.next(null);
      }}
      onTouchStart={() => {
        start$.next(null);
      }}
      onDragStart={e => {
        e.preventDefault();
      }}
      style={{
        position: "absolute",
        filter:
          (mode === "rd1" && type === "r1") || (mode === "rd2" && type === "r2")
            ? "grayscale(1)"
            : "",
        opacity:
          (mode === "rd1" && type === "r2") || (mode === "rd2" && type === "r1")
            ? 0.5
            : 1,
        width: w,
        height: h,
        transform: `translate3d(${r.x}px, ${r.y}px, 0)`
      }}
    />
  );
};

let isNothing = (x: any) => x === null || x === undefined;
