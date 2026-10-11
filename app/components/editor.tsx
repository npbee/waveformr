import { Collapsible } from "@base-ui/react/collapsible";
import { Fieldset } from "@base-ui/react/fieldset";
import { PencilSimpleIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { InkPicker, inkFromParam, inkParam } from "~/components/ink-picker";
import { LogoLink } from "~/components/logo";
import { waveformStyles } from "~/components/style-picker";
import { Tail } from "~/components/tail";
import { Button } from "~/components/ui/button";
import { SegmentedControl } from "~/components/ui/segmented-control";
import { Slider } from "~/components/ui/slider";
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

/**
 * Canvas-style editor: the waveform fills the page above a full-width control
 * panel that collapses down to its tabs.
 */
export function Editor(props: EditorProps) {
  let { svg, state, config, onChange, onSlide } = props;
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
      <Collapsible.Root
        defaultOpen
        render={<aside aria-label="Controls" />}
        className={(state) =>
          stylex.props(styles.controls, state.open && styles.controlsOpen).className
        }
        style={(state) => stylex.props(styles.controls, state.open && styles.controlsOpen).style}
      >
        <div {...stylex.props(styles.tabs)}>
          <div {...stylex.props(styles.tab)}>
            <Tail side="start" />
            <div {...stylex.props(styles.tabBody)}>
              <Collapsible.Trigger
                render={
                  <Button
                    variant="ghost"
                    size="sm"
                    iconStart={<PencilSimpleIcon weight="bold" />}
                  />
                }
              >
                Controls
              </Collapsible.Trigger>
            </div>
            <Tail side="end" />
          </div>
        </div>
        <Collapsible.Panel
          className={(state) => stylex.props(panelStyles(state)).className}
          style={(state) => stylex.props(panelStyles(state)).style}
        >
          <div {...stylex.props(styles.panelBody)}>
            <Section label="Shape">
              <SegmentedControl
                aria-label="Style"
                options={waveformStyles}
                value={config.type}
                onValueChange={(type) => onChange({ type })}
              />
              <Slider
                label="Samples"
                value={config.samples}
                onValueChange={(samples) => onSlide({ samples })}
                min={50}
                max={500}
                step={10}
              />
            </Section>
            <Section label="Stroke">
              <SegmentedControl
                aria-label="Linecap"
                options={linecaps}
                value={config["stroke-linecap"]}
                onValueChange={(value) => onChange({ "stroke-linecap": value })}
              />
              <Slider
                label="Width"
                value={config["stroke-width"]}
                onValueChange={(value) => onSlide({ "stroke-width": value })}
                min={1}
                max={10}
              />
              <InkPicker
                aria-label="Stroke color"
                size="sm"
                value={inkFromParam(config.stroke)}
                onValueChange={(ink) => onChange({ stroke: inkParam(ink) })}
              />
            </Section>
            {/* Only steps draws a filled shape. */}
            <Section label="Fill">
              <InkPicker
                aria-label="Fill color"
                size="sm"
                value={inkFromParam(config.fill)}
                onValueChange={(ink) => onChange({ fill: inkParam(ink) })}
                disabled={config.type !== "steps"}
              />
            </Section>
          </div>
        </Collapsible.Panel>
      </Collapsible.Root>
    </div>
  );
}

// Butt caps are left out: next to square they only differ by a few pixels.
const linecaps = [
  { value: "round", label: "Round" },
  { value: "square", label: "Square" },
] as const;

function Section(props: { label: string; children: ReactNode }) {
  return (
    <Fieldset.Root {...stylex.props(styles.section)}>
      <Fieldset.Legend {...stylex.props(styles.sectionLabel)}>{props.label}</Fieldset.Legend>
      <div {...stylex.props(styles.sectionControls)}>{props.children}</div>
    </Fieldset.Root>
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
  // drop-shadow follows the outline of the tab and its curves, not just the box.
  controls: {
    filter: "drop-shadow(0 0 0 transparent)",
    transitionProperty: "filter",
    transitionDuration: "150ms",
    transitionTimingFunction: "ease-out",
  },
  controlsOpen: {
    filter: "drop-shadow(0 -6px 20px oklch(0 0 0 / 0.16))",
  },
  tabs: {
    display: "flex",
    justifyContent: "center",
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
    // Only the top edge; the Tails draw both sides.
    borderBlockStartWidth: 2,
    borderBlockStartStyle: "solid",
    borderBlockStartColor: color.border,
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
    display: "flex",
    flexWrap: "wrap",
    gap: space.gutter,
    paddingBlock: 12,
    paddingInline: space.gutter,
  },
  // Sections after the first are set off by a rule on their start side.
  section: {
    flexGrow: 1,
    display: "grid",
    gap: 6,
    margin: 0,
    padding: 0,
    paddingInlineStart: {
      default: 0,
      ":not(:first-child)": space.gutter,
    },
    borderWidth: 0,
    borderInlineStartWidth: {
      default: 0,
      ":not(:first-child)": 2,
    },
    borderStyle: "solid",
    borderColor: color.borderSubtle,
  },
  sectionLabel: {
    padding: 0,
    fontSize: 12,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    color: color.textMuted,
  },
  sectionControls: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  error: {
    color: color.dangerText,
  },
});

function panelStyles(state: Collapsible.Panel.State) {
  let collapsed = state.transitionStatus === "starting" || state.transitionStatus === "ending";
  return [styles.panel, collapsed && styles.panelCollapsed];
}
