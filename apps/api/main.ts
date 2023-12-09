import { Hono } from "./deps.ts";
import { renderRoute } from "./routes/render.ts";
import { METRICS_PORT, metricsApp } from "$lib/metrics.ts";
import { logger } from "$lib/logger.ts";

export let app = new Hono();

app.notFound((c) => c.json({ message: "Not found", ok: false }, 404));

app.route("/render", renderRoute);

export function run() {
  Deno.serve(
    {
      port: METRICS_PORT,
      onListen({ port, hostname }) {
        logger.debug(
          `Metrics app server started on http://${hostname}:${port}`,
        );
      },
    },
    metricsApp.fetch,
  );

  Deno.serve(
    {
      onListen({ port, hostname }) {
        logger.debug(`App server started on http://${hostname}:${port}`);
      },
    },
    app.fetch,
  );
}

if (import.meta.main) {
  run();
}
