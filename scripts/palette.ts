// Generates Radix-style 12-step color scales (light + dark) in OKLCH and writes
// them as StyleX vars. Run with `pnpm palette` after changing the settings below.
//
// Each scale follows the same lightness/chroma curves, so a step's job is the
// same across colors:
//   1–2 backgrounds, 3–5 component bg (rest/hover/pressed),
//   6–8 borders (subtle/default/focus), 9–10 solid fill + hover,
//   11–12 low/high-contrast text.
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

// Brand colors anchor step 9. Chroma < 1 mutes the whole scale (the "riso" look).
const ACCENTS = {
  orange: { hex: "#E97927", chroma: 0.78 },
  red: { hex: "#AF3736", chroma: 0.8 },
  plum: { hex: "#4F315B", chroma: 0.85 },
  teal: { hex: "#0a9396", chroma: 0.75 },
};

// Olive-khaki paper; `creamy` boosts tint on the two lightest steps.
const NEUTRAL = { name: "khaki", hue: 100, chroma: 0.025, creamy: 1.4 };

const OUT = fileURLToPath(new URL("../app/styles/colors.stylex.ts", import.meta.url));

type Lch = { L: number; C: number; H: number };
type Rgb = [number, number, number];

const LIGHT_L = [0.99, 0.975, 0.95, 0.925, 0.895, 0.86, 0.81, 0.74];
const DARK_L = [0.18, 0.205, 0.25, 0.285, 0.32, 0.36, 0.42, 0.5];
// Share of the anchor's chroma per step: tinted backgrounds, full-strength
// solids, and text that stays rich without vibrating.
const LIGHT_CF = [0.05, 0.11, 0.22, 0.33, 0.43, 0.52, 0.6, 0.72, 1, 1, 0.85, 0.42];
const DARK_CF = [0.1, 0.13, 0.26, 0.35, 0.42, 0.48, 0.55, 0.68, 1, 1, 0.72, 0.3];
// Dark solids need enough lightness to read against a ~0.18 background.
const MIN_DARK_SOLID_L = 0.58;

const toLinear = (x: number) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4);
const fromLinear = (x: number) => (x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055);

function hexToLinear(hex: string): Rgb {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => toLinear(v / 255)) as Rgb;
}

function hexToOklch(hex: string): Lch {
  const [r, g, b] = hexToLinear(hex);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return { L, C: Math.hypot(A, B), H: ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360 };
}

function oklchToLinear({ L, C, H }: Lch): Rgb {
  const a = C * Math.cos((H * Math.PI) / 180);
  const b = C * Math.sin((H * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

const inGamut = (c: Lch) => oklchToLinear(c).every((v) => v >= 0 && v <= 1);

// Lowers chroma until the color fits sRGB, so it renders the same on every display.
function clampToSrgb(c: Lch): Lch {
  if (inGamut(c)) return c;
  let lo = 0;
  let hi = c.C;
  for (let i = 0; i < 30; i++) {
    const mid = (lo + hi) / 2;
    if (inGamut({ ...c, C: mid })) lo = mid;
    else hi = mid;
  }
  return { ...c, C: lo };
}

// Chroma is floored so rounding can't push a clamped color back out of gamut.
function format(c: Lch): string {
  const { L, C, H } = clampToSrgb(c);
  const chroma = Math.floor(C * 1e4) / 1e4;
  return `oklch(${L.toFixed(3)} ${chroma.toFixed(4)} ${H.toFixed(1)})`;
}

function relativeLuminance(c: Lch): number {
  const [r, g, b] = oklchToLinear(clampToSrgb(c)).map((v) => Math.min(1, Math.max(0, v)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: Lch, b: Lch): number {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

type Scale = { light: Lch[]; dark: Lch[] };

function accentScale(hex: string, chroma: number): Scale {
  const anchor = hexToOklch(hex);
  const C = anchor.C * chroma;
  const darkSolidL = Math.max(anchor.L, MIN_DARK_SOLID_L);
  const lightL = [...LIGHT_L, anchor.L, anchor.L - 0.04, 0.52, 0.3];
  const darkL = [...DARK_L, darkSolidL, darkSolidL + 0.04, 0.8, 0.93];
  return {
    light: lightL.map((L, i) => ({ L, C: C * LIGHT_CF[i], H: anchor.H })),
    dark: darkL.map((L, i) => ({ L, C: C * DARK_CF[i], H: anchor.H })),
  };
}

function neutralScale({ hue, chroma, creamy }: typeof NEUTRAL): Scale {
  const lightCF = [
    0.55 * creamy,
    0.6 * creamy,
    0.55,
    0.6,
    0.65,
    0.7,
    0.75,
    0.8,
    0.75,
    0.75,
    0.7,
    0.6,
  ];
  const darkCF = [0.7, 0.7, 0.7, 0.72, 0.74, 0.76, 0.78, 0.8, 0.7, 0.7, 0.45, 0.3];
  const lightL = [...LIGHT_L, 0.6, 0.56, 0.47, 0.24];
  const darkL = [0.165, 0.195, 0.235, 0.265, 0.295, 0.33, 0.39, 0.47, 0.54, 0.6, 0.79, 0.95];
  return {
    light: lightL.map((L, i) => ({ L, C: chroma * lightCF[i], H: hue })),
    dark: darkL.map((L, i) => ({ L, C: chroma * darkCF[i], H: hue })),
  };
}

const neutral = neutralScale(NEUTRAL);
const WHITE: Lch = { L: 1, C: 0, H: 0 };
const INK = neutral.light[11];

const scales: [string, Scale][] = [
  [NEUTRAL.name, neutral],
  ...Object.entries(ACCENTS).map(([name, a]): [string, Scale] => [
    name,
    accentScale(a.hex, a.chroma),
  ]),
];

// light-dark() resolves against the nearest `color-scheme`, so a subtree can
// force either mode without a separate theme.
function entry(key: string, light: Lch, dark: Lch): string {
  const [l, d] = [format(light), format(dark)];
  return `  ${key}: "${l === d ? l : `light-dark(${l}, ${d})`}",`;
}

const lines: string[] = [];
for (const [name, scale] of scales) {
  scale.light.forEach((light, i) => lines.push(entry(`${name}${i + 1}`, light, scale.dark[i])));
  if (name === NEUTRAL.name) continue;
  // Text color for step 9 fills: white or dark ink, whichever contrasts more.
  const onSolid = (solid: Lch) => (contrast(solid, WHITE) >= contrast(solid, INK) ? WHITE : INK);
  lines.push(entry(`${name}Contrast`, onSolid(scale.light[8]), onSolid(scale.dark[8])));
}

const source = `// Generated by scripts/palette.ts — edit the settings there and run \`pnpm palette\`.
import * as stylex from "@stylexjs/stylex";

export const colors = stylex.defineVars({
${lines.join("\n")}
});
`;

writeFileSync(OUT, source);
console.log(`Wrote ${OUT}`);
