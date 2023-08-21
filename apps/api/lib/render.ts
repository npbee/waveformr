import { WaveformData } from "$lib/waveform_data.ts";
import { defaultConfig, linearPath, LinearPathConfig } from "$lib/svg_path.ts";
import { parseColor } from "$lib/parse_color.ts";

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
    fill,
    stroke,
    strokeLinecap = "round",
    strokeWidth = 2,
    samples = 200,
    waveformData,
    path = defaultConfig,
  } = props;

  let normalizedData = waveformData.getNormalizedData(samples);
  let renderedPath = linearPath(normalizedData, path);

  let parsedFill = fill ? parseColor(fill) : null;
  let parsedStroke = stroke ? parseColor(stroke) : null;

  let _fill = "#333333";
  let _stroke = "#333333";

  // TODO: yikes refactor this stuff...
  let defs = ``;

  if (parsedFill && parsedFill.type === "literal") {
    _fill = parsedFill.color;
  } else if (parsedFill && parsedFill.type === "linear-gradient") {
    let fillId = gradientId();
    _fill = `url(#${fillId})`;
    let def = gradientDef(fillId, parsedFill.colorStops);
    defs += def;
  }

  if (parsedStroke && parsedStroke.type === "literal") {
    _stroke = parsedStroke.color;
  } else if (parsedStroke && parsedStroke.type === "linear-gradient") {
    let id = gradientId();
    _stroke = `url(#${id})`;
    let def = gradientDef(id, parsedStroke.colorStops);
    defs += def;
  }

  if (defs) {
    defs = `<defs>${defs}</defs>`;
  }

  return `<svg viewBox="0 0 ${path.width} ${path.height}" width="100%" xmlns="http://www.w3.org/2000/svg">
      ${defs}
      <path
        d="${renderedPath}"
        fill="${_fill}"
        stroke="${_stroke}"
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

function gradientDef(
  id: string,
  colorStops: Array<{ color: string; stop: string }>,
) {
  let stops = colorStops.map((stop) =>
    `<stop offset="${stop.stop}" style="stop-color: ${stop.color}"></stop>`
  ).join("");

  return `<linearGradient id="${id}">${stops}</linearGradient>`;
}
