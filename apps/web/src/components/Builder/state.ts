import { LinearPathOptions, WaveformData } from "@waveformr/core";
import filesize from "file-size";
import { create } from "zustand";
import { colors } from "./ColorPicker";

export type AnalysisState =
  | { status: "uninitialized" }
  | { status: "analyzing" }
  | {
      status: "analyzed";
      name: string;
      waveformData: WaveformData;
      svgHtml: string | null;
    }
  // A distinct state to represent when we've already uploaded a file and
  // started working, but then upload another file. Most existing state
  // should be preserved in this case.
  | { status: "reanalyzing" };

interface SettingsState {
  stroke: string;
  fill: string;
  strokeWidth: number;
  strokeLinecap: "round" | "butt" | "square";
  samples: number;
  pathConfig: Omit<LinearPathOptions, "width" | "height">;
  width: number;
  height: number;
}

interface BuilderState {
  analysis: AnalysisState;
  settings: SettingsState;
  events: {
    fileUploaded: (file: File) => void;
    sampleChosen: () => void;
    settingsChanged: (settings: Partial<SettingsState>) => void;
    svgHtmlChanged: (svgHtml: string) => void;
  };
}

export let useBuilder = create<BuilderState>()((set, get) => ({
  analysis: { status: "uninitialized" },
  settings: {
    stroke: colors[0].value,
    fill: colors[0].value,
    strokeWidth: 2,
    strokeLinecap: "round",
    samples: 200,
    pathConfig: {
      type: "mirror",
    },
    width: 1200,
    height: 100,
  },

  events: {
    sampleChosen: async () => {
      let analysisState = get().analysis.status;
      if (analysisState !== "uninitialized") return;

      set({ analysis: { status: "analyzing" } });
      let arrayBuffer = await fetch("/Good Sport.dat").then((resp) =>
        resp.arrayBuffer()
      );
      let waveformData = await runClientSideAnalysis(arrayBuffer);
      set({
        analysis: {
          status: "analyzed",
          svgHtml: null,
          name: "Good Sport",
          waveformData,
        },
      });
    },
    fileUploaded: async (file) => {
      let analysisState = get().analysis;
      let status = analysisState.status;

      if (status === "analyzed" || status === "uninitialized") {
        set({
          analysis: {
            status: status === "uninitialized" ? "analyzing" : "reanalyzing",
          },
        });
        let waveformData = await runClientSideAnalysis(file);
        set({
          analysis: {
            status: "analyzed",
            svgHtml: null,
            name: file.name,
            waveformData,
          },
        });
      }
    },

    settingsChanged: (partialSettings) => {
      let current = get().settings;
      set({
        settings: { ...current, ...partialSettings },
      });
    },

    svgHtmlChanged: (svgHtml) => {
      let analysis = get().analysis;
      if (analysis.status !== "analyzed") return;
      set({
        analysis: {
          ...analysis,
          svgHtml,
        },
      });
    },
  },
}));

export let useEvents = () => useBuilder((state) => state.events);
export let useAnalysis = () => useBuilder((state) => state.analysis);
export let useSettings = () => useBuilder((state) => state.settings);
export let useFileSizeString = () =>
  useBuilder((state) => {
    if (state.analysis.status !== "analyzed") {
      return null;
    }
    let svgHtml = state.analysis.svgHtml;

    if (!svgHtml) {
      return null;
    }

    let size = new Blob([svgHtml]).size;

    return filesize(size).human();
  });

export let useSvgHtml = () =>
  useBuilder((state) => {
    if (state.analysis.status === "analyzed") {
      return state.analysis.svgHtml;
    }
    return null;
  });

function runClientSideAnalysis(fileOrBuffer: File | ArrayBuffer) {
  if (fileOrBuffer instanceof File) {
    return WaveformData.fromFile(fileOrBuffer, new window.AudioContext());
  } else {
    return Promise.resolve(WaveformData.create(fileOrBuffer));
  }
}