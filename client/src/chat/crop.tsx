import React, { FC, useEffect, useState, useReducer } from "react";
import { Subject, fromEvent, merge } from "rxjs";
import { tap, switchMap, pairwise, takeUntil } from "rxjs/operators";

type Props = {
  file: File;
  onOk: (r: { x: number; y: number; w: number; h: number }) => void;
  onCancel: () => void;
};

type State = {
  size: {
    iw: number;
    ih: number;
    cw: number;
    ch: number;
  };
  win: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  transform: {
    k: number;
    x: number;
    y: number;
  };
};

type Action =
  | ["setSizeInfo", State["size"]]
  | ["moveImage", { dx: number; dy: number }];

type Reducer = {
  (s: State, a: Action): State;
};

export let ImageCrop: FC<Props> = ({ file, onOk, onCancel }) => {
  let [src] = useState(() => URL.createObjectURL(file));

  let [state, dispath] = useReducer<Reducer>(
    (state, action) => {
      let [type, payload] = action;
      switch (type) {
        case "setSizeInfo": {
          let { cw, ch, iw, ih } = payload as State["size"];
          let cmin = Math.min(cw, ch);
          let win = {
            x: (cw - cmin) / 2,
            y: (ch - cmin) / 2,
            w: cmin,
            h: cmin
          };
          let transform = {
            k: cmin / Math.min(iw, ih),
            x: 0,
            y: 0
          };
          return { ...state, size: payload as State["size"], win, transform };
        }
        case "moveImage": {
          let { dx, dy } = payload as { dx: number; dy: number };
          let nx = state.transform.x + dx;
          let ny = state.transform.y + dy;
          if (nx > 0 || nx < state.win.w - state.size.iw * state.transform.k)
            return state;
          if (ny > 0 || ny < state.win.h - state.size.ih * state.transform.k)
            return state;
          return {
            ...state,
            transform: { k: state.transform.k, x: nx, y: ny }
          };
        }
        default:
          return state;
      }
    },
    { size: null, win: null, transform: null }
  );

  let { size, win, transform } = state;

  let [start$] = useState(() => new Subject<null>());

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
              dispath([
                "moveImage",
                {
                  dx,
                  dy
                }
              ]);
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

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        width: "100vw",
        height: "100%",
        backgroundColor: "#000"
      }}
    >
      <div
        style={{
          position: "relative",
          height: "calc(100% - 60px)",
          margin: "0 20px"
        }}
      >
        <div
          style={
            win
              ? {
                  position: "absolute",
                  top: win.y,
                  left: win.x,
                  width: win.w,
                  height: win.h,
                  border: "2px solid #fff",
                  overflow: "hidden"
                }
              : { display: "none" }
          }
        >
          <img
            style={
              size
                ? {
                    position: "absolute",
                    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
                    height: size.ih * transform.k,
                    width: size.iw * transform.k
                  }
                : { display: "none" }
            }
            src={src}
            onLoad={({ target }) => {
              let img = target as HTMLImageElement;
              let { width: iw, height: ih } = img;
              let {
                width: cw,
                height: ch
              } = img.parentElement.parentElement.getBoundingClientRect();
              dispath(["setSizeInfo", { iw, ih, cw, ch }]);
              URL.revokeObjectURL(src);
            }}
            onMouseDown={() => {
              start$.next(null);
            }}
            onTouchStart={() => {
              start$.next(null);
            }}
          />
        </div>
      </div>
      <div
        style={{
          fontSize: "20px",
          height: 60,
          display: "flex",
          color: "#fff",
          justifyContent: "space-around",
          alignItems: "center"
        }}
      >
        <div
          onClick={() => {
            onOk({
              x: -transform.x / transform.k,
              y: -transform.y / transform.k,
              w: win.w / transform.k,
              h: win.h / transform.k
            });
          }}
        >
          ✔
        </div>
        <div onClick={onCancel}>✘</div>
      </div>
    </div>
  );
};
