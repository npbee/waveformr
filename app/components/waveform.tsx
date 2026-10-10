import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { useEffect, useId, useState } from "react";
import { linearPath, type LinearPathConfig } from "~/waveform/svg_path";
import { WaveformData } from "~/waveform/waveform_data";

// Drawing space for the path; the SVG stretches it to fit its box.
const config: LinearPathConfig = {
  type: "bars",
  width: 800,
  height: 100,
  strokeWidth: 3,
  strokeLinecap: "round",
};
const samples = 100;

/**
 * Draws a waveform from audiowaveform `.dat` peaks with the same paths the
 * server renders, so it can restyle without a round trip.
 */
export function Waveform(props: {
  src: string;
  /** 0–1; the part after it is dimmed. */
  progress: number;
  label: string;
  xstyle?: StyleXStyles;
}) {
  let path = useWaveformPath(props.src);
  let clipId = useId();
  let played = config.width * Math.min(Math.max(props.progress, 0), 1);

  return (
    <svg
      role="img"
      aria-label={props.label}
      viewBox={`0 0 ${config.width} ${config.height}`}
      preserveAspectRatio="none"
      {...stylex.props(styles.root, props.xstyle)}
    >
      {path ? (
        <>
          <clipPath id={clipId}>
            <rect width={played} height={config.height} />
          </clipPath>
          <path d={path} {...pathProps} {...stylex.props(styles.unplayed)} />
          <path d={path} {...pathProps} clipPath={`url(#${clipId})`} />
        </>
      ) : null}
    </svg>
  );
}

const pathProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: config.strokeWidth,
  strokeLinecap: config.strokeLinecap,
  // Keeps bar widths fixed while the viewBox stretches to the box.
  vectorEffect: "non-scaling-stroke",
} as const;

function useWaveformPath(src: string) {
  let [path, setPath] = useState<string | null>(null);

  useEffect(() => {
    let controller = new AbortController();
    setPath(null);
    fetch(src, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load ${src}: ${res.status}`);
        return res.arrayBuffer();
      })
      .then((buffer) => {
        let data = WaveformData.create(buffer).getNormalizedData(samples);
        setPath(linearPath(data, config));
      })
      .catch((err) => {
        if (!controller.signal.aborted) console.error(err);
      });
    return () => controller.abort();
  }, [src]);

  return path;
}

const styles = stylex.create({
  root: {
    display: "block",
    inlineSize: "100%",
    blockSize: 170,
  },
  unplayed: {
    opacity: 0.32,
  },
});
