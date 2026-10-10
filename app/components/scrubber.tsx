import { Slider } from "@base-ui/react/slider";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { useState } from "react";
import { formatTime } from "~/components/playback-time";
import { color } from "~/styles/tokens.stylex";

/**
 * A seek control laid over the waveform: the playhead is a thin line, and a
 * fainter one follows the pointer to preview where a click lands.
 */
export function Scrubber(props: {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  /** Hides the playhead until playback has started. */
  started: boolean;
  xstyle?: StyleXStyles;
}) {
  let [hoverX, setHoverX] = useState<number | null>(null);
  let ready = props.duration > 0;

  return (
    <Slider.Root
      min={0}
      // Needs max > min; the control is disabled until then anyway.
      max={ready ? props.duration : 1}
      step={1}
      value={props.currentTime}
      onValueChange={(time) => props.onSeek(time)}
      disabled={!ready}
      {...stylex.props(styles.fill, props.xstyle)}
    >
      <Slider.Control
        onPointerMove={(evt) => {
          let box = evt.currentTarget.getBoundingClientRect();
          setHoverX(evt.clientX - box.left);
        }}
        onPointerLeave={() => setHoverX(null)}
        {...stylex.props(styles.fill, styles.control)}
      >
        <Slider.Track {...stylex.props(styles.track)}>
          {hoverX !== null && ready ? (
            <div aria-hidden="true" {...stylex.props(styles.line, styles.hover(hoverX))} />
          ) : null}
          <Slider.Thumb
            aria-label="Seek"
            aria-valuetext={`${formatTime(props.currentTime)} of ${formatTime(props.duration)}`}
            {...stylex.props(styles.line, styles.thumb, !props.started && styles.thumbIdle)}
          />
        </Slider.Track>
      </Slider.Control>
    </Slider.Root>
  );
}

const styles = stylex.create({
  // The whole waveform is the hit area.
  fill: {
    position: "absolute",
    inset: 0,
  },
  control: {
    cursor: "pointer",
    touchAction: "none",
  },
  // Base UI sets the track to position: relative inline.
  track: {
    blockSize: "100%",
  },
  line: {
    inlineSize: 2,
    blockSize: "100%",
    borderRadius: 1,
  },
  hover: (x: number) => ({
    position: "absolute",
    insetBlockStart: 0,
    insetInlineStart: 0,
    translate: `${x}px 0`,
    backgroundColor: color.text,
    opacity: 0.4,
    pointerEvents: "none",
  }),
  thumb: {
    backgroundColor: color.accent,
    // Base UI focuses the nested range input, not the thumb itself.
    outline: {
      default: "none",
      ":has(:focus-visible)": `2px solid ${color.focusRing}`,
    },
    outlineOffset: 2,
  },
  thumbIdle: {
    opacity: {
      default: 0,
      ":has(:focus-visible)": 1,
    },
  },
});
