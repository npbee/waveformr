import {
  linearPath,
  type LinearPathOptions,
  WaveformData,
} from "@waveformr/core";
import { useEffect, useId, useMemo, useRef } from "react";
import { Color, getColor } from "./ColorPicker";
import { useEvents } from "./state";

export type SvgWaveformProps = LinearPathOptions & {
  waveformData: WaveformData;
  fill: string;
  stroke: string;
  strokeWidth?: number;
  strokeLinecap?: "butt" | "round" | "square";
  samples: number;
};

export function SvgWavform(props: SvgWaveformProps) {
  let ref = useRef<SVGSVGElement>(null);
  let {
    fill,
    stroke,
    strokeWidth = 2,
    strokeLinecap = "round",
    waveformData,
    width,
    height,
    samples,
    ...rest
  } = props;

  let normalizedData = useMemo(
    () => waveformData.getNormalizedData(samples),
    [waveformData, samples],
  );

  let path = linearPath(normalizedData, {
    ...rest,
    width,
    height,
  });

  useObserveHTMLString(ref);

  let fillId = useId();
  let strokeId = useId();

  let fillColor = getColor(fill);
  let fillDef =
    fillColor.type === "gradient" ? (
      <Gradient gradient={fillColor} id={fillId} />
    ) : null;
  let strokeColor = getColor(stroke);
  let strokeDef =
    strokeColor.type === "gradient" ? (
      <Gradient gradient={strokeColor} id={strokeId} />
    ) : null;

  let fillValue =
    fillColor.type === "hex"
      ? fillColor.value
      : fillColor.type === "none"
      ? "none"
      : `url(#${fillId})`;
  let strokeValue =
    strokeColor.type === "hex"
      ? strokeColor.value
      : strokeColor.type === "none"
      ? "none"
      : `url(#${strokeId})`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" ref={ref}>
      <defs>
        {fillDef}
        {strokeDef}
      </defs>
      <path
        d={path}
        fill={fillValue}
        stroke={strokeValue}
        strokeWidth={strokeWidth}
        strokeLinecap={strokeLinecap}
      />
    </svg>
  );
}

function useObserveHTMLString(ref: React.RefObject<SVGElement>) {
  let events = useEvents();
  useEffect(() => {
    let el = ref.current;
    if (!el) return;

    let timeout: number;

    // Set initially
    events.svgHtmlChanged(el.outerHTML);

    let observer = new MutationObserver(() => {
      if (el) {
        events.svgHtmlChanged(el.outerHTML);
      }
    });

    observer.observe(el, {
      subtree: true,
      attributes: true,
    });

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, []);
}

function Gradient(props: {
  gradient: Extract<Color, { type: "gradient" }>;
  id: string;
}) {
  const { gradient, id } = props;
  return (
    <linearGradient id={id} x1="0%" y1="50%" x2="100%" y2="50%">
      {gradient.values.map((colorStop) => (
        <stop
          offset={`${colorStop.offset}%`}
          style={{ stopColor: colorStop.color }}
          key={colorStop.offset}
        />
      ))}
    </linearGradient>
  );
}
