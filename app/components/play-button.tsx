import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { AudioStatus } from "~/components/use-audio-player";
import { color } from "~/styles/tokens.stylex";

export function PlayButton(props: {
  status: AudioStatus;
  onClick: () => void;
  xstyle?: StyleXStyles;
}) {
  // Loading counts as playing: the click already asked for playback.
  let playing = props.status === "playing" || props.status === "loading";
  return (
    <button
      type="button"
      aria-label={playing ? "Pause" : "Play"}
      onClick={props.onClick}
      {...stylex.props(styles.root, props.xstyle)}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        {playing ? (
          <>
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </>
        ) : (
          <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z" />
        )}
      </svg>
    </button>
  );
}

const styles = stylex.create({
  root: {
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
    inlineSize: 48,
    blockSize: 48,
    padding: 0,
    borderWidth: 0,
    borderRadius: "50%",
    backgroundColor: color.text,
    color: color.bg,
    cursor: "pointer",
    // Riso press: the button sits up off an offset ink layer and stamps down
    // onto it when pressed.
    boxShadow: {
      default: `3px 3px 0 ${color.accent}`,
      ":active": `0 0 0 ${color.accent}`,
    },
    translate: {
      default: "0 0",
      ":active": "3px 3px",
    },
    transitionProperty: "translate, box-shadow",
    transitionDuration: {
      default: "120ms",
      ":active": "40ms",
      "@media (prefers-reduced-motion: reduce)": "0s",
    },
    transitionTimingFunction: "ease-out",
    outline: {
      default: "none",
      ":focus-visible": `2px solid ${color.focusRing}`,
    },
    outlineOffset: 2,
  },
});
