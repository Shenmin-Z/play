import React, { FC, useState, CSSProperties } from "react";

type Props = {
  radius: number;
  setRadius: (a: number) => void;
  label: string;
  setLabel: (a: string) => void;
};

let Form: FC<Props> = ({ radius, setRadius, label, setLabel }) => {
  let [localRadius, setLocalRadius] = useState(radius + "");
  let [error, setError] = useState(false);

  return (
    <div>
      <label style={formLabelStyle}>Size of Play Button (%)</label>
      <input
        style={formInputStyle(error)}
        type="text"
        value={localRadius}
        onChange={e => {
          let value = e.target.value;
          setLocalRadius(value);
          let valid = /^[1-9][0-9]?$|^100$/.test(value);
          if (valid) {
            setRadius(parseInt(value));
            setError(false);
          } else {
            setError(true);
          }
        }}
      />
      <label style={formLabelStyle}>Label</label>
      <input
        placeholder="e.g. 12:01"
        style={formInputStyle(false)}
        type="text"
        value={label}
        onChange={e => {
          setLabel(e.target.value);
        }}
      />
    </div>
  );
};

export let useForm = () => {
  let [radius, setRadius] = useState<number>(50);
  let [label, setLabel] = useState<string>("");

  let form = (
    <Form
      radius={radius}
      setRadius={setRadius}
      label={label}
      setLabel={setLabel}
    />
  );
  return { form, radius, label };
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
  border: `1px solid ${e ? "var(--light-pink)" : "rgb(226, 232, 240)"}`,
  borderRadius: ".5rem",
  marginBottom: "0.5rem",
  color: "rgb(74,85,104)",
  padding: ".5rem .75rem",
  lineHeight: 1.25,
  outline: "none"
});
