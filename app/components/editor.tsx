import { EditorLayout } from "./editor-layout";
import { CopyButton } from "./copy-button";
import copy from "clipboard-copy";
import { ScrollArea } from "./scroll-area";
import { RadioGroup } from "./radio-group";
import { Slider } from "./slider";
import type { EditorConfig } from "~/routes/edit";
import { ColorPicker } from "./color-picker";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./dialog";
import { URLForm } from "./url-form";
import { useState } from "react";
import { Icon } from "./icons";
import { Button } from "./button";

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
  const { svg, config, renderUrl, state, title, svgSize, onChange, onSlide } =
    props;
  const isDebouncing = state === "pending";

  let fillApplicable = config.type === "steps";

  return (
    <EditorLayout>
      <Subheader svg={svg} renderUrl={renderUrl} title={title} />
      <div
        className="relative flex h-52 w-full flex-col justify-center gap-8 border-b border-t border-gray-200 bg-gray-50 px-4 py-6 transition-opacity duration-100 dark:border-gray-700 dark:bg-gray-800 md:h-auto md:flex-1"
        style={{
          opacity: isDebouncing ? "0.7" : 1,
        }}
      >
        {svg ? <div dangerouslySetInnerHTML={{ __html: svg }} /> : null}
        <div className="absolute bottom-2 right-2">{svgSize}</div>

        {state === "error" ? (
          <div className="text-red-700 font-medium">
            There was an error rendering this waveform 😔
          </div>
        ) : null}
      </div>
      <aside className="z-10 flex min-h-0 flex-col gap-4 py-6">
        <ScrollArea>
          <div className="flex flex-col gap-6 px-4 py-4">
            <div className="grid gap-10 md:grid-cols-4">
              <div className="flex flex-col gap-8">
                <RadioGroup
                  label="Style"
                  value={config.type}
                  onValueChange={(type) => onChange({ type })}
                  items={
                    [
                      { label: "Mirror", value: "mirror" },
                      { label: "Steps", value: "steps" },
                      { label: "Bars", value: "bars" },
                    ] as const
                  }
                />
                <Slider
                  label="Samples"
                  value={config.samples}
                  onValueChange={(samples) => onSlide({ samples })}
                  step={10}
                  min={50}
                  max={500}
                />
              </div>
              <div className="flex flex-col gap-8">
                <RadioGroup
                  label="Stroke Linecap"
                  value={config["stroke-linecap"]}
                  onValueChange={(value) =>
                    onChange({ "stroke-linecap": value })
                  }
                  items={
                    [
                      { label: "Square", value: "square" },
                      { label: "Round", value: "round" },
                      { label: "Butt", value: "butt" },
                    ] as const
                  }
                />
                <Slider
                  label="Stroke width"
                  value={config["stroke-width"]}
                  onValueChange={(value) => onSlide({ "stroke-width": value })}
                  step={1}
                  min={1}
                  max={10}
                />
              </div>
              <ColorPicker
                label="Stroke"
                value={config.stroke}
                onValueChange={(stroke) => onChange({ stroke })}
              />
              <ColorPicker
                disabled={!fillApplicable}
                label="Fill"
                value={config.fill}
                onValueChange={(fill) => onChange({ fill })}
              />
            </div>
          </div>
        </ScrollArea>
      </aside>
    </EditorLayout>
  );
}

function Subheader(props: {
  svg?: string | null;
  renderUrl?: string | null;
  title: string;
}) {
  const { svg, renderUrl, title } = props;
  const [editOpen, setEditOpen] = useState(false);

  return (
    <header className="flex flex-col md:flex-row w-full gap-2 md:items-center justify-between bg-white px-4 py-2 dark:bg-gray-800 md:py-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-base text-gray-600 dark:text-gray-200">{title}</h1>
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogTrigger asChild>
            <Button size="small" icon={<Icon name="edit" />} variant="subtle">
              Edit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <div className="flex flex-col gap-4">
              <DialogTitle>Edit URL</DialogTitle>
              <URLForm onSubmit={() => setEditOpen(false)} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex w-full justify-end items-center gap-2">
        {svg ? <CopySvgButton svg={svg} /> : null}
        {renderUrl ? <CopyUrlButton url={renderUrl} /> : null}
      </div>
    </header>
  );
}

function CopySvgButton(props: { svg: string }) {
  const { svg } = props;
  return (
    <CopyButton
      onCopy={() => {
        return copy(svg);
      }}
    >
      Copy SVG
    </CopyButton>
  );
}

function CopyUrlButton(props: { url: string }) {
  const { url } = props;
  return (
    <CopyButton
      onCopy={() => {
        return copy(url);
      }}
    >
      Copy URL
    </CopyButton>
  );
}
