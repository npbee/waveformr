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
        <Field label="Style">
          {(labelId) => (
            <SegmentedControl
              aria-labelledby={labelId}
              options={waveformStyles}
              value={config.type}
              onValueChange={(type) => onChange({ type })}
            />
          )}
        </Field>
        <Slider
          label="Samples"
          value={config.samples}
          onValueChange={(samples) => onSlide({ samples })}
          min={50}
          max={500}
          step={10}
        />
        <Field label="Linecap">
          {(labelId) => (
            <SegmentedControl
              aria-labelledby={labelId}
              options={linecaps}
              value={config["stroke-linecap"]}
              onValueChange={(value) => onChange({ "stroke-linecap": value })}
            />
          )}
        </Field>
        <Slider
          label="Width"
          value={config["stroke-width"]}
          onValueChange={(value) => onSlide({ "stroke-width": value })}
          min={1}
          max={10}
        />
        <Field label="Stroke">
          {(labelId) => (
            <InkPicker
              aria-labelledby={labelId}
              size="fill"
              value={inkFromParam(config.stroke)}
              onValueChange={(ink) => onChange({ stroke: inkParam(ink) })}
              xstyle={styles.inks}
            />
          )}
        </Field>
        {/* Only steps draws a filled shape. */}
        {config.type === "steps" ? (
          <Field label="Fill">
            {(labelId) => (
              <InkPicker
                aria-labelledby={labelId}
                size="fill"
                value={inkFromParam(config.fill)}
                onValueChange={(ink) => onChange({ fill: inkParam(ink) })}
                xstyle={styles.inks}
              />
            )}
          </Field>
        ) : null}
      </Sidebar.Content>
    </Sidebar.Root>
  );
}

// Butt caps are left out: next to square they only differ by a few pixels.
const linecaps = [
  { value: "round", label: "Round" },
  { value: "square", label: "Square" },
] as const;

/** A visible label above a control, which takes its name from it. */
function Field(props: { label: string; children: (labelId: string) => ReactNode }) {
  let labelId = useId();
  return (
    <div {...stylex.props(styles.field)}>
      <span id={labelId} {...stylex.props(styles.fieldLabel)}>
        {props.label}
      </span>
      {props.children(labelId)}
    </div>
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
    gap: 20,
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
  field: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  // Matches the Slider's label.
  fieldLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: color.textMuted,
  },
  // Two full rows of six chips, filling the width like the controls around
  // them.
  inks: {
    display: "grid",
    gridTemplateColumns: "repeat(6, 1fr)",
    gap: 6,
  },
  error: {
    color: color.dangerText,
  },
});
