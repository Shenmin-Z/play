import React, {
  createContext,
  useContext,
  FC,
  Dispatch,
  useReducer
} from "react";
import { ImageInfo, initEmptyImage } from "./images";

type RepeatState = {
  images: ImageInfo[];
  canvasSize: { w: number; h: number };
  active: number;
};

type MoveImagePayload = { id: number; dx: number; dy: number };
export type Position = "0" | "1" | "2" | "3" | "01" | "12" | "23" | "30";
type ResizeImagePayload = { id: number; dx: number; dy: number; p: Position };
type RepeatPayload = { id: number; type: "r1" | "r2"; dx: number; dy: number };

type RepeatAction =
  | ["newImage", ImageInfo]
  | ["setImage", ImageInfo]
  | ["moveImage", MoveImagePayload]
  | ["resizeImage", ResizeImagePayload]
  | ["setRepeat", RepeatPayload]
  | ["removeImage", ImageInfo["id"]]
  | ["setActive", ImageInfo["id"]]
  | ["setCanvas", RepeatState["canvasSize"]];

type RepeatReducer = {
  (p: RepeatState, a: RepeatAction): RepeatState;
};

type RepeatContext = {
  repeatDispatch: Dispatch<RepeatAction>;
  repeatState: RepeatState;
};
let RepeatContext = createContext<RepeatContext>(null);

export let useRepeatContext = () => useContext(RepeatContext);

export let RepeatProvider: FC = ({ children }) => {
  let [repeatState, repeatDispatch] = useReducer<RepeatReducer>(
    function reduce(state, action) {
      let [type, payload] = action;
      switch (type) {
        case "newImage": {
          return { ...state, images: [...state.images, payload as ImageInfo] };
        }
        case "setImage": {
          let _payload = payload as ImageInfo;
          return {
            ...state,
            images: state.images.map(i => {
              if (i.id !== _payload.id) {
                return i;
              } else {
                return _payload;
              }
            })
          };
        }
        case "moveImage": {
          let { id, dx, dy } = payload as MoveImagePayload;
          return {
            ...state,
            images: state.images.map(i => {
              if (i.id !== id) {
                return i;
              } else {
                return { ...i, x: i.x + dx, y: i.y + dy };
              }
            })
          };
        }
        case "resizeImage": {
          let { id, dx, dy, p } = payload as ResizeImagePayload;
          return {
            ...state,
            images: state.images.map(i => {
              if (i.id !== id) {
                return i;
              } else {
                let [nx, ny, nw, nh] = [i.x, i.y, i.w, i.h];
                switch (p) {
                  case "01": {
                    ny += dy;
                    nw += dx;
                    nh -= dy;
                    break;
                  }
                  case "1": {
                    ny += dy;
                    nh -= dy;
                    break;
                  }
                  case "12": {
                    nx += dx;
                    ny += dy;
                    nw -= dx;
                    nh -= dy;
                    break;
                  }
                  case "2": {
                    nx += dx;
                    nw -= dx;
                    break;
                  }
                  case "0": {
                    nw += dx;
                    break;
                  }
                  case "23": {
                    nx += dx;
                    nw -= dx;
                    nh += dy;
                    break;
                  }
                  case "3": {
                    nh += dy;
                    break;
                  }
                  case "30": {
                    nw += dx;
                    nh += dy;
                    break;
                  }
                }
                if (nw <= 0 || nh <= 0) return i;
                return { ...i, x: nx, y: ny, w: nw, h: nh };
              }
            })
          };
        }
        case "setRepeat": {
          let { id, type, dx, dy } = payload as RepeatPayload;
          return {
            ...state,
            images: state.images.map(i => {
              if (i.id !== id) {
                return i;
              } else {
                return {
                  ...i,
                  [type]: {
                    x: (i[type]?.x || 0) + dx,
                    y: (i[type]?.y || 0) + dy
                  }
                };
              }
            })
          };
        }
        case "removeImage": {
          let filtered = state.images.filter(
            i => i.id !== (payload as ImageInfo["id"])
          );
          return {
            ...state,
            images: filtered
          };
        }
        case "setActive":
          return { ...state, active: payload as ImageInfo["id"] };
        case "setCanvas":
          return {
            ...state,
            canvasSize: {
              ...state.canvasSize,
              ...(payload as RepeatState["canvasSize"])
            }
          };
        default:
          return state;
      }
    },
    {
      images: [initEmptyImage],
      canvasSize: { w: 1024, h: 1024 },
      active: initEmptyImage.id
    }
  );

  return (
    <RepeatContext.Provider
      value={{
        repeatDispatch,
        repeatState
      }}
    >
      {children}
    </RepeatContext.Provider>
  );
};
