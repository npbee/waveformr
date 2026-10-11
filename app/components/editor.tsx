import { FadersHorizontalIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import { LogoLink } from "~/components/logo";
import { Sidebar } from "~/components/ui/sidebar";
import type { EditorConfig } from "~/routes/edit";
import { color } from "~/styles/tokens.stylex";

interface EditorProps {
  svg?: string | null;
  renderUrl?: string | null;
  config: EditorConfig;
  state: "idle" | "pending" | "error";
  title: string;
  svgSize: React.ReactNode;
  onChange: (patch: Partial<EditorConfig>) => void;
  onSlide: (patch: Partial<EditorConfig>) => void;
}

/** Canvas beside a collapsible sidebar of controls. */
export function Editor(props: EditorProps) {
  let { svg, state } = props;
  return (
    <Sidebar.Root xstyle={styles.root}>
      <main {...stylex.props(styles.stage)}>
        <div {...stylex.props(styles.artwork)}>
          {svg ? <div dangerouslySetInnerHTML={{ __html: svg }} /> : null}
          {state === "error" ? (
            <p {...stylex.props(styles.error)}>There was an error rendering this waveform.</p>
          ) : null}
        </div>
        <header {...stylex.props(styles.header)}>
          <LogoLink xstyle={styles.logo} />
          <Sidebar.Trigger icon={<FadersHorizontalIcon weight="bold" />} aria-label="Controls" />
        </header>
      </main>
      <Sidebar.Content aria-label="Controls" />
    </Sidebar.Root>
  );
}

const styles = stylex.create({
  root: {
    blockSize: "100dvh",
  },
  // Layers share one grid cell; later ones paint on top.
  stage: {
    minInlineSize: 0,
    display: "grid",
    padding: 12,
  },
  artwork: {
    gridArea: "1 / 1",
    placeSelf: "safe center",
    inlineSize: "100%",
  },
  // Its own row so the logo and trigger share a center line whatever their
  // heights.
  header: {
    gridArea: "1 / 1",
    alignSelf: "start",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  logo: {
    inlineSize: "5.5rem",
  },
  error: {
    color: color.dangerText,
  },
});
