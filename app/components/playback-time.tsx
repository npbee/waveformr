import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { color, font } from "~/styles/tokens.stylex";

export function PlaybackTime(props: {
  currentTime: number;
  duration: number;
  xstyle?: StyleXStyles;
}) {
  return (
    <span {...stylex.props(styles.root, props.xstyle)}>
      {formatTime(props.currentTime)} / {formatTime(props.duration)}
    </span>
  );
}

// m:ss, which covers anything shorter than an hour.
export function formatTime(seconds: number) {
  let whole = Math.floor(seconds);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}

const styles = stylex.create({
  root: {
    flexShrink: 0,
    fontFamily: font.sans,
    // Digits keep one width so the readout doesn't shift as it counts.
    fontVariantNumeric: "tabular-nums",
    fontSize: 13,
    color: color.text,
    whiteSpace: "nowrap",
  },
});
