import { createHash } from "node:crypto";
import type * as schemas from "./schemas.ts";

let waveformStorage = new Map<string, ArrayBuffer | null>();

export function createAnalysisKey(params: { url: string; ext: schemas.Ext }) {
  const { url, ext } = params;
  return createKey({ url, ext });
}

export function getWaveform(key: string): ArrayBuffer | null | undefined {
  return waveformStorage.get(key);
}

export function setWaveform(key: string, waveform: ArrayBuffer): void {
  waveformStorage.set(key, waveform);
}

export function clearWaveformCache() {
  return waveformStorage.clear();
}

export function createKey(obj: Record<string, string | number>) {
  return hash(jsonKey(obj));
}

export function etag(entity: string) {
  return `"${createHash("sha1").update(entity).digest("base64url")}"`;
}

/**
 * Whether an `If-None-Match` header matches the given etag, i.e. the client's
 * copy is still fresh. Weak comparison per RFC 9110.
 */
export function etagMatches(ifNoneMatch: string, etag: string) {
  if (ifNoneMatch.trim() === "*") return true;
  let stripWeak = (tag: string) => tag.trim().replace(/^W\//, "");
  return ifNoneMatch
    .split(",")
    .some((tag) => stripWeak(tag) === stripWeak(etag));
}

function hash(message: string) {
  return createHash("sha256").update(message).digest("hex");
}

export function jsonKey(obj: Record<string, string | number>): string {
  let sorted = Object.fromEntries(
    Object.keys(obj)
      // Sort keys sort we're in a stable order
      .sort()
      // Remove any entries that don't have a value
      .filter((key) => obj[key] !== undefined)
      .map((key) => [key, obj[key]]),
  );

  return JSON.stringify(sorted);
}
