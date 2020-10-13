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
  active: number;
};

type MoveImagePayload = { id: number; dx: number; dy: number };

type RepeatAction =
  | ["newImage", ImageInfo]
  | ["setImage", ImageInfo]
  | ["moveImage", MoveImagePayload]
  | ["removeImage", ImageInfo["id"]]
  | ["setActive", ImageInfo["id"]];

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
        case "removeImage":
          let filtered = state.images.filter(
            i => i.id !== (payload as ImageInfo["id"])
          );
          return {
            ...state,
            images: filtered
          };
        case "setActive":
          return { ...state, active: payload as ImageInfo["id"] };
        default:
          return state;
      }
    },
    { images: [initEmptyImage], active: initEmptyImage.id }
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
