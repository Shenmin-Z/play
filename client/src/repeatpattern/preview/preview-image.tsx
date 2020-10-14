import React, { FC, useState, useEffect, useRef } from "react";
import { fromEvent, merge } from "rxjs";
import { switchMap, tap, pairwise, takeUntil, filter } from "rxjs/operators";
import { ImageInfo } from "../images";
import { Resizer } from "./resizer";
import { useRepeatContext } from "../repeat-context";
import { usePreviewContext } from "./preview-context";

type Props = {
  image: ImageInfo;
  toggleOverflow: () => void;
};

const INIT_MODE = {
  move: false,
  resize: false,
  rd1: false,
  rd2: false
};
export let PreviewImage: FC<Props> = ({ image, toggleOverflow }) => {
  let { file, w, h, x, y, r1, r2 } = image;

  let [blobUrl] = useState(file ? URL.createObjectURL(file) : null);

  let imgRef = useRef<HTMLImageElement>();

  let { repeatDispatch } = useRepeatContext();

  let { previewState, previewDispatch } = usePreviewContext();

  let modeRef = useRef(INIT_MODE);

  useEffect(() => {
    let { mode } = previewState;
    let newRef = { ...INIT_MODE };
    if (mode === "move") {
      newRef.move = true;
    }
    if (mode === "resize") {
      newRef.resize = true;
    }
    if (mode === "rd1") {
      newRef.rd1 = true;
    }
    if (mode === "rd2") {
      newRef.rd2 = true;
    }
    modeRef.current = newRef;
  }, [previewState.mode]);

  useEffect(() => {
    let img = imgRef.current;
    if (!img) return;

    let start$ = merge(
      fromEvent(img, "mousedown"),
      fromEvent(img, "touchstart")
    ).pipe(filter(() => modeRef.current.move));
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
              repeatDispatch(["moveImage", { id: image.id, dx, dy }]);
            }),
            takeUntil(
              end$.pipe(
                tap(toggleOverflow),
                tap(() => {
                  //previewDispatch(["setMode", null]);
                })
              )
            )
          )
        )
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [blobUrl]);

  if (!blobUrl) return null;

  return (
    <span
      style={{
        userSelect: "none",
        position: "absolute",
        transform: `translate3d(${x}px, ${y}px, 0)`,
        boxSizing: "border-box",
        width: w,
        height: h,
        border: `1px solid ${
          previewState.mode === "resize" ? "rgb(98, 99, 101)" : "transparent"
        }`
      }}
    >
      <img
        ref={imgRef}
        src={blobUrl}
        style={{
          position: "absolute",
          width: w,
          height: h
        }}
        onDragStart={e => {
          e.preventDefault();
        }}
      />
      <Resizer w={w} h={h} id={image.id} />
    </span>
  );
};
