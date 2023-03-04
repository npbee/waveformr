import { useLayoutEffect } from "react";
import invariant from "tiny-invariant";
import copy from "clipboard-copy";
import { DropZone } from "./DropZone";
import { RadioGroup } from "./RadioGroup";
import { CopyButton } from "./CopyButton";
import { ColorPicker } from "./ColorPicker";
import { Slider } from "./Slider";
import { GitHub } from "./Icons";
import { SvgWavform } from "./SvgWaveform";
import type { LinearPathOptions } from "@waveformr/core";
import { ScrollArea } from "./ScrollArea";
import { HiddenFileInputButton } from "./HiddenFileInput";
import { useAnalysis, useEvents, useSettings, useSvgHtml } from "./state";
import { FileSize } from "./FileSize";
import { FileInfo } from "./FileInfo";

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

  useLayoutEffect(() => {
    events.sampleChosen();
  }, [events]);

  if (analysis.status === "uninitialized") {
    return (
      <div className="w-full space-y-8">
        <DropZone onDrop={events.fileUploaded} onSample={events.sampleChosen} />
      </div>
    );
  }

  if (analysis.status === "analyzing") {
    return <div>Analyzing...</div>;
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-full flex-col md:flex-row">
        <div className="relative flex w-full flex-col justify-center gap-8 bg-gray1 p-8 dark:bg-grayDark2 md:h-full">
          <header className="top-0 left-0 z-10 flex w-full items-center justify-between md:absolute md:px-8 md:py-6">
            <a
              href="/"
              className="text-sm font-semibold lowercase tracking-wider"
            >
              Waveformr
            </a>

            <div className="flex items-center gap-2">
              <HiddenFileInputButton
                variant="subtle"
                onFile={events.fileUploaded}
              >
                Upload
              </HiddenFileInputButton>
              <CopySvgButton />
            </div>
          </header>
          {analysis.status === "analyzed" ? (
            <>
              <SvgWavform
                type={pathConfig.type}
                width={width}
                height={height}
                samples={samples}
                waveformData={analysis.analysis.waveformData}
                stroke={stroke}
                fill={fill}
                strokeWidth={strokeWidth}
                strokeLinecap={strokeLinecap}
              />
              <div className="bottom-4 left-0 flex w-full items-center justify-between md:absolute md:px-8">
                <FileInfo
                  name={analysis.analysis.name}
                  duration={analysis.analysis.waveformData.duration}
                />
                <a
                  href="https://github.com/npbee/waveformr"
                  className="flex w-4"
                >
                  <GitHub aria-hidden="true" />
                  <span className="sr-only">GitHub</span>
                </a>
                <FileSize />
              </div>
            </>
          ) : (
            <div className="text-sm text-gray11 dark:text-grayDark11">
              Reanalyzing...
            </div>
          )}
        </div>
        <aside className="z-10 flex h-full min-h-0 flex-col gap-4 border-gray6 py-6 shadow-lg dark:border-grayDark8 dark:bg-grayDark4 md:w-[400px] md:border-l">
          <ScrollArea>
            <div className="flex flex-col gap-6 px-8 pb-8">
              <h2 className="text-base font-medium">Settings</h2>
              <div className="space-y-10">
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
                <ColorPicker
                  label="Stroke"
                  value={stroke}
                  onChange={(stroke) => events.settingsChanged({ stroke })}
                />
                <ColorPicker
                  label="Fill"
                  value={fill}
                  onChange={(fill) => events.settingsChanged({ fill })}
                />
              </div>
            </div>
          </ScrollArea>
        </aside>
      </div>
    </div>
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
