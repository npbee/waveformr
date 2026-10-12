import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { Toggle, ToggleGroup } from "~/components/ui/toggle-group";
import { color } from "~/styles/tokens.stylex";

/**
 * One of a few options in a single outlined strip. Options with an icon show
 * only the icon and use the label as their accessible name.
 */
export function SegmentedControl<T extends string>(props: {
  options: readonly { value: T; label: string; icon?: ReactNode }[];
  value: T | null;
  onValueChange: (value: T) => void;
  /** One of these is required: the group needs a name. */
  "aria-label"?: string;
  "aria-labelledby"?: string;
  xstyle?: StyleXStyles;
}) {
  return (
    <ToggleGroup
      aria-label={props["aria-label"]}
      aria-labelledby={props["aria-labelledby"]}
      value={props.value}
      onValueChange={props.onValueChange}
      xstyle={[styles.root, props.xstyle]}
    >
      {props.options.map((option) => (
        <Toggle
          key={option.value}
          value={option.value}
          aria-label={option.icon ? option.label : undefined}
          xstyle={({ pressed }) => [styles.segment, pressed && styles.pressed]}
        >
          {option.icon ?? option.label}
        </Toggle>
      ))}
    </ToggleGroup>
  );
}

const styles = stylex.create({
  root: {
    display: "flex",
    padding: 2,
    gap: 2,
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: color.border,
    borderRadius: 8,
  },
  // Segments split the strip's width evenly when it's stretched.
  segment: {
    flexGrow: 1,
    flexBasis: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minBlockSize: 24,
    minInlineSize: 32,
    paddingInline: 8,
    margin: 0,
    font: "inherit",
    fontSize: 13,
    fontWeight: 600,
    borderWidth: 0,
    borderRadius: 5,
    backgroundColor: {
      default: "transparent",
      "@media (hover: hover) and (pointer: fine)": {
        default: "transparent",
        ":hover": color.componentHover,
      },
      ":active": color.componentActive,
    },
    color: color.text,
    cursor: "pointer",
    outlineStyle: "solid",
    outlineColor: color.focusRing,
    outlineWidth: {
      default: 0,
      ":focus-visible": 2,
    },
    outlineOffset: 2,
  },
  pressed: {
    backgroundColor: color.text,
    color: color.bg,
  },
});
