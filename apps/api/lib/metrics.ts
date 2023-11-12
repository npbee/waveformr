import { Counter, Hono, Registry } from "../deps.ts";

export let audioAnalysis = Counter.with({
  name: "audio_analysis_total",
  help: "Total audio analysis requests",
  labels: [],
});

export let METRICS_PORT = 9091;

export let metricsApp = new Hono();

metricsApp.get("/metrics", (c) => {
  c.header("Content-Type", "text/plain; version=0.0.4");
  return c.text(Registry.default.metrics(), 200);
});
