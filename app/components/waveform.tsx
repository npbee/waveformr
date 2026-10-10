import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";

/**
 * Shows a `/render` SVG, so the preview is exactly what users download. The
 * part after `progress` is dimmed by layering a clipped full-strength copy
 * over a faded one.
 */
export function Waveform(props: {
  /** A `/render` URL; null while it can't be built yet. */
  src: string | null;
  /** Width / height of the rendered SVG, reserved before it loads. */
  aspectRatio: number;
  /** 0–1. */
  progress: number;
  label: string;
  xstyle?: StyleXStyles;
}) {
  let played = Math.min(Math.max(props.progress, 0), 1);
  return (
    <div
      role="img"
      aria-label={props.label}
      {...stylex.props(styles.root(props.aspectRatio), props.xstyle)}
    >
      {props.src ? (
        <>
          <img src={props.src} alt="" {...stylex.props(styles.image, styles.unplayed)} />
          <img src={props.src} alt="" {...stylex.props(styles.image, styles.played(played))} />
        </>
      ) : null}
    </div>
  );
}

const styles = stylex.create({
  root: (aspectRatio: number) => ({
    position: "relative",
    aspectRatio,
  }),
  image: {
    position: "absolute",
    inset: 0,
    inlineSize: "100%",
    blockSize: "100%",
  },
  unplayed: {
    opacity: 0.32,
  },
  played: (played: number) => ({
    clipPath: `inset(0 ${(1 - played) * 100}% 0 0)`,
  }),
});
