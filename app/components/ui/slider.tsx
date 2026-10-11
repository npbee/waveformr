import { Slider as BaseSlider } from "@base-ui/react/slider";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { useLocalValue } from "~/components/use-local-value";
import { color } from "~/styles/tokens.stylex";

/**
 * Labeled single-value slider. Holds its own value so the thumb tracks the
 * pointer even when `onValueChange` is debounced upstream.
 */
export function Slider(props: {
  label: ReactNode;
  value: number;
  onValueChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  xstyle?: StyleXStyles;
}) {
  let [value, setValue] = useLocalValue(props.value);
  return (
    <BaseSlider.Root
      value={value}
      onValueChange={(next) => {
        setValue(next);
        props.onValueChange(next);
      }}
      min={props.min}
      max={props.max}
      step={props.step}
      {...stylex.props(styles.root, props.xstyle)}
    >
      <BaseSlider.Label {...stylex.props(styles.label)}>{props.label}</BaseSlider.Label>
      <BaseSlider.Control {...stylex.props(styles.control)}>
        <BaseSlider.Track {...stylex.props(styles.track)}>
          <BaseSlider.Indicator {...stylex.props(styles.indicator)} />
          <BaseSlider.Thumb {...stylex.props(styles.thumb)} />
        </BaseSlider.Track>
      </BaseSlider.Control>
      <BaseSlider.Value {...stylex.props(styles.value)} />
    </BaseSlider.Root>
  );
}

const styles = stylex.create({
  // Label, track and value in one row.
  // Grows to fill its row; the track takes the extra space.
  root: {
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: color.textMuted,
  },
  value: {
    minInlineSize: "3ch",
    fontSize: 13,
    fontVariantNumeric: "tabular-nums",
  },
  control: {
    display: "flex",
    alignItems: "center",
    flexGrow: 1,
    minInlineSize: 96,
    blockSize: 24,
    touchAction: "none",
    userSelect: "none",
  },
  track: {
    flexGrow: 1,
    blockSize: 4,
    borderRadius: 999,
    backgroundColor: color.borderSubtle,
  },
  indicator: {
    borderRadius: 999,
    backgroundColor: color.text,
  },
  thumb: {
    inlineSize: 14,
    blockSize: 14,
    borderRadius: "50%",
    backgroundColor: color.surface,
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: color.border,
    // Focus lands on the visually hidden range input inside the thumb.
    outlineStyle: "solid",
    outlineColor: color.focusRing,
    outlineWidth: {
      default: 0,
      ":has(:focus-visible)": 2,
    },
    outlineOffset: 2,
  },
});
