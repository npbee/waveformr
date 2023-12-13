import {
  Etag,
  Hono,
  type IRateLimiterOptions,
  MiddlewareHandler,
  RateLimiterMemory,
  z,
} from "../deps.ts";
import { WaveformData } from "$lib/waveform_data.ts";
import { analyzeUrl } from "$lib/analyze.ts";
import * as Render from "$lib/render.ts";
import * as Cache from "$lib/cache.ts";
import * as schemas from "$lib/schemas.ts";
import { defaultConfig, LinearPathConfig } from "$lib/svg_path.ts";
import { logger } from "$lib/logger.ts";

let renderSchema = z
  .object({
    url: z.string(),
    ext: schemas.ext.optional(),
    api_key: z.string().optional(),
    stroke: z.string().optional(),
    fill: z.string().optional(),
    type: z.enum(["mirror", "steps", "bars"]).optional().default("mirror"),
    samples: z.coerce.number().int().optional().default(200),
    width: z.coerce.number().optional(),
    height: z.coerce.number().optional(),
    "stroke-width": z.coerce.number().int().optional().default(2),
    "stroke-linecap": z
      .enum(["square", "butt", "round"])
      .optional()
      .default("round"),
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

type Variables = {
  etag: string;
  params: z.output<typeof renderSchema>;
  analysisCacheKey: string;
};

export let renderRoute = new Hono<{ Variables: Variables }>();

const rateLimiterOpts: IRateLimiterOptions = {
  duration: 1,
  points: 1,
};

renderRoute.get(
  "/",
  paramsMiddleware(),
  etagMiddleware(),
  audioAnalysisCacheMiddleware(),
  // Order is important! This needs to come last because we assume if we're here
  // we're doing a fresh audio analysis
  rateLimiterMiddleware(rateLimiterOpts),
  // If we get all the way here, we will be computed a fresh analysis
  async (c) => {
    let etag = c.get("etag");
    let params = c.get("params");
    let { url, ext } = params;
    let analysis = await analyzeUrl({ url, ext, output: "dat" });
    await Cache.setWaveform(c.get("analysisCacheKey"), analysis);

    return svgResponse({
      params,
      analysis,
      etag,
    });
  },
);

function svgResponse(props: {
  params: z.output<typeof renderSchema>;
  analysis: ArrayBuffer;
  etag: string;
}) {
  const { analysis, params, etag } = props;

  let {
    fill,
    stroke,
    samples,
    "stroke-width": strokeWidth,
    "stroke-linecap": strokeLinecap,
  } = params;
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
      ETag: etag,
    },
  });
}

function extractExtensionFromUrl(url: string) {
  return url.split(".").at(-1);
}

function constructPathConfig(
  params: z.infer<typeof renderSchema>,
): LinearPathConfig {
  if (params.type === "mirror") {
    return {
      ...defaultConfig,
      ...params,
      type: "mirror",
      options: {},
    };
  }

  if (params.type === "steps") {
    return {
      ...defaultConfig,
      ...params,
      type: "steps",
      options: {},
    };
  }

  if (params.type === "bars") {
    return {
      ...defaultConfig,
      ...params,
      type: "bars",
      options: {},
    };
  }

  throw new Error("Could not infer path config from type");
}

/**
 * Extract the params and create the unique key for later use
 */
function paramsMiddleware(): MiddlewareHandler<{ Variables: Variables }> {
  return async (c, next) => {
    let searchParams = new URL(c.req.url).searchParams;
    let rawParams = Object.fromEntries(searchParams.entries());
    let parseResult = renderSchema.safeParse(rawParams);

    if (!parseResult.success) {
      return c.text("Text invalid", 401);
    }
    let params = parseResult.data;
    let etag = await Cache.etag(Cache.jsonKey(params));

    c.set("etag", etag);
    c.set("params", params);

    await next();
  };
}

/**
 * Return a cached response if we can
 */
function etagMiddleware(): MiddlewareHandler<{ Variables: Variables }> {
  return async (c, next) => {
    let ifNoneMatch = c.req.headers.get("if-none-match");
    let etag = c.get("etag");

    if (!Etag.ifNoneMatch(ifNoneMatch, etag)) {
      let headers = new Headers();
      headers.set("Content-Type", "image/svg+xml");
      headers.set("ETag", etag);

      return new Response(null, {
        status: 304,
        headers: {
          "Content-Type": "image/svg+xml",
          Etag: etag,
        },
      });
    }

    await next();
  };
}

function audioAnalysisCacheMiddleware(): MiddlewareHandler<{
  Variables: Variables;
}> {
  return async (c, next) => {
    const params = c.get("params");
    let cacheKey = await Cache.createAnalysisKey({
      url: params.url,
      ext: params.ext,
    });
    c.set("analysisCacheKey", cacheKey);
    let cached = await Cache.getWaveform(c.get("analysisCacheKey"));

    if (cached) {
      logger.debug("Analysis cache hit for : " + cacheKey);
      return svgResponse({
        params,
        analysis: cached,
        etag: c.get("etag"),
      });
    }

    logger.debug("Analysis cache miss for : " + cacheKey);

    await next();
  };
}

function rateLimiterMiddleware(
  config: IRateLimiterOptions,
): MiddlewareHandler<{ Variables: Variables }> {
  const rateLimiter = new RateLimiterMemory(config);
  return async (c, next) => {
    if (Deno.env.get("RATE_LIMIT") === "off") {
      return next();
    }

    let remoteAddress = c.req.headers.get("Fly-Client-IP") ?? "global";

    try {
      const result = await rateLimiter.consume(remoteAddress, 1);

      await next();

      c.header("Retry-After", String(result.msBeforeNext / 1000));
      c.header("X-RateLimit-Limit", String(rateLimiterOpts.points));
      c.header("X-RateLimit-Remaining", String(result.remainingPoints));
      c.header(
        "X-RateLimit-Reset",
        String(new Date(Date.now() + result.msBeforeNext)),
      );
    } catch (_err) {
      return c.text("Too many requests", 429);
    }
  };
}
