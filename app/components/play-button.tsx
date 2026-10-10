import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { Button } from "~/components/ui/button";
import type { AudioStatus } from "~/components/use-audio-player";

export function PlayButton(props: {
  status: AudioStatus;
  onClick: () => void;
  xstyle?: StyleXStyles;
}) {
  // Loading counts as playing: the click already asked for playback.
  let playing = props.status === "playing" || props.status === "loading";
  return (
    <Button
      aria-label={playing ? "Pause" : "Play"}
      onClick={props.onClick}
      xstyle={[styles.root, props.xstyle]}
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
    </Button>
  );
}

const styles = stylex.create({
  root: {
    flexShrink: 0,
    inlineSize: 48,
    blockSize: 48,
    padding: 0,
    borderRadius: "50%",
  },
});
