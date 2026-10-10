import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { PlayButton } from "~/components/play-button";
import { PlaybackTime } from "~/components/playback-time";
import { Scrubber } from "~/components/scrubber";
import { Card } from "~/components/ui/card";
import { useAudioPlayer } from "~/components/use-audio-player";
import { Waveform } from "~/components/waveform";
import { color, font } from "~/styles/tokens.stylex";

/** The home page's small, playable taste of the full editor. */
export function MiniEditor(props: { xstyle?: StyleXStyles }) {
  let player = useAudioPlayer("/Rest.mp3");
  return (
    <Card role="region" aria-label="Try it" xstyle={[styles.root, props.xstyle]}>
      <audio {...player.audioProps} />
      <div {...stylex.props(styles.track)}>
        <PlayButton status={player.status} onClick={player.toggle} />
        <span {...stylex.props(styles.title)}>Rest</span>
        <PlaybackTime currentTime={player.currentTime} duration={player.duration} />
      </div>
      <div {...stylex.props(styles.waveform)}>
        <Waveform src="/Rest.dat" progress={player.progress} label="Waveform of Rest" />
        <Scrubber
          currentTime={player.currentTime}
          duration={player.duration}
          onSeek={player.seek}
          started={player.status !== "idle"}
        />
      </div>
    </Card>
  );
}

const styles = stylex.create({
  root: {
    minBlockSize: 420,
    display: "flex",
    flexDirection: "column",
    gap: 20,
    padding: 24,
    // Hard offset, like a misregistered print layer.
    boxShadow: `10px 10px 0 ${color.accent}`,
  },
  track: {
    display: "flex",
    alignItems: "center",
    gap: 14,
  },
  waveform: {
    position: "relative",
  },
  title: {
    flex: 1,
    minInlineSize: 0,
    fontFamily: font.display,
    fontSize: 22,
    fontWeight: 500,
    lineHeight: 1.2,
  },
});
