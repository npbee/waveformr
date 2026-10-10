import * as stylex from "@stylexjs/stylex";
import { color } from "~/styles/tokens.stylex";

// Liner-note filler, faded around the real copy.
const text = {
  before:
    "Recorded live to two-inch tape over one wet April weekend, mostly after midnight. Drop the needle on side one and you can hear the room breathing between takes, the hum of an old amp, a chair creak before the downbeat.",
  after:
    "Mixed in mono first, then again in stereo when nobody was satisfied. Cut at 33⅓ and pressed on heavy black vinyl. Play it loud, flip it over, and let the runout groove spin a little longer than you need to before the",
};

/**
 * Faded text around the real copy, as if it's one paragraph from a longer
 * page. Hidden from assistive tech and not selectable, so it never copies.
 */
export function FauxWords(props: { part: "before" | "after" }) {
  return (
    <span aria-hidden="true" {...stylex.props(styles.root)}>
      {props.part === "after" ? " " : null}
      {text[props.part]}
    </span>
  );
}

const styles = stylex.create({
  root: {
    color: `color-mix(in oklch, ${color.text} 30%, transparent)`,
    userSelect: "none",
  },
});
