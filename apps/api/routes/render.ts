import { Etag, Hono, Registry, z } from "../deps.ts";
import { WaveformData } from "$lib/waveform_data.ts";
import { analyzeUrl } from "$lib/analyze.ts";
import * as Render from "$lib/render.ts";
import * as Cache from "$lib/cache.ts";
import * as schemas from "$lib/schemas.ts";
import { defaultConfig, LinearPathConfig } from "$lib/svg_path.ts";

export let renderRoute = new Hono();

let renderSchema = z.object({
  url: z.string(),
  ext: schemas.ext.optional(),
  access_key: z.string().optional(),
  stroke: z.string().optional(),
  fill: z.string().optional(),
  type: z.enum(["mirror", "steps", "bars"]).optional().default("mirror"),
  samples: z.coerce.number().int().optional().default(200),
  "stroke-width": z.coerce.number().int().optional().default(2),
  "stroke-linecap": z.enum(["square", "butt", "round"]).optional().default(
    "round",
  ),
}).transform((val) => {
  let extResult = schemas.ext.safeParse(
    val.ext ?? extractExtensionFromUrl(val.url),
  );
  if (!extResult.success) {
    throw new Error("Must provide an extension");
  }
  return { ...val, ext: extResult.data };
});

renderRoute.get(
  "/",
  async (c) => {
    let searchParams = new URL(c.req.url).searchParams;
    let rawParams = Object.fromEntries(searchParams.entries());
    let parseResult = renderSchema.safeParse(rawParams);

    if (!parseResult.success) {
      return c.text("Text invalid", 401);
    }

    let params = parseResult.data;
    let etag = await Cache.etag(Cache.jsonKey(params));
    let ifNoneMatch = c.req.headers.get("if-none-match");

    if (!Etag.ifNoneMatch(ifNoneMatch, etag)) {
      let headers = new Headers();
      headers.set("Content-Type", "image/svg+xml");
      headers.set("ETag", etag);

      return new Response(null, {
        status: 304,
        headers: {
          "Content-Type": "image/svg+xml",
          "Etag": etag,
        },
      });
    }

    let {
      url,
      ext,
      fill,
      stroke,
      samples,
      "stroke-width": strokeWidth,
      "stroke-linecap": strokeLinecap,
    } = params;
    let analysis = await analyzeUrl({
      url,
      ext,
      output: "dat",
    });

    let waveformData = WaveformData.create(analysis);

    let pathConfig = constructPathConfig(params);

    let svg = Render.svg({
      path: pathConfig,
      waveformData,
      strokeWidth,
      strokeLinecap,
      fill,
      stroke,
      samples,
    });

    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "ETag": etag,
      },
    });
  },
);

function extractExtensionFromUrl(url: string) {
  return url.split(".").at(-1);
}

function constructPathConfig(
  params: z.infer<typeof renderSchema>,
): LinearPathConfig {
  if (params.type === "mirror") {
    return {
      ...defaultConfig,
      type: "mirror",
      options: {},
    };
  }

  if (params.type === "steps") {
    return {
      ...defaultConfig,
      type: "steps",
      options: {},
    };
  }

  if (params.type === "bars") {
    return {
      ...defaultConfig,
      type: "bars",
      options: {},
    };
  }

  throw new Error("Could not infer path config from type");
}
