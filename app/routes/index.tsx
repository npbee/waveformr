import * as stylex from "@stylexjs/stylex";
import { createFileRoute } from "@tanstack/react-router";
import { LogoLink } from "~/components/logo";
import { getLinks, getSeo } from "~/seo";
import { color } from "~/styles/tokens.stylex";

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
    <div {...stylex.props(styles.backdrop)}>
      <div {...stylex.props(styles.page)}>
        <header {...stylex.props(styles.header)}>
          <LogoLink />
        </header>
        <main {...stylex.props(styles.main)}>
          <p {...stylex.props(styles.intro)}>
            <span {...stylex.props(styles.highlight)}>
              Waveformr reads an audio file and draws its waveform,
            </span>{" "}
            in whatever style and color you like. Save it as an SVG, or use the
            link anywhere an image can go. By{" "}
            <a href="https://github.com/npbee">Nick Ball</a>.
          </p>
          {/* Placeholder for the mini editor */}
          <div {...stylex.props(styles.editorSlot)} />
        </main>
      </div>
    </div>
  );
}

const styles = stylex.create({
  backdrop: {
    backgroundColor: color.bg,
    backgroundImage: "url(/paper-texture.svg)",
  },
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    maxWidth: 1240,
    marginInline: "auto",
    paddingInline: 24,
  },
  header: {
    paddingBlock: 28,
  },
  main: {
    flex: 1,
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 56,
    paddingBlock: 32,
  },
  intro: {
    flex: "1 1 360px",
    margin: 0,
    fontFamily: "Fraunces, Georgia, serif",
    fontSize: "clamp(22px, 2.2vw, 30px)",
    lineHeight: 1.25,
  },
  highlight: {
    color: color.accentText,
  },
  editorSlot: {
    flex: "1.35 1 480px",
    minHeight: 420,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: color.border,
    borderRadius: 18,
  },
});
