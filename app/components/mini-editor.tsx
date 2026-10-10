import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { PlayButton } from "~/components/play-button";
import { PlaybackTime } from "~/components/playback-time";
import { Card } from "~/components/ui/card";
import { useAudioPlayer } from "~/components/use-audio-player";
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
    </Card>
  );
}

const styles = stylex.create({
  root: {
    minBlockSize: 420,
    padding: 24,
    // Hard offset, like a misregistered print layer.
    boxShadow: `10px 10px 0 ${color.accent}`,
  },
  track: {
    display: "flex",
    alignItems: "center",
    gap: 14,
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
