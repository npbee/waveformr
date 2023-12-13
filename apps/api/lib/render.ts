import { WaveformData } from "$lib/waveform_data.ts";
import { defaultConfig, linearPath, LinearPathConfig } from "$lib/svg_path.ts";
import { parseColor } from "$lib/parse_color.ts";
import { html, HtmlEscapedString } from "../deps.ts";

interface SvgProps {
  path?: LinearPathConfig;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeLinecap?: "butt" | "round" | "square";
  samples?: number;
  waveformData: WaveformData;
}

export function svg(props: SvgProps) {
  let {
    strokeLinecap = "round",
    strokeWidth = 2,
    samples = 200,
    waveformData,
    path = defaultConfig,
  } = props;

  let normalizedData = waveformData.getNormalizedData(samples);
  let renderedPath = linearPath(normalizedData, path);

  let [fill, fillGradient] = useColor(props.fill ?? "#333333");
  let [stroke, strokeGradient] = useColor(props.stroke ?? "#333333");

  let defs: HtmlEscapedString | null = fillGradient || strokeGradient
    ? html`<defs>${fillGradient}${strokeGradient}</defs>`
    : null;

  return html`<svg
    viewBox="0 0 ${path.width} ${path.height}"
    width="100%"
    xmlns="http://www.w3.org/2000/svg"
  >
    ${defs}
    <path
      d="${renderedPath}"
      fill="${fill}"
      stroke="${stroke}"
      stroke-width="${strokeWidth}"
      stroke-linecap="${strokeLinecap}"
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
): HtmlEscapedString {
  let stops = colorStops.map(
    (stop) =>
      html`<stop
        offset="${stop.stop}"
        style="stop-color: ${stop.color}"
      ></stop>`,
  );

  return html`<linearGradient id="${id}">${stops}</linearGradient>`;
}

function useColor(colorString: string): [string, HtmlEscapedString | null] {
  let parsed = parseColor(colorString);
  if (parsed.type === "literal") {
    return [parsed.color, null];
  } else if (parsed.type === "linear-gradient") {
    let id = gradientId();
    let color = `url(#${id})`;
    let def = Gradient(id, parsed.colorStops);
    return [color, def];
  }

  throw new Error("Error trying to use color value");
}
