import * as stylex from "@stylexjs/stylex";
import { createFileRoute } from "@tanstack/react-router";
import { FauxWords } from "~/components/faux-words";
import { LogoLink } from "~/components/logo";
import { MiniEditor } from "~/components/mini-editor";
import { getLinks, getSeo } from "~/seo";
import { color, font, space, text } from "~/styles/tokens.stylex";

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
          {/* Prototype: the copy sits mid-paragraph in faded liner notes. */}
          <FauxWords part="before" /> <span {...stylex.props(styles.highlight)}>
            Waveformr
          </span>{" "}
          reads an audio file and draws its waveform as an SVG. It allows for custom colors and
          gradients. Copy the SVG code directly or use a link just like an image. By{" "}
          <a href="https://github.com/npbee" {...stylex.props(styles.link)}>
            Nick Ball
          </a>
          .
          <FauxWords part="after" />
        </p>
        <MiniEditor xstyle={styles.editor} />
      </main>
    </div>
  );
}

const styles = stylex.create({
  page: {
    display: "flex",
    flexDirection: "column",
    maxInlineSize: 1500,
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
  },
  intro: {
    flex: "1 1 300px",
    margin: 0,
    fontFamily: font.display,
    fontSize: text.lead,
    lineHeight: 1.25,
    // The fake text fades out, as if the paragraph runs on past the page.
    maskImage: "linear-gradient(transparent, black 3lh, black calc(100% - 3lh), transparent)",
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
  editor: {
    flex: "1.5 1 480px",
  },
});
