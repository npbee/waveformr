import * as schemas from "$lib/schemas.ts";
import * as Etag from "@std/http/etag";
import { assert } from "@std/assert";

let waveformStorage = new Map<string, ArrayBuffer | null>();

export function createAnalysisKey(params: {
  url: string;
  ext: schemas.Ext;
}) {
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

export async function etag(entity: string) {
  let etag = await Etag.calculate(entity);
  assert(etag);
  return etag;
}

async function hash(message: string) {
  const data = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
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
