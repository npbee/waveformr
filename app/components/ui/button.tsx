import { Button as BaseButton } from "@base-ui/react/button";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentProps, ReactNode } from "react";
import { color } from "~/styles/tokens.stylex";

export function Button({
  variant = "solid",
  size = "default",
  iconStart,
  iconEnd,
  children,
  xstyle,
  ...props
}: Omit<ComponentProps<typeof BaseButton>, "className" | "style" | "children"> & {
  variant?: "solid" | "outline" | "ghost";
  size?: "default" | "sm";
  /** Decorative; give the button a text label or an aria-label. */
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
  children?: ReactNode;
  xstyle?: StyleXStyles;
}) {
  return (
    <BaseButton {...props} {...stylex.props(styles.root, styles[variant], sizes[size], xstyle)}>
      {iconStart ? (
        <span aria-hidden {...stylex.props(styles.icon)}>
          {iconStart}
        </span>
      ) : null}
      {children}
      {iconEnd ? (
        <span aria-hidden {...stylex.props(styles.icon)}>
          {iconEnd}
        </span>
      ) : null}
    </BaseButton>
  );
}

const styles = stylex.create({
  root: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    margin: 0,
    font: "inherit",
    fontWeight: 500,
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
    // Riso press: the button stamps down and to the right.
    translate: {
      default: "0 0",
      ":active": "2px 2px",
      ":disabled": "0 0",
    },
    transitionProperty: "translate",
    transitionDuration: {
      default: "120ms",
      ":active": "40ms",
      "@media (prefers-reduced-motion: reduce)": "0s",
    },
    transitionTimingFunction: "ease-out",
  },
  icon: {
    display: "flex",
    flexShrink: 0,
  },
  solid: {
    backgroundColor: color.text,
    color: color.bg,
  },
  outline: {
    backgroundColor: "transparent",
    color: color.text,
  },
  ghost: {
    borderColor: "transparent",
    backgroundColor: {
      default: "transparent",
      "@media (hover: hover) and (pointer: fine)": {
        default: "transparent",
        ":hover": color.componentHover,
      },
      ":active": color.componentActive,
    },
    color: color.text,
  },
});

const sizes = stylex.create({
  default: {
    minBlockSize: 44,
    paddingInline: 16,
    borderRadius: 10,
  },
  sm: {
    minBlockSize: 32,
    paddingInline: 12,
    borderRadius: 8,
    fontSize: 14,
  },
});
