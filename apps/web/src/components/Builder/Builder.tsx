import invariant from "tiny-invariant";
import copy from "clipboard-copy";
import { DropZone } from "./DropZone";
import { RadioGroup } from "./RadioGroup";
import { CopyButton } from "./CopyButton";
import { ColorPicker } from "./ColorPicker";
import { Slider } from "./Slider";
import { SvgWavform } from "./SvgWaveform";
import type { LinearPathOptions } from "@waveformr/core";
import { ScrollArea } from "./ScrollArea";
import { HiddenFileInputButton } from "./HiddenFileInput";
import {
  AnalysisState,
  useAnalysis,
  useEvents,
  useSettings,
  useSvgHtml,
} from "./state";
import { FileSize } from "./FileSize";
import { WaveformStats } from "./WaveformStats";
import { Layout } from "./Layout";
import { useEffect, useState } from "react";
import { Copy, Settings, Upload } from "./Icons";

export function Builder() {
  let events = useEvents();
  let analysis = useAnalysis();
  let {
    stroke,
    fill,
    strokeWidth,
    strokeLinecap,
    samples,
    pathConfig,
    width,
    height,
  } = useSettings();

  useEffect(() => {
    events.sampleChosen();
  }, []);

  function changePathConfigType(newType: LinearPathOptions["type"]) {
    events.settingsChanged({ pathConfig: { ...pathConfig, type: newType } });
  }

  if (analysis.status === "uninitialized") {
    return (
      <Layout>
        <div className="mx-auto flex h-full max-w-6xl flex-1 flex-col gap-24 p-8">
          <DropZone
            onDrop={events.fileUploaded}
            onSample={events.sampleChosen}
          />

          <ol className="flex flex-col justify-between gap-24 md:flex-row">
            <ListItem title="Upload" icon={<Upload />}>
              Upload your audio or try using a{" "}
              <button
                className="trans font-semibold text-cyan-800 underline underline-offset-2 hover:text-cyan-600 dark:text-cyan-50 dark:hover:text-cyan-700"
                onClick={(evt) => {
                  evt.stopPropagation();
                  evt.preventDefault();
                  events.sampleChosen();
                }}
              >
                sample
              </button>
              . Everything stays on your computer.
            </ListItem>
            <ListItem title="Configure" icon={<Settings />}>
              Change colors, style, and tweak settings until the design looks
              just right.
            </ListItem>
            <ListItem title="Copy and Paste" icon={<Copy />}>
              Copy the resulting SVG code and paste it directly into your site.
            </ListItem>
          </ol>
        </div>
      </Layout>
    );
  }

  if (analysis.status === "analyzing") {
    return <Loading />;
  }

  return (
    <Layout>
      <Subheader analysis={analysis} />
      <div className="relative flex h-52 w-full flex-col justify-center gap-8 border-t border-b border-gray-200 bg-gray-50 px-8 py-6 dark:border-gray-700 dark:bg-gray-800 md:h-auto md:flex-1">
        {analysis.status === "analyzed" ? (
          <>
            <SvgWavform
              type={pathConfig.type}
              width={width}
              height={height}
              samples={samples}
              waveformData={analysis.waveformData}
              stroke={stroke}
              fill={fill}
              strokeWidth={strokeWidth}
              strokeLinecap={strokeLinecap}
            />
            <div className="absolute top-0 right-0 px-8 py-1 md:py-2">
              <HiddenFileInputButton
                variant="subtle"
                onFile={events.fileUploaded}
              >
                Edit
              </HiddenFileInputButton>
            </div>
          </>
        ) : (
          <div className="text-sm text-gray-700 dark:text-gray-400">
            Reanalyzing...
          </div>
        )}
      </div>
      <aside className="z-10 flex min-h-0 flex-col gap-4 py-6">
        <ScrollArea>
          <div className="flex flex-col gap-6 px-8 py-4">
            <div className="grid gap-10 md:grid-cols-4">
              <div className="flex flex-col gap-8">
                <RadioGroup
                  label="Style"
                  value={pathConfig.type}
                  items={
                    [
                      { label: "Mirror", value: "mirror" },
                      { label: "Steps", value: "steps" },
                      { label: "Bars", value: "bars" },
                    ] as const
                  }
                  onChange={(newValue) => {
                    changePathConfigType(newValue);
                  }}
                />
                <Slider
                  label="Samples"
                  value={[samples]}
                  step={10}
                  min={50}
                  max={500}
                  onValueChange={(val) => {
                    events.settingsChanged({ samples: val[0] });
                  }}
                />
              </div>
              <div className="flex flex-col gap-8">
                <RadioGroup
                  label="Stroke Linecap"
                  value={strokeLinecap}
                  items={
                    [
                      { label: "Square", value: "square" },
                      { label: "Round", value: "round" },
                      { label: "Butt", value: "butt" },
                    ] as const
                  }
                  onChange={(strokeLinecap) => {
                    events.settingsChanged({ strokeLinecap });
                  }}
                />
                <Slider
                  label="Stroke width"
                  value={[strokeWidth]}
                  step={1}
                  min={1}
                  max={10}
                  onValueChange={(val) => {
                    events.settingsChanged({ strokeWidth: val[0] });
                  }}
                />
              </div>
              <div>
                <ColorPicker
                  label="Stroke"
                  value={stroke}
                  onChange={(stroke) => events.settingsChanged({ stroke })}
                />
              </div>
              <div>
                <ColorPicker
                  label="Fill"
                  value={fill}
                  onChange={(fill) => events.settingsChanged({ fill })}
                />
              </div>
            </div>
          </div>
        </ScrollArea>
      </aside>
    </Layout>
  );
}

function CopySvgButton() {
  let svgHtml = useSvgHtml();
  return (
    <CopyButton
      onCopy={() => {
        invariant(typeof svgHtml === "string");
        return copy(svgHtml);
      }}
    >
      Copy SVG
    </CopyButton>
  );
}

function useLazyLoader(delay = 300) {
  let [loading, setLoading] = useState(false);

  useEffect(() => {
    let timeout = setTimeout(() => {
      setLoading(true);
    });

    return () => {
      clearTimeout(timeout);
    };
  }, [delay]);

  return loading;
}

function Loading() {
  let isLoading = useLazyLoader();

  return isLoading ? <div>Loading...</div> : null;
}

function Subheader(props: {
  analysis: Extract<
    AnalysisState,
    { status: "analyzed" } | { status: "reanalyzing" }
  >;
}) {
  const { analysis } = props;

  let title =
    analysis.status === "reanalyzing" ? (
      "..."
    ) : (
      <div>
        {analysis.name}
        <WaveformStats
          duration={analysis.waveformData.duration}
          sampleRate={analysis.waveformData.sample_rate}
        />
      </div>
    );

  return (
    <header className="flex w-full items-center justify-between bg-white px-8 py-2 dark:bg-gray-800 md:py-4">
      <div className="flex items-center gap-2">
        <h1 className="text-lg">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <FileSize />
        <CopySvgButton />
      </div>
    </header>
  );
}

interface ListItemProps {
  icon: React.ReactNode;
  children: React.ReactNode;
  title: string;
}

function ListItem(props: ListItemProps) {
  const { icon, title, children } = props;

  return (
    <li className="flex flex-1 flex-col gap-2 text-base leading-normal">
      <div className="flex flex-col items-start gap-4">
        <span className="inline-flex w-fit rounded-full text-lg text-cyan-800 dark:text-cyan-600">
          {icon}
        </span>
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
          {title}
        </h3>
      </div>
      <p className="leading-normal text-gray-600 dark:text-gray-300">
        {children}
      </p>
    </li>
  );
}
