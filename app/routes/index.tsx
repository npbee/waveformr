import * as stylex from "@stylexjs/stylex";
import { createFileRoute } from "@tanstack/react-router";
import { LogoLink } from "~/components/logo";
import { getLinks, getSeo } from "~/seo";
import { color, font, radius, space, text } from "~/styles/tokens.stylex";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: getSeo({
      title: "Waveformr",
      description:
        "Waveformr reads an audio file and draws its waveform, in whatever style and color you like.",
      pathname: "/",
    }),
    links: getLinks({ pathname: "/" }),
  }),
  component: IndexRoute,
});

function IndexRoute() {
  return (
    <div {...stylex.props(styles.page)}>
      <header {...stylex.props(styles.header)}>
        <LogoLink />
      </header>
      <main {...stylex.props(styles.main)}>
        <p {...stylex.props(styles.intro)}>
          <span {...stylex.props(styles.highlight)}>Waveformr</span> reads an
          audio file and draws its waveform as an SVG. It allows for custom
          colors and gradients. Copy the SVG code directly or use a link just
          like an image. By{" "}
          <a href="https://github.com/npbee" {...stylex.props(styles.link)}>
            Nick Ball
          </a>
          .
        </p>
        {/* Placeholder for the mini editor */}
        <div {...stylex.props(styles.editorSlot)} />
      </main>
    </div>
  );
}

const styles = stylex.create({
  page: {
    minBlockSize: "100svh",
    display: "flex",
    flexDirection: "column",
    maxInlineSize: 1240,
    marginInline: "auto",
    paddingInline: space.gutter,
  },
  header: {
    paddingBlock: space.block,
  },
  main: {
    flex: 1,
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: space.section,
    paddingBlock: space.block,
  },
  intro: {
    flex: "1 1 360px",
    margin: 0,
    fontFamily: font.display,
    fontSize: text.lead,
    lineHeight: 1.25,
  },
  highlight: {
    color: color.accentText,
  },
  link: {
    color: {
      default: "inherit",
      "@media (hover: hover) and (pointer: fine)": {
        default: "inherit",
        ":hover": color.accentText,
      },
      ":active": color.accent,
    },
    textDecorationLine: "underline",
    textDecorationThickness: "0.06em",
    textUnderlineOffset: "0.15em",
  },
  editorSlot: {
    flex: "1.35 1 480px",
    minBlockSize: 420,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: color.border,
    borderRadius: radius.lg,
  },
});
