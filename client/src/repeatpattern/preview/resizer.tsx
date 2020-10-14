import React, { FC, CSSProperties, useState, useEffect } from "react";
import { Subject, fromEvent, merge } from "rxjs";
import { tap, switchMap, pairwise, takeUntil } from "rxjs/operators";
import { Position, useRepeatContext } from "../repeat-context";
import { usePreviewContext } from "./preview-context";

type Props = {
  w: number;
  h: number;
  id: number;
};

export let Resizer: FC<Props> = ({ w, h, id }) => {
  let [start$] = useState(() => new Subject<Position>());

  let start = (p: Position) => ({
    onMouseDown: () => {
      start$.next(p);
    },
    onTouchStart: () => {
      start$.next(p);
    }
  });

  let { repeatDispatch } = useRepeatContext();

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
        switchMap(p =>
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
              repeatDispatch(["resizeImage", { id, dx, dy, p }]);
            }),
            takeUntil(end$)
          )
        )
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  let { previewState } = usePreviewContext();

  let display = { display: previewState.mode === "resize" ? "block" : "none" };

  return (
    <>
      <div
        style={{
          ...squareStyle,
          ...display,
          top: 0,
          left: 0,
          cursor: "nwse-resize"
        }}
        {...start("12")}
      />
      <div
        style={{
          ...squareStyle,
          ...display,
          top: 0,
          left: w / 2 - 3,
          cursor: "ns-resize"
        }}
        {...start("1")}
      />
      <div
        style={{
          ...squareStyle,
          ...display,
          top: 0,
          right: -1,
          cursor: "nesw-resize"
        }}
        {...start("01")}
      />

      <div
        style={{
          ...squareStyle,
          ...display,
          top: h / 2 - 3,
          left: 0,
          cursor: "ew-resize"
        }}
        {...start("2")}
      />
      <div
        style={{
          ...squareStyle,
          ...display,
          top: h / 2 - 3,
          right: -1,
          cursor: "ew-resize"
        }}
        {...start("0")}
      />

      <div
        style={{
          ...squareStyle,
          ...display,
          bottom: -1,
          left: 0,
          cursor: "nesw-resize"
        }}
        {...start("23")}
      />
      <div
        style={{
          ...squareStyle,
          ...display,
          bottom: -1,
          left: w / 2 - 3,
          cursor: "ns-resize"
        }}
        {...start("3")}
      />
      <div
        style={{
          ...squareStyle,
          ...display,
          bottom: -1,
          right: -1,
          cursor: "nwse-resize"
        }}
        {...start("30")}
      />
    </>
  );
};

let squareStyle: CSSProperties = {
  width: 6,
  height: 6,
  backgroundColor: "rgb(0, 135, 247)",
  position: "absolute"
};
