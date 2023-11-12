import { Hono, Registry } from "./deps.ts";
import {
  anonymousLimit,
  authedLimit,
  rateLimiter,
} from "$lib/rate_limit_middleware.ts";
import { renderRoute } from "./routes/render.ts";

const API_KEY = Deno.env.get("API_KEY");

export let app = new Hono();

if (Deno.env.get("UPSTASH_REDIS_REST_URL")) {
  app.use("*", rateLimiter(API_KEY ? authedLimit : anonymousLimit));
}

app.notFound((c) => c.json({ message: "Not found", ok: false }, 404));

app.route("/render", renderRoute);

export let metricsApp = new Hono();

metricsApp.get("/metrics", (c) => {
  c.header("Content-Type", "text/plain; version=0.0.4");
  return c.text(Registry.default.metrics(), 200);
});

export function run() {
  Deno.serve({
    port: 9091,
    onListen({ port, hostname }) {
      console.log(`Metrics app server started on http://${hostname}:${port}`);
    },
  }, metricsApp.fetch);
  return Deno.serve({
    onListen({ port, hostname }) {
      console.log(`App server started on http://${hostname}:${port}`);
    },
  }, app.fetch);
}

if (import.meta.main) {
  run();
}
