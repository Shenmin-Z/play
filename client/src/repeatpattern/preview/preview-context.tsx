import React, {
  FC,
  useReducer,
  createContext,
  Dispatch,
  useContext
} from "react";

export type Mode = "move" | "resize" | "rd1" | "rd2";

type PreviewState = {
  mode: Mode;
  hover: Mode;
};

type PreviewAction =
  | ["setMode", Mode]
  | ["toggleMode", Mode]
  | ["setHover", Mode];

type PreviewReducer = {
  (p: PreviewState, a: PreviewAction): PreviewState;
};

let PreviewContext = createContext<{
  previewState: PreviewState;
  previewDispatch: Dispatch<PreviewAction>;
}>(null);

export let usePreviewContext = () => useContext(PreviewContext);

export let PreviewProvider: FC = ({ children }) => {
  let [state, dispatch] = useReducer<PreviewReducer>(
    (state, action) => {
      let [type, payload] = action;
      switch (type) {
        case "setMode": {
          return { ...state, mode: payload };
        }
        case "toggleMode": {
          return { ...state, mode: state.mode === payload ? null : payload };
        }
        case "setHover": {
          return { ...state, hover: payload };
        }
        default:
          return state;
      }
    },
    { mode: null, hover: null }
  );

  return (
    <PreviewContext.Provider
      value={{
        previewState: state,
        previewDispatch: dispatch
      }}
    >
      {children}
    </PreviewContext.Provider>
  );
};
