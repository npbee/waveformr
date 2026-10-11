import type { StyleXStyles } from "@stylexjs/stylex";
import { PillPicker } from "~/components/pill-picker";

export const waveformStyles = [
  { value: "bars", label: "Bars" },
  { value: "mirror", label: "Mirror" },
  { value: "steps", label: "Steps" },
] as const;

export type WaveformStyle = (typeof waveformStyles)[number]["value"];

export function StylePicker(props: {
  value: WaveformStyle;
  onValueChange: (value: WaveformStyle) => void;
  xstyle?: StyleXStyles;
}) {
  return (
    <PillPicker
      aria-label="Style"
      options={waveformStyles}
      value={props.value}
      onValueChange={props.onValueChange}
      xstyle={props.xstyle}
    />
  );
}
