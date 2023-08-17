import { type MiddlewareHandler, Ratelimit } from "../deps.ts";
import { redis } from "./redis.ts";

export function rateLimiter(
  requests = 10,
  seconds:
    | `${number} ms`
    | `${number} s`
    | `${number} m`
    | `${number} h`
    | `${number} d` = "10 s",
): MiddlewareHandler {
  const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, seconds),
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
