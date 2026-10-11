import * as stylex from "@stylexjs/stylex";
import { LogoLink } from "~/components/logo";
import { Sidebar } from "~/components/ui/sidebar";
import type { EditorConfig } from "~/routes/edit";
import { color, space } from "~/styles/tokens.stylex";

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
        <LogoLink xstyle={styles.logo} />
        <Sidebar.Trigger xstyle={styles.toggle}>Controls</Sidebar.Trigger>
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
    padding: space.gutter,
  },
  artwork: {
    gridArea: "1 / 1",
    placeSelf: "safe center",
    inlineSize: "100%",
  },
  logo: {
    gridArea: "1 / 1",
    placeSelf: "start",
    inlineSize: "5.5rem",
  },
  toggle: {
    gridArea: "1 / 1",
    placeSelf: "start end",
  },
  error: {
    color: color.dangerText,
  },
});
