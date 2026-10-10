import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { Card } from "~/components/ui/card";
import { color } from "~/styles/tokens.stylex";

/** The home page's small, playable taste of the full editor. */
export function MiniEditor(props: { xstyle?: StyleXStyles }) {
  return <Card role="region" aria-label="Try it" xstyle={[styles.root, props.xstyle]} />;
}

const styles = stylex.create({
  root: {
    minBlockSize: 420,
    // Hard offset, like a misregistered print layer.
    boxShadow: `10px 10px 0 ${color.accent}`,
  },
});
