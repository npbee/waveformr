import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { useNavigate } from "@tanstack/react-router";
import { useState, useSyncExternalStore } from "react";
import { ExportActions } from "~/components/export-actions";
import { getInk, type Ink, InkPicker } from "~/components/ink-picker";
import { LoadForm } from "~/components/load-form";
import { PlayButton } from "~/components/play-button";
import { PlaybackTime } from "~/components/playback-time";
import { Scrubber } from "~/components/scrubber";
import { StylePicker, type WaveformStyle } from "~/components/style-picker";
import { Card } from "~/components/ui/card";
import { useAudioPlayer } from "~/components/use-audio-player";
import { Waveform } from "~/components/waveform";
import { color, font } from "~/styles/tokens.stylex";

const track = {
  title: "Rest",
  audio: "/Rest.mp3",
};

// Size of the rendered SVG; the preview keeps its aspect ratio.
const size = { width: 800, height: 200 };

/** The home page's small, playable taste of the full editor. */
export function MiniEditor(props: { xstyle?: StyleXStyles }) {
  let navigate = useNavigate();
  let player = useAudioPlayer(track.audio);
  let [waveformStyle, setWaveformStyle] = useState<WaveformStyle>("bars");
  let [ink, setInk] = useState<Ink>("ink");
  let origin = useOrigin();
  let stroke = strokeParam(getInk(ink).hex);
  let waveformUrl = origin
    ? renderUrl(origin, { url: new URL(track.audio, origin).href, type: waveformStyle, stroke })
    : null;
  return (
    <Card role="region" aria-label="Try it" xstyle={[styles.root, props.xstyle]}>
      <audio {...player.audioProps} />
      <div {...stylex.props(styles.track)}>
        <PlayButton status={player.status} onClick={player.toggle} />
        <span {...stylex.props(styles.title)}>{track.title}</span>
        <PlaybackTime currentTime={player.currentTime} duration={player.duration} />
      </div>
      <div {...stylex.props(styles.waveform)}>
        <Waveform
          src={waveformUrl}
          aspectRatio={size.width / size.height}
          progress={player.progress}
          label={`Waveform of ${track.title}`}
        />
        <Scrubber
          currentTime={player.currentTime}
          duration={player.duration}
          onSeek={player.seek}
          started={player.status !== "idle"}
        />
      </div>
      <div {...stylex.props(styles.pickers)}>
        <StylePicker value={waveformStyle} onValueChange={setWaveformStyle} />
        <InkPicker value={ink} onValueChange={setInk} />
      </div>
      <div {...stylex.props(styles.actions)}>
        <LoadForm
          onLoad={(url) => navigate({ to: "/edit", search: { url, type: waveformStyle, stroke } })}
        />
        <ExportActions
          renderUrl={waveformUrl}
          filename={`${track.title.toLowerCase()}.svg`}
        />
      </div>
    </Card>
  );
}

function renderUrl(origin: string, params: { url: string; type: WaveformStyle; stroke: string }) {
  let url = new URL("/render", origin);
  url.search = new URLSearchParams({
    ...params,
    fill: "none",
    width: String(size.width),
    height: String(size.height),
    samples: "100",
    "stroke-width": "3",
    "stroke-linecap": "round",
  }).toString();
  return url.href;
}

function strokeParam(hex: readonly string[]) {
  return hex.length > 1 ? `linear-gradient(${hex.join(", ")})` : hex[0];
}

// null on the server and during hydration, so both render the same markup.
function useOrigin() {
  return useSyncExternalStore(
    noopSubscribe,
    () => window.location.origin,
    () => null,
  );
}

function noopSubscribe() {
  return () => {};
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
  pickers: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px 20px",
  },
  actions: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    paddingBlockStart: 18,
    borderBlockStartWidth: 2,
    borderBlockStartStyle: "dashed",
    borderBlockStartColor: color.borderSubtle,
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
