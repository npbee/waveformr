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
import { useAnalysis, useEvents, useSettings, useSvgHtml } from "./state";
import { FileSize } from "./FileSize";
import { WaveformStats } from "./WaveformStats";
import { Layout } from "./Layout";

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

  function changePathConfigType(newType: LinearPathOptions["type"]) {
    events.settingsChanged({ pathConfig: { ...pathConfig, type: newType } });
  }

  if (analysis.status === "uninitialized") {
    return (
      <Layout>
        <div className="h-full flex-1 px-8 pt-8">
          <DropZone
            onDrop={events.fileUploaded}
            onSample={events.sampleChosen}
          />
        </div>
      </Layout>
    );
  }

  if (analysis.status === "analyzing") {
    return <div>Analyzing...</div>;
  }

  return (
    <Layout
      title={
        analysis.status === "analyzed" ? (
          <div>
            {analysis.name}{" "}
            <WaveformStats
              duration={analysis.waveformData.duration}
              sampleRate={analysis.waveformData.sample_rate}
            />
          </div>
        ) : (
          "..."
        )
      }
      rightSlot={
        <div className="flex items-center gap-2">
          <FileSize />
          <CopySvgButton />
        </div>
      }
    >
      <div className="relative flex h-52 w-full flex-col justify-center gap-8 border-t border-b border-gray6 bg-gray1 px-8 py-6 dark:border-grayDark8 dark:bg-grayDark2 md:h-auto md:flex-1">
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
                Upload
              </HiddenFileInputButton>
            </div>
          </>
        ) : (
          <div className="text-sm text-gray11 dark:text-grayDark11">
            Reanalyzing...
          </div>
        )}
      </div>
      <aside className="z-10 flex min-h-0 flex-col gap-4 py-6">
        <ScrollArea>
          <div className="flex flex-col gap-6 px-8 pb-8">
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
