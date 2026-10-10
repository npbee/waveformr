import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentProps } from "react";
import { color, radius } from "~/styles/tokens.stylex";

export function Card({
  xstyle,
  ...props
}: Omit<ComponentProps<"div">, "className" | "style"> & { xstyle?: StyleXStyles }) {
  return <div {...props} {...stylex.props(styles.root, xstyle)} />;
}

const styles = stylex.create({
  root: {
    backgroundColor: color.surface,
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: color.border,
    borderRadius: radius.lg,
  },
});
