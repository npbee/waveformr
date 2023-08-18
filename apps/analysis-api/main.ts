import { validator, Hono, z } from "./deps.ts";
import {
  anonymousLimit,
  authedLimit,
  rateLimiter,
} from "$lib/rate_limit_middleware.ts";
import { analyzeUrl } from "$lib/analyze.ts";
import * as schemas from "$lib/schemas.ts";

const API_KEY = Deno.env.get("API_KEY");

export let app = new Hono();

if (Deno.env.get("UPSTASH_REDIS_REST_URL")) {
  app.use("*", rateLimiter(API_KEY ? authedLimit : anonymousLimit));
}

app.notFound((c) => c.json({ message: "Not found", ok: false }, 404));

let analyzeUrlSchema = z
  .object({
    output: schemas.output,
    ext: schemas.ext.optional(),
    url: z.string(),
    access_key: z.string().optional(),
  })
  .transform((val) => {
    let extResult = schemas.ext.safeParse(
      val.ext ?? extractExtensionFromUrl(val.url),
    );
    if (!extResult.success) {
      throw new Error("Must provide an extension");
    }
    return { ...val, ext: extResult.data };
  });

app.get(
  "/",
  validator("query", (value, c) => {
    let parsed = analyzeUrlSchema.safeParse(value);
    if (!parsed.success) {
      console.error(parsed.error.format());
      return c.json({ message: "Invalid parameters", status: "error" }, 401);
    }
    let url = new URL(c.req.url).searchParams.get("url");
    if (!url) {
      return c.json({ message: "URL not valid", status: "error" }, 401);
    }
    return { ...parsed.data, url };
  }),
  async (c) => {
    let params = c.req.valid("query");
    let result = await analyzeUrl(params);

    return new Response(result.buffer, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Length": String(result.buffer.byteLength),
      },
    });
  },
);

export function run() {
  Deno.serve(app.fetch);
}

if (import.meta.main) {
  run();
}

function extractExtensionFromUrl(url: string) {
  return url.split(".").at(1);
}
