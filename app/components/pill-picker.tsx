import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { Toggle, ToggleGroup } from "~/components/ui/toggle-group";
import { color } from "~/styles/tokens.stylex";

/** One of a few labeled options, shown as a row of pills. */
export function PillPicker<T extends string>(props: {
  options: readonly { value: T; label: string }[];
  value: T | null;
  onValueChange: (value: T) => void;
  "aria-label": string;
  xstyle?: StyleXStyles;
}) {
  return (
    <ToggleGroup
      aria-label={props["aria-label"]}
      value={props.value}
      onValueChange={props.onValueChange}
      xstyle={[styles.root, props.xstyle]}
    >
      {props.options.map((option) => (
        <Toggle
          key={option.value}
          value={option.value}
          xstyle={({ pressed }) => [styles.pill, pressed && styles.pressed]}
        >
          {option.label}
        </Toggle>
      ))}
    </ToggleGroup>
  );
}

const styles = stylex.create({
  root: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
  },
  pill: {
    minBlockSize: 44,
    paddingInline: 16,
    margin: 0,
    font: "inherit",
    fontSize: 15,
    fontWeight: 600,
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: color.border,
    borderRadius: 999,
    backgroundColor: "transparent",
    color: color.text,
    cursor: "pointer",
    outline: {
      default: "none",
      ":focus-visible": `2px solid ${color.focusRing}`,
    },
    outlineOffset: 2,
  },
  pressed: {
    backgroundColor: color.text,
    color: color.bg,
  },
});
