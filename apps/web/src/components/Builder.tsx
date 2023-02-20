import { useEffect, useId, useState, useMemo } from "react";
import { HexColorPicker } from "react-colorful";
import copy from "clipboard-copy";
import filesize from "file-size";
import { DropZone } from "./DropZone";
import { RadioGroup } from "./RadioGroup";
import { SvgWavform } from "./SvgWaveform";
import { CopyButton } from "./CopyButton";
import { WaveformData, LinearPathOptions } from "@waveformr/core";

interface BuilderIdleState {
  status: "idle";
}

interface BuilderPendingState {
  status: "pending";
  file: File;
}

interface BuilderErrorState {
  status: "error";
  code: number;
}

interface BuilderAnalyzedState {
  status: "analyzed";
  file: File;
  waveformData: WaveformData;
  samples: number;
  stroke: string;
  fill: string;
  strokeWidth: number;
  width: number;
  height: number;
  strokeLinecap: "square" | "round" | "butt";
  pathConfig: Omit<LinearPathOptions, "width" | "height">;
}

interface BuilderResamplingState extends Omit<BuilderAnalyzedState, "status"> {
  status: "resampling";
}

type BuilderState =
  | BuilderIdleState
  | BuilderPendingState
  | BuilderErrorState
  | BuilderAnalyzedState
  | BuilderResamplingState;

export function Builder() {
  let [state, setState] = useState<BuilderState>({
    status: "idle",
  });

  function onFile(file: File) {
    if (state.status === "idle" || state.status === "error") {
      setState({ status: "pending", file });
      analyzeAudio(file).then((waveformData) => {
        setState({
          status: "analyzed",
          file,
          waveformData,
          samples: 200,
          stroke: "red",
          fill: "red",
          strokeWidth: 2,
          width: 1200,
          height: 100,
          strokeLinecap: "round",
          pathConfig: { type: "mirror" },
        });
      });
    }
  }

  function onSetSamples(samples: number) {
    if (state.status === "analyzed") {
      let s = { ...state };
      let { file } = state;
      setState({ ...state, status: "resampling" });
      analyzeAudio(file).then((waveformData) => {
        setState({ ...s, status: "analyzed", file, waveformData, samples });
      });
    }
  }

  if (state.status === "analyzed" || state.status === "resampling") {
    let s = { ...state };
    return (
      <InitializedBuilder
        waveformData={state.waveformData}
        file={state.file}
        onRemoveFile={() => setState({ status: "idle" })}
        samples={state.samples}
        onSetSamples={onSetSamples}
        stroke={state.stroke}
        onSetStroke={(stroke) => setState({ ...s, stroke })}
        fill={state.fill}
        onSetFill={(fill) => setState({ ...s, fill })}
        strokeWidth={state.strokeWidth}
        onSetStrokeWidth={(strokeWidth) => setState({ ...s, strokeWidth })}
        strokeLinecap={state.strokeLinecap}
        onSetStrokeLinecap={(strokeLinecap) =>
          setState({ ...s, strokeLinecap })
        }
        width={state.width}
        height={state.height}
        pathConfig={state.pathConfig}
        onChangePathConfigType={(newType) =>
          setState({ ...s, pathConfig: { ...s.pathConfig, type: newType } })
        }
      />
    );
  }

  if (state.status === "pending") {
    return <div>Analyzing...</div>;
  }

  return (
    <div className="w-full space-y-8">
      {state.status === "error" ? <div>{state.code} - Try again</div> : null}
      <DropZone onDrop={onFile} />
    </div>
  );
}

interface InitializedBuilderProps {
  waveformData: WaveformData;
  file: File;
  onRemoveFile: () => void;
  samples: number;
  onSetSamples: (samples: number) => void;
  stroke: string;
  onSetStroke: (stroke: string) => void;
  fill: string;
  onSetFill: (stroke: string) => void;
  strokeWidth: number;
  onSetStrokeWidth: (width: number) => void;
  strokeLinecap: "round" | "butt" | "square";
  onSetStrokeLinecap: (cap: "round" | "butt" | "square") => void;
  width: number;
  height: number;
  pathConfig: Omit<LinearPathOptions, "width" | "height">;
  onChangePathConfigType: (newType: LinearPathOptions["type"]) => void;
}

function InitializedBuilder(props: InitializedBuilderProps) {
  let {
    waveformData,
    file,
    samples,
    onRemoveFile,
    onSetSamples,
    stroke,
    onSetStroke,
    fill,
    onSetFill,
    strokeWidth,
    onSetStrokeWidth,
    strokeLinecap,
    onSetStrokeLinecap,
    width,
    height,
    pathConfig,
    onChangePathConfigType,
  } = props;
  let [fileSize, setFileSize] = useState<string | null>(null);
  let id = useId();

  let data = useMemo(
    () => waveformData.toJSON(samples),
    [waveformData, samples]
  );

  useEffect(() => {
    let el = document.getElementById(id);
    if (el) {
      let htmlString = new Blob([el.outerHTML]).size;
      setFileSize(filesize(htmlString).human());
    }
  });

  return (
    <div className="w-full space-y-10">
      <div className="flex justify-between">
        <div>
          {file.name} / {file.size} / {data?.duration} / {fileSize}
        </div>
        <button onClick={onRemoveFile}>Remove</button>
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium" htmlFor="Samples">
            Samples
          </label>
          <select
            id="Samples"
            value={samples}
            onChange={(evt) => {
              let el = evt.target as HTMLSelectElement;
              let samples = parseInt(el.value as string);
              if (!Number.isNaN(samples)) {
                onSetSamples(samples);
              }
            }}
          >
            <option value="100">100</option>
            <option value="200">200</option>
            <option value="300">300</option>
            <option value="400">400</option>
            <option value="500">500</option>
          </select>
        </div>
      </div>
      <SvgWavform
        id={id}
        type={pathConfig.type}
        width={width}
        height={height}
        data={data.normalized_data}
        stroke={stroke}
        fill={fill}
        strokeWidth={strokeWidth}
        strokeLinecap={strokeLinecap}
      />
      <CopyButton
        onCopy={() => {
          let svg = document.getElementById(id);
          if (svg) {
            return copy(svg.outerHTML);
          } else {
            return Promise.reject("Element not found");
          }
        }}
      >
        Copy SVG
      </CopyButton>
      <div className="mx-auto max-w-xl space-y-4">
        <form>
          <RadioGroup
            value={pathConfig.type}
            items={
              [
                { label: "Mirror", value: "mirror" },
                { label: "Steps", value: "steps" },
                { label: "Bars", value: "bars" },
              ] as const
            }
            onChange={(newValue) => {
              onChangePathConfigType(newValue);
            }}
          />
        </form>
        <form>
          <RadioGroup
            value={strokeLinecap}
            items={
              [
                { label: "Square", value: "square" },
                { label: "Round", value: "round" },
                { label: "Butt", value: "butt" },
              ] as const
            }
            onChange={(newValue) => {
              onSetStrokeLinecap(newValue);
            }}
          />
        </form>
        <div className="w-full space-y-5">
          <p className="text-lg">Stroke Width</p>
          <input
            type="range"
            step="1"
            min="1"
            max="10"
            value={strokeWidth}
            className="w-full"
            onChange={(evt) => {
              let el = evt.target as HTMLInputElement;
              let strokeWidth = parseInt(el.value);
              if (!Number.isNaN(strokeWidth)) {
                onSetStrokeWidth(strokeWidth);
              }
            }}
          />
        </div>
        <div className="flex justify-between gap-4">
          <div className="space-y-5">
            <p className="text-lg">Stroke</p>
            <HexColorPicker color={stroke} onChange={onSetStroke} />
          </div>
          <div className="space-y-5">
            <p className="text-lg">Fill</p>
            <HexColorPicker color={fill} onChange={onSetFill} />
          </div>
        </div>
      </div>
    </div>
  );
}

async function analyzeAudio(file: File) {
  let wf = await WaveformData.fromFile(file, new window.AudioContext());

  return wf;
}
