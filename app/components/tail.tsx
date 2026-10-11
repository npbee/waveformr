import * as stylex from "@stylexjs/stylex";
import { color } from "~/styles/tokens.stylex";

export const tailSize = { width: 40, height: 48 };

const { width: w, height: h } = tailSize;
const stroke = 2;
// S-curve from the tab's top edge down to the panel's top edge. Both ends are
// flat so the curve flows into the straight borders on either side. The ends
// sit half a stroke in so the stroke lines up with the 2px CSS borders.
const curve = `M0 ${stroke / 2} C${w / 2} ${stroke / 2} ${w / 2} ${h - stroke / 2} ${w} ${h - stroke / 2}`;

/**
 * A curved side of a tab that rises out of a panel's top edge. Kept separate
 * from the tab body so the body can grow without stretching the curve.
 */
export function Tail(props: { side: "start" | "end" }) {
  return (
    <svg
      aria-hidden
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      {...stylex.props(styles.root, props.side === "start" && styles.start)}
    >
      <path d={`${curve} L${w} ${h} L0 ${h} Z`} {...stylex.props(styles.fill)} />
      <path d={curve} {...stylex.props(styles.stroke)} />
    </svg>
  );
}

const styles = stylex.create({
  root: {
    display: "block",
    flexShrink: 0,
    overflow: "visible",
  },
  // Drawn for the end side; mirrored for the start.
  start: {
    transform: "scaleX(-1)",
  },
  fill: {
    fill: color.surface,
  },
  stroke: {
    fill: "none",
    stroke: color.border,
    strokeWidth: stroke,
  },
});
