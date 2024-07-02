import { Hono, MiddlewareHandler } from "hono";
import * as Etag from "@std/http/etag";
import { WaveformData } from "$lib/waveform_data.ts";
import { analyzeUrl } from "$lib/analyze.ts";
import * as Render from "$lib/render.ts";
import * as Cache from "$lib/cache.ts";
import * as schemas from "$lib/schemas.ts";
import { logger } from "$lib/logger.ts";
import { IRateLimiterOptions, RateLimiterMemory } from "rate-limiter-flexible";

type Variables = {
  etag: string;
  params: schemas.RenderParams;
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
    Cache.setWaveform(c.get("analysisCacheKey"), analysis);

    return svgResponse({
      params,
      analysis,
      etag,
    });
  },
);

function svgResponse(props: {
  params: schemas.RenderParams;
  analysis: ArrayBuffer;
  etag: string;
}) {
  const { analysis, params, etag } = props;

  let { fill, stroke, samples } = params;
  let waveformData = WaveformData.create(analysis);
  let pathConfig = params;
  let svg = Render.svg({
    params: pathConfig,
    waveformData,
    fill,
    stroke,
    samples,
  });

  // @ts-ignore test
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      ETag: etag,
    },
  });
}

/**
 * Extract the params and create the unique key for later use
 */
function paramsMiddleware(): MiddlewareHandler<{ Variables: Variables }> {
  return async (c, next) => {
    let searchParams = new URL(c.req.url).searchParams;
    let rawParams = Object.fromEntries(searchParams.entries());
    let parseResult = schemas.render.safeParse(rawParams);

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
    let ifNoneMatch = c.req.header("if-none-match");
    let etag = c.get("etag");

    if (ifNoneMatch && !Etag.ifNoneMatch(ifNoneMatch, etag)) {
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
    let cached = Cache.getWaveform(c.get("analysisCacheKey"));

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

    let remoteAddress = c.req.header("Fly-Client-IP") ?? "global";

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
