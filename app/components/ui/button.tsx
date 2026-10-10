import { Button as BaseButton } from "@base-ui/react/button";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentProps } from "react";
import { color } from "~/styles/tokens.stylex";

export function Button({
  variant = "solid",
  xstyle,
  ...props
}: Omit<ComponentProps<typeof BaseButton>, "className" | "style"> & {
  variant?: "solid" | "outline";
  xstyle?: StyleXStyles;
}) {
  return <BaseButton {...props} {...stylex.props(styles.root, styles[variant], xstyle)} />;
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
    outlineOffset: 3,
  },
  solid: {
    backgroundColor: color.text,
    color: color.bg,
  },
  outline: {
    backgroundColor: "transparent",
    color: color.text,
  },
});
