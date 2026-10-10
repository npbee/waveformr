import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { color } from "~/styles/tokens.stylex";

export function LogoLink(props: { xstyle?: StyleXStyles }) {
  return (
    <a
      href="/"
      aria-label="Navigate home"
      {...stylex.props(styles.link, props.xstyle)}
    >
      <svg viewBox="0 0 413.31 57.26" width="100%">
        <use xlinkHref="#wordmark"></use>
      </svg>
    </a>
  );
}

const styles = stylex.create({
  link: {
    display: "flex",
    alignItems: "center",
    inlineSize: "8rem",
    color: {
      default: color.text,
      "@media (hover: hover) and (pointer: fine)": {
        default: color.text,
        ":hover": color.accentText,
      },
      ":active": color.accent,
    },
  },
});
