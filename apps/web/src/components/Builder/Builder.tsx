import invariant from "tiny-invariant";
import {
  memo,
  useEffect,
  useState,
  useMemo,
  useLayoutEffect,
  useRef,
} from "react";
import { HexColorPicker } from "react-colorful";
import copy from "clipboard-copy";
import filesize from "file-size";
import { DropZone } from "./DropZone";
import { RadioGroup } from "./RadioGroup";
import { CopyButton } from "./CopyButton";
import { WaveformData, LinearPathOptions, linearPath } from "@waveformr/core";
import { useMutation } from "@tanstack/react-query";

export function Builder() {
  let analyzeAudio = useMutation({
    mutationFn: (file: File) => {
      return WaveformData.fromFile(file, new window.AudioContext());
    },
  });

  let sampleAudio = useMutation({
    mutationFn: async () => {
      let data = await fetch("/Good Sport.mp3");
      let arrayBuffer = await data.arrayBuffer();
      let file = new File([arrayBuffer], "Good Sport.mp3");
      analyzeAudio.mutate(file);
    },
  });

  // Temporary
  useLayoutEffect(() => {
    sampleAudio.mutate();
  }, []);

  if (analyzeAudio.status === "success") {
    let file = analyzeAudio.variables;
    let waveformData = analyzeAudio.data;
    invariant(file instanceof File, `Expected a file`);

    return (
      <InitializedBuilder
        waveformData={waveformData}
        file={file}
        onRemoveFile={() => analyzeAudio.reset()}
      />
    );
  }

  if (analyzeAudio.status === "loading") {
    return <div>Analyzing...</div>;
  }

  return (
    <div className="w-full space-y-8">
      <DropZone onDrop={analyzeAudio.mutate} />
    </div>
  );
}

interface InitializedBuilderProps {
  waveformData: WaveformData;
  file: File;
  onRemoveFile: () => void;
}

function InitializedBuilder(props: InitializedBuilderProps) {
  let { waveformData, file, onRemoveFile } = props;

  let [stroke, setStroke] = useState("red");
  let [fill, setFill] = useState("red");
  let [strokeWidth, setStrokeWidth] = useState(2);
  let [strokeLinecap, setStrokeLinecap] = useState<"round" | "butt" | "square">(
    "round"
  );
  let [samples, setSamples] = useState(200);
  let [pathConfig, setPathConfig] = useState<
    Omit<LinearPathOptions, "width" | "height">
  >({ type: "mirror" });
  let [width] = useState(1200);
  let [height] = useState(100);
  let [svgHtmlString, setSvgHtmlString] = useState("");

  function changePathConfigType(newType: LinearPathOptions["type"]) {
    setPathConfig((config) => ({ ...config, type: newType }));
  }

  let data = useMemo(
    () => waveformData.toJSON(samples),
    [waveformData, samples]
  );

  return (
    <div className="w-full space-y-10">
      <div className="flex gap-4">
        <button onClick={onRemoveFile}>Remove</button>
        <SvgFileSize svgHtml={svgHtmlString} />
        <CopySvgButton svgHtml={svgHtmlString} />
      </div>
      <SvgWavform
        type={pathConfig.type}
        width={width}
        height={height}
        data={data.normalized_data}
        stroke={stroke}
        fill={fill}
        strokeWidth={strokeWidth}
        strokeLinecap={strokeLinecap}
        onHtmlStringChange={setSvgHtmlString}
      />
      <div className="flex justify-between">
        <FileInfo file={file} duration={data.duration} />

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
                setSamples(samples);
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
              changePathConfigType(newValue);
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
              setStrokeLinecap(newValue);
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
                setStrokeWidth(strokeWidth);
              }
            }}
          />
        </div>
        <div className="flex justify-between gap-4">
          <div className="space-y-5">
            <p className="text-lg">Stroke</p>
            <HexColorPicker color={stroke} onChange={setStroke} />
          </div>
          <div className="space-y-5">
            <p className="text-lg">Fill</p>
            <HexColorPicker color={fill} onChange={setFill} />
          </div>
        </div>
      </div>
    </div>
  );
}

export type SvgWaveformProps = LinearPathOptions & {
  data: Array<number>;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeLinecap?: "butt" | "round" | "square";
  onHtmlStringChange: (htmlString: string) => void;
};

export function SvgWavform(props: SvgWaveformProps) {
  let ref = useRef<SVGSVGElement>(null);
  let {
    fill,
    stroke,
    strokeWidth = 2,
    strokeLinecap = "round",
    data,
    width,
    height,
    onHtmlStringChange,
    ...rest
  } = props;

  let path = linearPath(data, {
    ...rest,
    width,
    height,
  });

  useObserveHTMLString(ref, onHtmlStringChange);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" ref={ref}>
      <path
        d={path}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap={strokeLinecap}
      />
    </svg>
  );
}

function useObserveHTMLString(
  ref: React.RefObject<SVGElement>,
  cb: (htmlString: string) => void
) {
  useEffect(() => {
    let el = ref.current;
    if (!el) return;

    // Set initially
    cb(el.outerHTML);

    let observer = new MutationObserver(() => {
      if (el) {
        cb(el.outerHTML);
      }
    });

    observer.observe(el, {
      subtree: true,
      attributes: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [cb]);
}

let FileInfo = memo(function FileInfo(props: { file: File; duration: number }) {
  let { file, duration } = props;
  let fileSize = useMemo(() => filesize(file.size).human(), [file]);
  let formattedDuration = useMemo(() => formatTime(duration), [duration]);
  return (
    <p className="flex items-center gap-1 text-sm text-gray-700">
      <span>{file.name}</span>
      <span>&bull;</span>
      <span>{fileSize}</span>
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
  return <div>{fileSize}</div>;
}

function formatTime(seconds: number) {
  const min = Math.floor(seconds / 60);
  const sec = `${Math.floor(seconds % 60)}`.padStart(2, "0");

  return `${min}:${sec}`;
}
