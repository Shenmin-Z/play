import React, { FC, useReducer, Dispatch, CSSProperties } from "react";
import { buildUrl } from "../util";

type FormProps = {
  formState: FormState;
  formDispatch: Dispatch<FormAction>;
};

let Form: FC<FormProps> = ({ formState, formDispatch }) => {
  return (
    <div>
      <label style={formLabelStyle}>Size of Play Button (%)</label>
      <input
        placeholder="e.g. 50"
        style={formInputStyle(formState.radiusErr)}
        type="text"
        value={formState.radiusBuf}
        onChange={e => {
          let value = e.target.value;
          formDispatch(["setRadius", value]);
        }}
      />
      <label style={formLabelStyle}>Label</label>
      <input
        placeholder="e.g. 12:01"
        style={formInputStyle(false)}
        type="text"
        value={formState.label}
        onChange={e => {
          formDispatch(["setLabel", e.target.value]);
        }}
      />
    </div>
  );
};

type FormState = {
  label: string;
  radius: number;
  radiusBuf: string;
  radiusErr: boolean;
  serviceUrl?: string;
  error: boolean;
};

type FormAction = ["setRadius" | "setLabel", string];

type FormReducer = {
  (p: FormState, c: FormAction): FormState;
};

export let useForm = () => {
  let [formState, formDispatch] = useReducer<FormReducer>(
    (state, action) => {
      let newState = state;
      switch (action[0]) {
        case "setRadius": {
          let payload = action[1];
          let valid = /^[1-9][0-9]?$|^100$/.test(payload);
          let newRadius = parseInt(payload);
          if (valid) {
            newState = {
              ...state,
              radius: newRadius,
              radiusBuf: payload,
              radiusErr: false
            };
          } else {
            newState = { ...state, radiusBuf: payload, radiusErr: true };
          }
          break;
        }
        case "setLabel":
          newState = { ...state, label: action[1] };
          break;
      }
      newState.serviceUrl = buildUrl("/api/image/playbutton", {
        label: newState.label,
        radius: newState.radius
      });
      newState.error = newState.radiusErr;
      return newState;
    },
    {
      label: "",
      radiusBuf: "",
      radiusErr: false,
      radius: 50,
      serviceUrl: buildUrl("/api/image/playbutton", {
        radius: 50
      }),
      error: false
    }
  );

  let formElm = <Form formState={formState} formDispatch={formDispatch} />;

  return { formElm, serviceUrl: formState.serviceUrl, error: formState.error };
};

let formLabelStyle: CSSProperties = {
  display: "block",
  color: "var(--form-label)",
  marginBottom: "0.5rem",
  fontSize: ".875rem",
  fontWeight: 700
};

let formInputStyle: (e: boolean) => CSSProperties = e => ({
  width: "100%",
  boxSizing: "border-box",
  border: `${e ? "2" : "1"}px solid ${e ? "#FF5630" : "rgb(226, 232, 240)"}`,
  borderRadius: ".5rem",
  marginBottom: "0.5rem",
  color: "rgb(74,85,104)",
  padding: ".5rem .75rem",
  lineHeight: 1.25,
  outline: "none"
});
