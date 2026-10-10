import * as stylex from "@stylexjs/stylex";
import { LogoLink } from "~/components/logo";
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

export function Editor(props: EditorProps) {
  let { svg, state } = props;
  return (
    <div {...stylex.props(styles.page)}>
      <header {...stylex.props(styles.header)}>
        <LogoLink />
      </header>
      <main {...stylex.props(styles.main)}>
        {svg ? <div dangerouslySetInnerHTML={{ __html: svg }} /> : null}
        {state === "error" ? (
          <p {...stylex.props(styles.error)}>There was an error rendering this waveform.</p>
        ) : null}
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
  },
  error: {
    color: color.dangerText,
  },
});
