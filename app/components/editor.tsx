import { CopyIcon, FadersHorizontalIcon, LinkIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import { useEffect, useId, useState, type ReactNode } from "react";
import { InkPicker, inkFromParam, inkParam } from "~/components/ink-picker";
import { LogoLink } from "~/components/logo";
import { waveformStyles } from "~/components/style-picker";
import { Button } from "~/components/ui/button";
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
  svgSize?: string | null;
  onChange: (patch: Partial<EditorConfig>) => void;
  onSlide: (patch: Partial<EditorConfig>) => void;
}

/** Canvas beside a collapsible sidebar of controls. */
export function Editor(props: EditorProps) {
  let { svg, renderUrl, svgSize, state, config, onChange, onSlide } = props;
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
        {svgSize ? (
          <footer {...stylex.props(styles.footer)}>
            <dl {...stylex.props(styles.size)}>
              <dt>Output size</dt>
              <dd {...stylex.props(styles.sizeValue)}>{svgSize}</dd>
            </dl>
          </footer>
        ) : null}
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
        <div {...stylex.props(styles.actions)}>
          <CopyButton text={svg} icon={<CopyIcon weight="bold" />}>
            Copy SVG
          </CopyButton>
          <CopyButton text={renderUrl} variant="outline" icon={<LinkIcon weight="bold" />}>
            Copy URL
          </CopyButton>
        </div>
      </Sidebar.Content>
    </Sidebar.Root>
  );
}

// Butt caps are left out: next to square they only differ by a few pixels.
const linecaps = [
  { value: "round", label: "Round" },
  { value: "square", label: "Square" },
] as const;

/** Copies `text`, then briefly says whether it worked. */
function CopyButton(props: {
  text?: string | null;
  variant?: "solid" | "outline";
  icon: ReactNode;
  children: ReactNode;
}) {
  let [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

  useEffect(() => {
    if (status === "idle") return;
    let timeout = setTimeout(() => setStatus("idle"), 2000);
    return () => clearTimeout(timeout);
  }, [status]);

  return (
    <Button
      variant={props.variant}
      size="sm"
      iconStart={props.icon}
      disabled={!props.text}
      onClick={() => {
        if (!props.text) return;
        navigator.clipboard.writeText(props.text).then(
          () => setStatus("copied"),
          () => setStatus("error"),
        );
      }}
      xstyle={styles.action}
    >
      <span aria-live="polite">
        {status === "copied" ? "Copied" : status === "error" ? "Couldn't copy" : props.children}
      </span>
    </Button>
  );
}

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
  // Bottom padding matches the sidebar's, so the footer lines up with its
  // buttons.
  stage: {
    minInlineSize: 0,
    display: "grid",
    padding: 12,
    paddingBlockEnd: 16,
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
  // Same height as the sidebar's small buttons, so they share a center line.
  footer: {
    gridArea: "1 / 1",
    alignSelf: "end",
    justifySelf: "end",
    display: "flex",
    alignItems: "center",
    minBlockSize: 32,
  },
  size: {
    display: "flex",
    gap: 6,
    margin: 0,
    fontSize: 13,
    color: color.textMuted,
  },
  sizeValue: {
    margin: 0,
    fontVariantNumeric: "tabular-nums",
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
  // Pinned to the bottom of the sidebar when the controls leave room.
  actions: {
    display: "flex",
    gap: 8,
    marginBlockStart: "auto",
  },
  action: {
    flex: 1,
  },
  error: {
    color: color.dangerText,
  },
});
