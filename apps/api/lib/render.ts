import { WaveformData } from "$lib/waveform_data.ts";
import { linearPath } from "$lib/svg_path.ts";
import { parseColor } from "$lib/parse_color.ts";
import type { RenderParams } from "$lib/schemas.ts";

interface SvgProps {
  params: RenderParams;
  fill?: string;
  stroke?: string;
  samples?: number;
  waveformData: WaveformData;
}

export function svg(props: SvgProps) {
  let { samples = 200, waveformData, params } = props;

  let normalizedData = waveformData.getNormalizedData(samples);
  let renderedPath = linearPath(normalizedData, params);

  let [fill, fillGradient] = useColor(props.fill ?? "#333333");
  let [stroke, strokeGradient] = useColor(props.stroke ?? "#333333");

  let defs = fillGradient || strokeGradient
    ? `<defs>${fillGradient}${strokeGradient}</defs>`
    : "";

  return `<svg
    viewBox="0 0 ${params.width} ${params.height}"
    width="100%"
    xmlns="http://www.w3.org/2000/svg"
  >
    ${defs}
    <path
      d="${renderedPath}"
      fill="${fill}"
      stroke="${stroke}"
      stroke-width="${params.strokeWidth}"
      stroke-linecap="${params.strokeLinecap}"
    />
  </svg>`;
}

let prefix = "waveformr-gradient-";
let cnt = 0;

function gradientId() {
  return prefix + ++cnt;
}

function Gradient(
  id: string,
  colorStops: Array<{ color: string; stop: string }>,
) {
  let stops = colorStops
    .map((stop) =>
      `<stop offset="${stop.stop}" style="stop-color: ${stop.color}" ></stop>`
    ).join("");

  return `<linearGradient id="${id}" x1="0" x2="0" y1="50%" y2="100%"
    >${stops}</linearGradient>`;
}

function useColor(colorString: string): [string, string] {
  let parsed = parseColor(colorString);
  if (parsed.type === "literal") {
    return [parsed.color, ""];
  } else if (parsed.type === "linear-gradient") {
    let id = gradientId();
    let color = `url(#${id})`;
    let def = Gradient(id, parsed.colorStops);
    return [color, def];
  }

  throw new Error("Error trying to use color value");
}
