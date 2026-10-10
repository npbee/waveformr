import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { useEffect, useId, useMemo, useState } from "react";
import { linearPath, type LinearPathConfig } from "~/waveform/svg_path";
import { WaveformData } from "~/waveform/waveform_data";

// Drawing space for the path; the SVG stretches it to fit its box.
const config = {
  width: 800,
  height: 100,
  strokeWidth: 3,
  strokeLinecap: "round",
} as const;
const samples = 100;

/**
 * Draws a waveform from audiowaveform `.dat` peaks with the same paths the
 * server renders, so it can restyle without a round trip.
 */
export function Waveform(props: {
  src: string;
  type: LinearPathConfig["type"];
  /** One color, or several for a top-to-bottom gradient. */
  colors: readonly string[];
  /** 0–1; the part after it is dimmed. */
  progress: number;
  label: string;
  xstyle?: StyleXStyles;
}) {
  let peaks = usePeaks(props.src);
  let path = useMemo(
    () => (peaks ? linearPath(peaks, { ...config, type: props.type }) : null),
    [peaks, props.type],
  );
  let clipId = useId();
  let gradientId = useId();
  let stroke = props.colors.length > 1 ? `url(#${gradientId})` : props.colors[0];
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
          {props.colors.length > 1 ? (
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              {props.colors.map((c, i) => (
                <stop
                  key={i}
                  offset={i / (props.colors.length - 1)}
                  // As a style, not an attribute, so CSS variables resolve.
                  style={{ stopColor: c }}
                />
              ))}
            </linearGradient>
          ) : null}
          <clipPath id={clipId}>
            <rect width={played} height={config.height} />
          </clipPath>
          <path d={path} {...pathProps} {...stylex.props(styles.stroke(stroke), styles.unplayed)} />
          <path
            d={path}
            {...pathProps}
            clipPath={`url(#${clipId})`}
            {...stylex.props(styles.stroke(stroke))}
          />
        </>
      ) : null}
    </svg>
  );
}

const pathProps = {
  fill: "none",
  strokeWidth: config.strokeWidth,
  strokeLinecap: config.strokeLinecap,
  // Keeps bar widths fixed while the viewBox stretches to the box.
  vectorEffect: "non-scaling-stroke",
} as const;

function usePeaks(src: string) {
  let [peaks, setPeaks] = useState<number[] | null>(null);

  useEffect(() => {
    let controller = new AbortController();
    setPeaks(null);
    fetch(src, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load ${src}: ${res.status}`);
        return res.arrayBuffer();
      })
      .then((buffer) => {
        setPeaks(WaveformData.create(buffer).getNormalizedData(samples));
      })
      .catch((err) => {
        if (!controller.signal.aborted) console.error(err);
      });
    return () => controller.abort();
  }, [src]);

  return peaks;
}

const styles = stylex.create({
  root: {
    display: "block",
    inlineSize: "100%",
    blockSize: 170,
  },
  // A style, not the stroke attribute, so CSS variables resolve.
  stroke: (stroke: string) => ({
    stroke,
  }),
  unplayed: {
    opacity: 0.32,
  },
});
