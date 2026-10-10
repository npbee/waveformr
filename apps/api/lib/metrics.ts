import { Counter, Registry } from "prom-client";
import { Hono } from "hono";

let registry = new Registry();

export let audioAnalysis = new Counter({
  name: "audio_analysis_total",
  help: "Total audio analysis requests",
  registers: [registry],
});

export let METRICS_PORT = 9091;

export let metricsApp = new Hono();

metricsApp.get("/metrics", async (c) => {
  return c.body(await registry.metrics(), 200, {
    "Content-Type": registry.contentType,
  });
});
