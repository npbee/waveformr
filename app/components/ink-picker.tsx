import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { Toggle, ToggleGroup } from "~/components/ui/toggle-group";
import { colors } from "~/styles/colors.stylex";
import { color } from "~/styles/tokens.stylex";

// Riso-style spot colors, straight from the palette scales. A gradient ink
// blends its colors top to bottom.
export const inks = [
  { value: "ink", label: "Ink", colors: [colors.khaki12] },
  { value: "orange", label: "Orange", colors: [colors.orange9] },
  { value: "red", label: "Red", colors: [colors.red9] },
  { value: "plum", label: "Plum", colors: [colors.plum9] },
  { value: "teal", label: "Teal", colors: [colors.teal9] },
  { value: "sunset", label: "Sunset", colors: [colors.orange9, colors.plum9] },
] as const;

export type Ink = (typeof inks)[number]["value"];

export function inkColors(ink: Ink): readonly string[] {
  return inks.find((i) => i.value === ink)!.colors;
}

export function InkPicker(props: {
  value: Ink;
  onValueChange: (value: Ink) => void;
  xstyle?: StyleXStyles;
}) {
  return (
    <ToggleGroup
      aria-label="Ink"
      value={props.value}
      onValueChange={props.onValueChange}
      xstyle={[styles.root, props.xstyle]}
    >
      {inks.map((ink) => (
        <Toggle
          key={ink.value}
          value={ink.value}
          aria-label={`${ink.label} ink`}
          xstyle={({ pressed }) => [styles.swatch, styles.ink(ink.colors), pressed && styles.pressed]}
        />
      ))}
    </ToggleGroup>
  );
}

const styles = stylex.create({
  root: {
    display: "flex",
    alignItems: "center",
  },
  // The button is the 24px dot; ::after stretches its hit area to 44px.
  swatch: {
    position: "relative",
    inlineSize: 24,
    blockSize: 24,
    padding: 0,
    margin: 10,
    borderWidth: 0,
    borderRadius: "50%",
    boxShadow: "inset 0 0 0 1px oklch(0 0 0 / 0.12)",
    cursor: "pointer",
    outline: {
      default: "none",
      ":focus-visible": `2px solid ${color.focusRing}`,
    },
    outlineOffset: 7,
    "::after": {
      content: "''",
      position: "absolute",
      inset: -10,
    },
  },
  ink: (colors: readonly string[]) => ({
    backgroundImage: `linear-gradient(${colors.length > 1 ? colors.join(", ") : `${colors[0]}, ${colors[0]}`})`,
  }),
  // A ring with a gap, so dark inks still read as selected.
  pressed: {
    boxShadow: `0 0 0 3px ${color.surface}, 0 0 0 5px ${color.text}`,
  },
});
