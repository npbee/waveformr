import { type MiddlewareHandler, Ratelimit } from "../deps.ts";
import { redis } from "$lib/redis.ts";

interface Limit {
  requests: number;
  seconds:
    | `${number} ms`
    | `${number} s`
    | `${number} m`
    | `${number} h`
    | `${number} d`;
}

export const anonymousLimit: Limit = {
  requests: 2,
  seconds: "1 m",
};

export const authedLimit: Limit = {
  requests: 10,
  seconds: "1 m",
};

export function rateLimiter(limit: Limit): MiddlewareHandler {
  const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit.requests, limit.seconds),
    analytics: true,
  });
  return async function handleRequestWithRateLimiting(c, next) {
    let id = c.req.headers.get("Fly-Client-IP") ?? "global";
    let { success } = await ratelimit.limit(id);
    if (success) {
      await next();
    } else {
      return c.text("Too many requests", 429);
    }
  };
}
