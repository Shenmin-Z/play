import React, { FC, useEffect } from "react";
import { fromEvent } from "rxjs";
import { switchMap, tap, takeUntil, filter } from "rxjs/operators";
import { usePreviewContext, Mode } from "./preview-context";

const SIZE = 40;
const BG = "rgb(241, 243, 244)";
const BUTTON = "rgb(220, 222, 224)";
const ACTIVE = "#ffffff";

export let Toolbar: FC = () => {
  let { previewDispatch } = usePreviewContext();

  useEffect(() => {
    let keydown$ = fromEvent<KeyboardEvent>(document, "keydown");
    let keyup$ = fromEvent<KeyboardEvent>(document, "keyup");

    let f1 = filter((e: KeyboardEvent) => e.keyCode === 192 && !e.repeat);
    let f2 = filter(
      (e: KeyboardEvent) =>
        !e.repeat && [49, 50, 51, 52].some(i => i === e.keyCode)
    );

    let subscription = keydown$
      .pipe(
        f1,
        switchMap(() => {
          return keydown$.pipe(
            f2,
            tap(e => {
              if (e.keyCode === 49) {
                previewDispatch(["setMode", "move"]);
              }
              if (e.keyCode === 50) {
                previewDispatch(["setMode", "resize"]);
              }
              if (e.keyCode === 51) {
                previewDispatch(["setMode", "rd1"]);
              }
              if (e.keyCode === 52) {
                previewDispatch(["setMode", "rd2"]);
              }
            }),
            takeUntil(
              keyup$.pipe(
                f1,
                tap(() => {
                  previewDispatch(["setMode", null]);
                })
              )
            ),
            switchMap(() =>
              keyup$.pipe(
                f2,
                tap(() => {
                  previewDispatch(["setMode", null]);
                }),
                takeUntil(keyup$.pipe(f1))
              )
            )
          );
        })
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div
      style={{
        width: SIZE,
        backgroundColor: BG,
        border: `10px solid ${BG}`,
        borderRadius: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "default"
      }}
    >
      <Button type="move" />
      <Button type="resize" />
      <Button type="rd1" />
      <Button type="rd2" />
    </div>
  );
};

type ButtonProps = {
  type: Mode;
};

const TEXT_MAP = {
  move: "Move",
  resize: "Resize",
  rd1: "RD1",
  rd2: "RD2"
};

const ACTIVE_TEXT_MAP = {
  move: "M",
  resize: "R",
  rd1: "1",
  rd2: "2"
};

let Button: FC<ButtonProps> = ({ type }) => {
  let { previewState, previewDispatch } = usePreviewContext();

  let { hover, mode } = previewState;

  let active = (() => {
    if (mode) {
      return mode === type;
    } else {
      return hover === type;
    }
  })();

  return (
    <div
      style={{
        width: SIZE,
        height: SIZE,
        lineHeight: SIZE + "px",
        borderRadius: "50%",
        textAlign: "center",
        backgroundColor: active ? ACTIVE : BUTTON,
        margin: "5px"
      }}
      onClick={() => {
        previewDispatch(["toggleMode", type]);
      }}
      onMouseOver={() => {
        //previewDispatch(["setHover", type]);
      }}
      onMouseLeave={() => {
        //previewDispatch(["setHover", null]);
      }}
    >
      <span
        style={{
          fontSize: active ? 16 : 8,
          fontWeight: active ? "bold" : "normal",
          color: "rgb(98, 99, 101)"
        }}
      >
        {active ? ACTIVE_TEXT_MAP[type] : TEXT_MAP[type]}
      </span>
    </div>
  );
};
