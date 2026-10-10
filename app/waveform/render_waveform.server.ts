import {
  type IRateLimiterOptions,
  RateLimiterMemory,
  RateLimiterRes,
} from "rate-limiter-flexible";
import { WaveformData } from "./waveform_data.ts";
import { analyzeUrl } from "./analyze.ts";
import * as Render from "./render.ts";
import * as Cache from "./cache.ts";
import * as schemas from "./schemas.ts";
import { logger } from "./logger.ts";

// Loose enough for a cold-cache page load showing a few different tracks
export const rateLimiterOpts: IRateLimiterOptions = {
  duration: 10,
  points: 5,
};

let rateLimiter = new RateLimiterMemory(rateLimiterOpts);

// Pages often request several renders of the same audio at once; they share
// one analysis instead of each counting against the rate limit.
let inFlight = new Map<string, Promise<ArrayBuffer>>();

export class RateLimitError extends Error {
  retryAfterSeconds: number;

  constructor(retryAfterSeconds: number) {
    super("Too many requests");
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

/**
 * Identifies the caller for rate limiting. Fly's proxy sets this header; it's
 * absent locally, so everyone shares one bucket.
 */
export function clientKey(request: Request) {
  return request.headers.get("Fly-Client-IP") ?? "global";
}

/**
 * Renders a waveform SVG. Audio analysis results are cached by URL, and only
 * fresh analyses count against the rate limit since they're the expensive
 * part.
 */
export async function renderWaveform(
  params: schemas.RenderParams,
  clientKey: string,
): Promise<string> {
  let cacheKey = Cache.createAnalysisKey({ url: params.url, ext: params.ext });
  let analysis = Cache.getWaveform(cacheKey);

  if (analysis) {
    logger.debug("Analysis cache hit for : " + cacheKey);
  } else {
    logger.debug("Analysis cache miss for : " + cacheKey);
    let pending = inFlight.get(cacheKey);
    if (!pending) {
      // Registered synchronously so concurrent callers can't slip past the
      // check while the rate limiter is awaited
      pending = consumeRateLimit(clientKey)
        .then(() =>
          analyzeUrl({ url: params.url, ext: params.ext, output: "dat" }),
        )
        .then((result) => {
          Cache.setWaveform(cacheKey, result);
          return result;
        })
        .finally(() => inFlight.delete(cacheKey));
      inFlight.set(cacheKey, pending);
    }
    analysis = await pending;
  }

  return Render.svg({
    params,
    waveformData: WaveformData.create(analysis),
    fill: params.fill,
    stroke: params.stroke,
    samples: params.samples,
  });
}

/**
 * Full HTTP handling for the public `/render` endpoint.
 */
export async function handleRender(request: Request): Promise<Response> {
  let searchParams = new URL(request.url).searchParams;
  let parseResult = schemas.render.safeParse(
    Object.fromEntries(searchParams.entries()),
  );

  if (!parseResult.success) {
    return new Response("Invalid params", { status: 400 });
  }

  let params = parseResult.data;
  let etag = Cache.etag(Cache.jsonKey(params));
  let ifNoneMatch = request.headers.get("if-none-match");

  if (ifNoneMatch && Cache.etagMatches(ifNoneMatch, etag)) {
    return new Response(null, {
      status: 304,
      headers: { "Content-Type": "image/svg+xml", ETag: etag },
    });
  }

  try {
    let svg = await renderWaveform(params, clientKey(request));
    return new Response(svg, {
      headers: { "Content-Type": "image/svg+xml", ETag: etag },
    });
  } catch (err) {
    if (err instanceof RateLimitError) {
      return new Response("Too many requests", {
        status: 429,
        headers: { "Retry-After": String(err.retryAfterSeconds) },
      });
    }
    throw err;
  }
}

async function consumeRateLimit(key: string) {
  if (process.env.RATE_LIMIT === "off") return;

  try {
    await rateLimiter.consume(key, 1);
  } catch (err) {
    if (err instanceof RateLimiterRes) {
      throw new RateLimitError(Math.ceil(err.msBeforeNext / 1000));
    }
    throw err;
  }
}
