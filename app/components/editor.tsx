import { Collapsible } from "@base-ui/react/collapsible";
import * as stylex from "@stylexjs/stylex";
import { LogoLink } from "~/components/logo";
import { StylePicker } from "~/components/style-picker";
import { Tail } from "~/components/tail";
import { Button } from "~/components/ui/button";
import type { EditorConfig } from "~/routes/edit";
import { color, radius, space } from "~/styles/tokens.stylex";

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

/**
 * Canvas-style editor: the waveform fills the page above a full-width control
 * panel that collapses down to its tabs.
 */
export function Editor(props: EditorProps) {
  let { svg, state, config, onChange } = props;
  return (
    <div {...stylex.props(styles.root)}>
      <main {...stylex.props(styles.stage)}>
        <div {...stylex.props(styles.artwork)}>
          {svg ? <div dangerouslySetInnerHTML={{ __html: svg }} /> : null}
          {state === "error" ? (
            <p {...stylex.props(styles.error)}>There was an error rendering this waveform.</p>
          ) : null}
        </div>
        <LogoLink xstyle={styles.logo} />
      </main>
      <Collapsible.Root defaultOpen render={<aside aria-label="Controls" />}>
        <div {...stylex.props(styles.tabs)}>
          <div {...stylex.props(styles.tab)}>
            <div {...stylex.props(styles.tabBody)}>
              <Collapsible.Trigger render={<Button variant="outline" />}>
                Controls
              </Collapsible.Trigger>
            </div>
            <Tail />
          </div>
        </div>
        <Collapsible.Panel
          className={(state) => stylex.props(panelStyles(state)).className}
          style={(state) => stylex.props(panelStyles(state)).style}
        >
          <div {...stylex.props(styles.panelBody)}>
            <StylePicker value={config.type} onValueChange={(type) => onChange({ type })} />
          </div>
        </Collapsible.Panel>
      </Collapsible.Root>
    </div>
  );
}

const styles = stylex.create({
  root: {
    display: "flex",
    flexDirection: "column",
    blockSize: "100dvh",
    // The tab's overlap would otherwise poke 2px past the page when collapsed.
    overflow: "clip",
  },
  // Layers share one grid cell; later ones paint on top.
  stage: {
    flex: 1,
    minBlockSize: 0,
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
  tabs: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "end",
    gap: space.gutter,
    paddingInline: space.gutter,
  },
  // Overlaps the panel's top border so the two read as one surface. Positioned
  // so it paints over the panel, which comes later in the DOM.
  tab: {
    position: "relative",
    marginBlockEnd: -2,
    display: "flex",
  },
  tabBody: {
    // Matches tailSize.height; StyleX only compiles values defined in this file.
    blockSize: 48,
    display: "flex",
    alignItems: "center",
    gap: 12,
    paddingInline: 8,
    backgroundColor: color.surface,
    // Straight, rounded start side; the end side curves down via the Tail.
    borderWidth: 2,
    borderBlockEndWidth: 0,
    borderInlineEndWidth: 0,
    borderStyle: "solid",
    borderColor: color.border,
    borderStartStartRadius: radius.lg,
  },
  // The stage is flex: 1, so it grows and shrinks along with this height.
  panel: {
    blockSize: "var(--collapsible-panel-height)",
    overflow: "clip",
    transitionProperty: "block-size",
    transitionDuration: {
      default: "0s",
      "@media (prefers-reduced-motion: no-preference)": "150ms",
    },
    transitionTimingFunction: "cubic-bezier(0.77, 0, 0.175, 1)",
    backgroundColor: color.surface,
    borderBlockStartWidth: 2,
    borderBlockStartStyle: "solid",
    borderBlockStartColor: color.border,
  },
  panelCollapsed: {
    blockSize: 0,
  },
  // Padding lives inside the clipped panel so it can collapse to zero.
  panelBody: {
    padding: space.gutter,
  },
  error: {
    color: color.dangerText,
  },
});

function panelStyles(state: Collapsible.Panel.State) {
  let collapsed = state.transitionStatus === "starting" || state.transitionStatus === "ending";
  return [styles.panel, collapsed && styles.panelCollapsed];
}
