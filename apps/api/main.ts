import { serve, type ServerType } from "@hono/node-server";
import { Hono } from "hono";
import { renderRoute } from "./routes/render.ts";
import { METRICS_PORT, metricsApp } from "#lib/metrics.ts";
import { logger } from "#lib/logger.ts";

export let app = new Hono();

app.notFound((c) => c.json({ message: "Not found", ok: false }, 404));

app.route("/render", renderRoute);

export function run(): ServerType[] {
  let metricsServer = serve(
    { fetch: metricsApp.fetch, port: METRICS_PORT },
    ({ address, port }) => {
      logger.debug(`Metrics app server started on http://${address}:${port}`);
    },
  );

  let appServer = serve(
    { fetch: app.fetch, port: Number(process.env.PORT ?? 8000) },
    ({ address, port }) => {
      logger.debug(`App server started on http://${address}:${port}`);
    },
  );

  return [metricsServer, appServer];
}
