import {
  type LinearPathOptions,
  linearPath,
  WaveformData,
} from "@waveformr/core";
import { useEffect, useMemo, useRef } from "react";
import { useEvents } from "./state";

export type SvgWaveformProps = LinearPathOptions & {
  waveformData: WaveformData;
  fill?: string;
  stroke?: string;
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
    [waveformData, samples]
  );

  let path = linearPath(normalizedData, {
    ...rest,
    width,
    height,
  });

  useObserveHTMLString(ref);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" ref={ref}>
      <path
        d={path}
        fill={fill}
        stroke={stroke}
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
