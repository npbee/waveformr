import * as stylex from "@stylexjs/stylex";
import type { ComponentProps, ReactNode } from "react";
import { Button } from "~/components/ui/button";

/** Square button holding a single icon. The label is required: it's the only name it has. */
export function IconButton({
  icon,
  size = "default",
  xstyle,
  ...props
}: Omit<ComponentProps<typeof Button>, "iconStart" | "iconEnd" | "children"> & {
  icon: ReactNode;
  "aria-label": string;
}) {
  return <Button {...props} size={size} iconStart={icon} xstyle={[sizes[size], xstyle]} />;
}

// Widths match Button's block sizes, so each size comes out square.
const sizes = stylex.create({
  default: {
    inlineSize: 44,
    paddingInline: 0,
  },
  sm: {
    inlineSize: 32,
    paddingInline: 0,
  },
});
