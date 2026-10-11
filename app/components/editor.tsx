import { Fieldset } from "@base-ui/react/fieldset";
import { FadersHorizontalIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import { useId, type ReactNode } from "react";
import { InkPicker, inkFromParam, inkParam } from "~/components/ink-picker";
import { LogoLink } from "~/components/logo";
import { waveformStyles } from "~/components/style-picker";
import { SegmentedControl } from "~/components/ui/segmented-control";
import { Sidebar } from "~/components/ui/sidebar";
import { Slider } from "~/components/ui/slider";
import type { EditorConfig } from "~/routes/edit";
import { color, text } from "~/styles/tokens.stylex";

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
  let { svg, state, config, onChange, onSlide } = props;
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
      <Sidebar.Content aria-label="Controls" xstyle={styles.controls}>
        <h2 {...stylex.props(styles.controlsHeading)}>Controls</h2>
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
            xstyle={styles.slider}
          />
        </Section>
        <Section label="Line">
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
            xstyle={styles.slider}
          />
        </Section>
        <Section label="Color">
          <InkField label="Stroke color">
            {(labelId) => (
              <InkPicker
                aria-labelledby={labelId}
                size="sm"
                value={inkFromParam(config.stroke)}
                onValueChange={(ink) => onChange({ stroke: inkParam(ink) })}
              />
            )}
          </InkField>
          {/* Only steps draws a filled shape. */}
          <InkField label="Fill color">
            {(labelId) => (
              <InkPicker
                aria-labelledby={labelId}
                size="sm"
                value={inkFromParam(config.fill)}
                onValueChange={(ink) => onChange({ fill: inkParam(ink) })}
                disabled={config.type !== "steps"}
              />
            )}
          </InkField>
        </Section>
      </Sidebar.Content>
    </Sidebar.Root>
  );
}

// Butt caps are left out: next to square they only differ by a few pixels.
const linecaps = [
  { value: "round", label: "Round" },
  { value: "square", label: "Square" },
] as const;

/** A visible label above an ink picker, which takes its name from it. */
function InkField(props: { label: string; children: (labelId: string) => ReactNode }) {
  let labelId = useId();
  return (
    <div {...stylex.props(styles.inkField)}>
      <span id={labelId} {...stylex.props(styles.inkLabel)}>
        {props.label}
      </span>
      {props.children(labelId)}
    </div>
  );
}

function Section(props: { label: string; children: ReactNode }) {
  return (
    <Fieldset.Root {...stylex.props(styles.section)}>
      <Fieldset.Legend {...stylex.props(styles.sectionLabel)}>{props.label}</Fieldset.Legend>
      {props.children}
    </Fieldset.Root>
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
  // Top padding matches the stage's, so the heading lines up with its header.
  controls: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
    paddingBlockStart: 12,
    paddingBlockEnd: 16,
    paddingInline: 16,
  },
  // Same height as the stage header's small IconButton, so they share a
  // center line.
  controlsHeading: {
    display: "flex",
    alignItems: "center",
    minBlockSize: 32,
    margin: 0,
    fontSize: text.title,
    fontWeight: 500,
    color: color.textMuted,
  },
  section: {
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    gap: 12,
    margin: 0,
    padding: 0,
    borderWidth: 0,
  },
  // Controls keep their natural width; sliders fill the row.
  slider: {
    alignSelf: "stretch",
  },
  inkField: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  // Matches the Slider's label.
  inkLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: color.textMuted,
  },
  sectionLabel: {
    padding: 0,
    fontSize: 12,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    color: color.textMuted,
  },
  error: {
    color: color.dangerText,
  },
});
