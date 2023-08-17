import { Redis } from "../deps.ts";

export const redis = new Redis({
  url: Deno.env.get("UPSTASH_REDIS_REST_URL") ?? "",
  token: Deno.env.get("UPSTASH_REDIS_REST_TOKEN") ?? "",
});
