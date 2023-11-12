import { Hono } from "./deps.ts";
import {
  anonymousLimit,
  authedLimit,
  rateLimiter,
} from "$lib/rate_limit_middleware.ts";
import { renderRoute } from "./routes/render.ts";
import { METRICS_PORT, metricsApp } from "$lib/metrics.ts";

const API_KEY = Deno.env.get("API_KEY");

export let app = new Hono();

if (Deno.env.get("UPSTASH_REDIS_REST_URL")) {
  app.use("*", rateLimiter(API_KEY ? authedLimit : anonymousLimit));
}

app.notFound((c) => c.json({ message: "Not found", ok: false }, 404));

app.route("/render", renderRoute);

export function run() {
  Deno.serve({
    port: METRICS_PORT,
    onListen({ port, hostname }) {
      console.log(`Metrics app server started on http://${hostname}:${port}`);
    },
  }, metricsApp.fetch);

  Deno.serve({
    onListen({ port, hostname }) {
      console.log(`App server started on http://${hostname}:${port}`);
    },
  }, app.fetch);
}

if (import.meta.main) {
  run();
}
