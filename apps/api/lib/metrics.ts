import { Counter } from "../deps.ts";

export let audioAnalysis = Counter.with({
  name: "audio_analysis_total",
  help: "Total audio analysis requests",
  labels: [],
});
