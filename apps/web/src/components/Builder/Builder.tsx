import { memo, useState, useMemo, useLayoutEffect } from "react";
import copy from "clipboard-copy";
import filesize from "file-size";
import { DropZone } from "./DropZone";
import { RadioGroup } from "./RadioGroup";
import { CopyButton } from "./CopyButton";
import { ColorPicker, colors } from "./ColorPicker";
import { Slider } from "./Slider";
import { GitHub } from "./Icons";
import { SvgWavform } from "./SvgWaveform";
import { WaveformData, LinearPathOptions } from "@waveformr/core";
import { useMutation } from "@tanstack/react-query";
import { ScrollArea } from "./ScrollArea";

interface Audio {
  name: string;
  waveformData: WaveformData;
}

type BuilderState =
  | { status: "uninitialized" }
  | { status: "analyzing" }
  | { status: "initialized"; audio: Audio };

export function Builder() {
  let [state, setState] = useState<BuilderState>({
    status: "uninitialized",
  });

  let analyzeAudio = useMutation({
    mutationFn: (fileOrDat: File | { name: string; dat: ArrayBuffer }) => {
      if (fileOrDat instanceof File) {
        return WaveformData.fromFile(fileOrDat, new window.AudioContext());
      } else {
        return Promise.resolve(WaveformData.create(fileOrDat.dat));
      }
    },
    onMutate: () => {
      setState({ status: "analyzing" });
    },
    onSuccess: (waveformData, vars) => {
      setState({
        status: "initialized",
        audio: { name: vars.name, waveformData },
      });
    },
  });

  let analyzeSampleAudio = useMutation({
    mutationFn: async () => {
      return fetch("/Good Sport.dat")
        .then((resp) => resp.arrayBuffer())
        .then((buffer) =>
          analyzeAudio.mutate({ dat: buffer, name: "Good Sport" })
        );
    },
    onMutate: () => {
      setState({ status: "analyzing" });
    },
  });

  useLayoutEffect(() => {
    analyzeSampleAudio.mutate();
  }, []);

  if (state.status === "initialized") {
    return (
      <InitializedBuilder
        waveformData={state.audio.waveformData}
        name={state.audio.name}
      />
    );
  }

  if (state.status === "analyzing") {
    return <div>Analyzing...</div>;
  }

  return (
    <div className="w-full space-y-8">
      <DropZone
        onDrop={analyzeAudio.mutate}
        onSample={() => {
          analyzeSampleAudio.mutate();
        }}
      />
    </div>
  );
}

interface InitializedBuilderProps {
  waveformData: WaveformData;
  name: string;
}

function InitializedBuilder(props: InitializedBuilderProps) {
  let { waveformData, name } = props;

  let [stroke, setStroke] = useState(colors[0].value);
  let [fill, setFill] = useState(colors[0].value);
  let [strokeWidth, setStrokeWidth] = useState(2);
  let [strokeLinecap, setStrokeLinecap] = useState<"round" | "butt" | "square">(
    "round"
  );
  let [samples, setSamples] = useState(200);
  let [pathConfig, setPathConfig] = useState<
    Omit<LinearPathOptions, "width" | "height">
  >({ type: "mirror" });
  let [width, setWidth] = useState(1200);
  let [height, setHeight] = useState(100);
  let [svgHtmlString, setSvgHtmlString] = useState("");

  function changePathConfigType(newType: LinearPathOptions["type"]) {
    setPathConfig((config) => ({ ...config, type: newType }));
  }

  let normalizedData = useMemo(
    () => waveformData.getNormalizedData(samples),
    [waveformData, samples]
  );

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

            <CopySvgButton svgHtml={svgHtmlString} />
          </header>
          <SvgWavform
            type={pathConfig.type}
            width={width}
            height={height}
            data={normalizedData}
            stroke={stroke}
            fill={fill}
            strokeWidth={strokeWidth}
            strokeLinecap={strokeLinecap}
            onHtmlStringChange={setSvgHtmlString}
          />
          <div className="bottom-4 left-0 flex w-full items-center justify-between md:absolute md:px-8">
            <FileInfo name={name} duration={waveformData.duration} />
            <a href="https://github.com/npbee/waveformr" className="flex w-4">
              <GitHub aria-hidden="true" />
              <span className="sr-only">GitHub</span>
            </a>
            <SvgFileSize svgHtml={svgHtmlString} />
          </div>
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
                    setSamples(val[0]);
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
                  onChange={(newValue) => {
                    setStrokeLinecap(newValue);
                  }}
                />
                <Slider
                  label="Stroke width"
                  value={[strokeWidth]}
                  step={1}
                  min={1}
                  max={10}
                  onValueChange={(val) => {
                    setStrokeWidth(val[0]);
                  }}
                />
                <ColorPicker
                  label="Stroke"
                  value={stroke}
                  onChange={setStroke}
                />
                <ColorPicker label="Fill" value={fill} onChange={setFill} />
              </div>
            </div>
          </ScrollArea>
        </aside>
      </div>
    </div>
  );
}

let FileInfo = memo(function FileInfo(props: {
  name: string;
  duration: number;
}) {
  let { name, duration } = props;
  let formattedDuration = useMemo(() => formatTime(duration), [duration]);
  return (
    <p className="flex items-center gap-1 text-xs text-gray11">
      <span>{name}</span>
      <span>&bull;</span>
      <span>{formattedDuration}</span>
    </p>
  );
});

function CopySvgButton(props: { svgHtml: string }) {
  return <CopyButton onCopy={() => copy(props.svgHtml)}>Copy SVG</CopyButton>;
}

function SvgFileSize(props: { svgHtml: string }) {
  let { svgHtml } = props;
  let fileSize = useMemo(() => {
    let blob = new Blob([svgHtml]).size;
    return filesize(blob).human();
  }, [svgHtml]);
  return (
    <p className="text-xs font-semibold text-gray11 dark:text-grayDark11">
      {fileSize}
    </p>
  );
}

function formatTime(seconds: number) {
  const min = Math.floor(seconds / 60);
  const sec = `${Math.floor(seconds % 60)}`.padStart(2, "0");

  return `${min}:${sec}`;
}
