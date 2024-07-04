import { colord } from "colord";

interface LiteralColor {
  type: "literal";
  color: string;
}

interface LinearGradientColor {
  type: "linear-gradient";
  colorStops: Array<{
    color: string;
    stop: string;
  }>;
}

export type Color = LiteralColor | LinearGradientColor;

export function parseColor(color: string): Color {
  return parseLinearGradient(color) ?? parseLiteral(color);
}

function parseLinearGradient(color: string): LinearGradientColor | null {
  let contentRegex = /linear-gradient\((.*)\)/;
  let match = color.match(contentRegex)?.[1];
  if (!match) {
    return null;
  }
  let sections = match.split(",");
  let stops = sections.map((s) => s.trim())
    .map((s, idx) => {
      let [color, stop] = s.split(" ");

      if (!stop) {
        stop = idx === 0 ? "0%" : `${idx / (sections.length - 1) * 100}%`;
      }

      return {
        color: parseAsHex(color) ?? color,
        stop,
      };
    });

  return {
    type: "linear-gradient",
    colorStops: stops,
  };
}

function parseLiteral(color: string): LiteralColor {
  return {
    type: "literal",
    color: parseAsHex(color) ?? color,
  };
}

function parseAsHex(color: string) {
  let asHex = colord(`#${color}`);
  if (asHex.isValid()) {
    return asHex.toHex();
  }
  return null;
}
