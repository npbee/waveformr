import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ReactNode } from "react";

/** A key or key combination, drawn as a small keycap. */
export function Kbd(props: { children: ReactNode; xstyle?: StyleXStyles }) {
  return <kbd {...stylex.props(styles.root, props.xstyle)}>{props.children}</kbd>;
}

// Inherits its color, so it reads on light tooltips and dark ones alike.
const styles = stylex.create({
  root: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    minInlineSize: 20,
    blockSize: 20,
    paddingInline: 4,
    font: "inherit",
    fontSize: 12,
    fontWeight: 500,
    lineHeight: 1,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "color-mix(in oklch, currentColor 35%, transparent)",
    borderRadius: 4,
  },
});
