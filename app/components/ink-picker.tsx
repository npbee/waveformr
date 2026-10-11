import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { Toggle, ToggleGroup } from "~/components/ui/toggle-group";
import { colors } from "~/styles/colors.stylex";
import { color } from "~/styles/tokens.stylex";

// Riso-style spot colors, straight from the palette scales. A gradient ink
// blends its colors top to bottom. `hex` holds the light-mode values for
// rendered SVGs, which have no theme and can't read CSS variables.
export const inks = [
  { value: "ink", label: "Ink", colors: [colors.khaki12], hex: ["212017"] },
  { value: "orange", label: "Orange", colors: [colors.orange9], hex: ["da834c"] },
  { value: "red", label: "Red", colors: [colors.red9], hex: ["a34541"] },
  { value: "plum", label: "Plum", colors: [colors.plum9], hex: ["4d3457"] },
  { value: "teal", label: "Teal", colors: [colors.teal9], hex: ["428f91"] },
  {
    value: "sunset",
    label: "Sunset",
    colors: [colors.orange9, colors.plum9],
    hex: ["da834c", "4d3457"],
  },
  // White stays white in dark mode: it's the color the SVG will render.
  { value: "white", label: "White", colors: ["oklch(1 0 none)"], hex: ["ffffff"] },
  { value: "none", label: "None", colors: [], hex: ["transparent"] },
] as const;

/** The colored inks, without white and none. */
export const spotInks = inks
  .map((ink) => ink.value)
  .filter((ink) => ink !== "white" && ink !== "none");

export type Ink = (typeof inks)[number]["value"];

export function getInk(ink: Ink) {
  return inks.find((i) => i.value === ink)!;
}

/** The ink as a /render color param. */
export function inkParam(ink: Ink) {
  let { hex } = getInk(ink);
  return hex.length > 1 ? `linear-gradient(${hex.join(", ")})` : hex[0];
}

/** The ink a /render color param was made from, if any. */
export function inkFromParam(param: string): Ink | null {
  return inks.find((ink) => inkParam(ink.value) === param)?.value ?? null;
}

export function InkPicker(props: {
  value: Ink | null;
  onValueChange: (value: Ink) => void;
  "aria-label"?: string;
  /** For a visible label; takes the place of `aria-label`. */
  "aria-labelledby"?: string;
  disabled?: boolean;
  size?: "default" | "sm";
  /** Which inks to offer; all of them by default. */
  options?: readonly Ink[];
  xstyle?: StyleXStyles;
}) {
  let small = props.size === "sm";
  let options = props.options ? inks.filter((ink) => props.options!.includes(ink.value)) : inks;
  return (
    <ToggleGroup
      aria-label={props["aria-labelledby"] ? undefined : (props["aria-label"] ?? "Ink")}
      aria-labelledby={props["aria-labelledby"]}
      value={props.value}
      onValueChange={props.onValueChange}
      disabled={props.disabled}
      xstyle={[styles.root, props.xstyle]}
    >
      {options.map((ink) => (
        <Toggle
          key={ink.value}
          value={ink.value}
          aria-label={`${ink.label} ink`}
          xstyle={({ pressed }) => [
            styles.swatch,
            small && styles.swatchSm,
            ink.value === "none" ? styles.none : styles.ink(ink.colors),
            pressed && (small ? styles.pressedSm : styles.pressed),
          ]}
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
    cursor: {
      default: "pointer",
      ":disabled": "not-allowed",
    },
    opacity: {
      default: 1,
      ":disabled": 0.4,
    },
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
  // An 18px dot with a 28px hit area, for dense toolbars.
  swatchSm: {
    inlineSize: 18,
    blockSize: 18,
    margin: 5,
    outlineOffset: 4,
    "::after": {
      content: "''",
      position: "absolute",
      inset: -5,
    },
  },
  ink: (colors: readonly string[]) => ({
    backgroundImage: `linear-gradient(${colors.length > 1 ? colors.join(", ") : `${colors[0]}, ${colors[0]}`})`,
  }),
  // A diagonal slash, the usual sign for "no color".
  none: {
    backgroundImage: `linear-gradient(to top right, transparent calc(50% - 1px), ${color.dangerText} calc(50% - 1px), ${color.dangerText} calc(50% + 1px), transparent calc(50% + 1px))`,
  },
  // A ring with a gap, so dark inks still read as selected.
  pressed: {
    boxShadow: `0 0 0 3px ${color.surface}, 0 0 0 5px ${color.text}`,
  },
  pressedSm: {
    boxShadow: `0 0 0 2px ${color.surface}, 0 0 0 4px ${color.text}`,
  },
});
