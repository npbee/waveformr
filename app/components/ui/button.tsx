import { Button as BaseButton } from "@base-ui/react/button";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentProps } from "react";
import { color } from "~/styles/tokens.stylex";

export function Button({
  xstyle,
  ...props
}: Omit<ComponentProps<typeof BaseButton>, "className" | "style"> & {
  xstyle?: StyleXStyles;
}) {
  return <BaseButton {...props} {...stylex.props(styles.root, xstyle)} />;
}

const styles = stylex.create({
  root: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    margin: 0,
    font: "inherit",
    fontWeight: 600,
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: color.border,
    backgroundColor: color.text,
    color: color.bg,
    cursor: {
      default: "pointer",
      ":disabled": "not-allowed",
    },
    opacity: {
      default: 1,
      ":disabled": 0.5,
    },
    outline: {
      default: "none",
      ":focus-visible": `2px solid ${color.focusRing}`,
    },
    outlineOffset: 2,
    // Riso press: the button sits up off an offset ink layer and stamps down
    // onto it when pressed.
    boxShadow: {
      default: `3px 3px 0 ${color.accent}`,
      ":active": `0 0 0 ${color.accent}`,
      ":disabled": `3px 3px 0 ${color.accent}`,
    },
    translate: {
      default: "0 0",
      ":active": "3px 3px",
      ":disabled": "0 0",
    },
    transitionProperty: "translate, box-shadow",
    transitionDuration: {
      default: "120ms",
      ":active": "40ms",
      "@media (prefers-reduced-motion: reduce)": "0s",
    },
    transitionTimingFunction: "ease-out",
  },
});
