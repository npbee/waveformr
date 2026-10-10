import * as stylex from "@stylexjs/stylex";
import { color } from "~/styles/tokens.stylex";

// Amplitudes from a stretch of a real track, so the fake paragraph is a
// waveform set as text: loud moments become long words.
const samples = [
  0.59, 0.53, 0.47, 0.45, 0.62, 0.42, 0.41, 0.34, 0.38, 0.36, 0.68, 0.51, 0.56, 0.45, 0.41, 0.49,
  0.62, 0.43, 0.35, 0.28, 0.29, 0.32, 0.73, 0.72, 0.58, 0.58, 0.54, 0.53, 0.56, 0.42, 0.41, 0.33,
  0.38, 0.47, 0.76, 0.68, 0.62, 0.53, 0.49, 0.44, 0.6, 0.42, 0.41, 0.33, 0.34, 0.44, 0.8, 0.74,
  0.63, 0.45, 0.5, 0.56, 0.48, 0.4, 0.39, 0.28, 0.32, 0.41, 0.79, 0.61, 0.5, 0.39, 0.42, 0.34, 0.6,
  0.41, 0.28, 0.54, 0.47, 0.45, 0.84, 0.76, 0.7, 0.56, 0.61, 0.73, 0.52, 0.51, 0.44, 0.38, 0.49,
  0.39, 0.72, 0.5, 0.36, 0.32, 0.48, 0.35, 0.62, 0.49, 0.46, 0.64, 0.64, 0.67, 0.9, 0.75, 0.52,
  0.41, 0.52, 0.59, 0.4, 0.45, 0.39, 0.3, 0.47, 0.51, 0.6, 0.41, 0.38, 0.32, 0.48, 0.47, 0.54, 0.43,
  0.52, 0.57, 0.52, 0.74, 0.68, 0.54,
];

const wordsPerPart = 36;

/**
 * Bars shaped like words, set inline so they wrap with the real copy around
 * them. Hidden from assistive tech; they're empty, so they never copy.
 */
export function FauxWords(props: { part: "before" | "after" }) {
  let words =
    props.part === "before" ? samples.slice(0, wordsPerPart) : samples.slice(-wordsPerPart);
  return words.map((amplitude, i) => (
    <span key={i} aria-hidden="true">
      {/* Real spaces between bars give the browser places to wrap. */}
      {i > 0 || props.part === "after" ? " " : null}
      <span {...stylex.props(styles.word(wordWidth(amplitude)))} />
    </span>
  ));
}

// 0.28–0.9 amplitude to roughly 1–8 letters at this size.
function wordWidth(amplitude: number) {
  let t = Math.min(Math.max((amplitude - 0.25) / 0.65, 0), 1);
  return `${(0.6 + t ** 1.3 * 4.2).toFixed(2)}em`;
}

const styles = stylex.create({
  word: (inlineSize: string) => ({
    display: "inline-block",
    inlineSize,
    // The font's own x-height, sitting on the baseline like lowercase letters.
    blockSize: "1ex",
    borderRadius: "0.1em",
    backgroundColor: `color-mix(in oklch, ${color.text} 19%, transparent)`,
  }),
});
