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
  { value: "red", label: "Red", colors: [colors.red9], hex: ["a34541"] },
  { value: "orange", label: "Orange", colors: [colors.orange9], hex: ["da834c"] },
  { value: "yellow", label: "Yellow", colors: [colors.yellow9], hex: ["f9e866"] },
  { value: "green", label: "Green", colors: [colors.green9], hex: ["43a468"] },
  { value: "teal", label: "Teal", colors: [colors.teal9], hex: ["428f91"] },
  { value: "blue", label: "Blue", colors: [colors.blue9], hex: ["3378af"] },
  { value: "plum", label: "Plum", colors: [colors.plum9], hex: ["4d3457"] },
  {
    value: "sunset",
    label: "Sunset",
    colors: [colors.orange9, colors.plum9],
    hex: ["da834c", "4d3457"],
  },
  {
    value: "lagoon",
    label: "Lagoon",
    colors: [colors.green9, colors.blue9],
    hex: ["43a468", "3378af"],
  },
  // White stays white in dark mode: it's the color the SVG will render.
  { value: "white", label: "White", colors: ["oklch(1 0 none)"], hex: ["ffffff"] },
  { value: "none", label: "None", colors: [], hex: ["transparent"] },
] as const;

/** The brand inks: no white, none, or the Riso yellow, blue and green ones. */
export const spotInks = inks
  .map((ink) => ink.value)
  .filter((ink) => !["white", "none", "yellow", "blue", "green", "lagoon"].includes(ink));

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
  /**
   * `fill` swatches are rounded rectangles that grow to fill the cells of a
   * grid set through `xstyle`.
   */
  size?: "default" | "sm" | "fill";
  /** Which inks to offer; all of them by default. */
  options?: readonly Ink[];
  xstyle?: StyleXStyles;
}) {
  let small = props.size === "sm";
  let fill = props.size === "fill";
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
            fill && styles.swatchFill,
            ink.value === "none" ? styles.none : styles.ink(ink.colors),
            pressed && (fill ? styles.pressedFill : small ? styles.pressedSm : styles.pressed),
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
  // The chip is its own hit area: it's already big enough.
  swatchFill: {
    inlineSize: "100%",
    blockSize: 32,
    margin: 0,
    // Matches the SegmentedControl's strip, which is the same height.
    borderRadius: 8,
    outlineOffset: 4,
    "::after": {
      content: "none",
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
  // Drawn inside the chip, since neighbors sit too close for an outer ring.
  pressedFill: {
    boxShadow: `inset 0 0 0 2px ${color.text}, inset 0 0 0 4px ${color.surface}`,
  },
});
