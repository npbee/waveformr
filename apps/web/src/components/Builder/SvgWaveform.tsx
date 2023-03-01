import { type LinearPathOptions, linearPath } from "@waveformr/core";
import { useEffect, useRef } from "react";

export type SvgWaveformProps = LinearPathOptions & {
  data: Array<number>;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeLinecap?: "butt" | "round" | "square";
  onHtmlStringChange: (htmlString: string) => void;
};

export function SvgWavform(props: SvgWaveformProps) {
  let ref = useRef<SVGSVGElement>(null);
  let {
    fill,
    stroke,
    strokeWidth = 2,
    strokeLinecap = "round",
    data,
    width,
    height,
    onHtmlStringChange,
    ...rest
  } = props;

  let path = linearPath(data, {
    ...rest,
    width,
    height,
  });

  useObserveHTMLString(ref, onHtmlStringChange);

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

function useObserveHTMLString(
  ref: React.RefObject<SVGElement>,
  cb: (htmlString: string) => void
) {
  useEffect(() => {
    let el = ref.current;
    if (!el) return;

    // Set initially
    cb(el.outerHTML);

    let observer = new MutationObserver(() => {
      if (el) {
        cb(el.outerHTML);
      }
    });

    observer.observe(el, {
      subtree: true,
      attributes: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [cb]);
}
