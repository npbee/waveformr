import { assert, createStorage, Etag } from "../deps.ts";

let waveformStorage = createStorage();

export function getWaveform(key: string): Promise<ArrayBuffer | null> {
  return waveformStorage.getItem(key);
}

export function setWaveform(key: string, waveform: ArrayBuffer): Promise<void> {
  return waveformStorage.setItemRaw(key, waveform);
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
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join(
    "",
  );
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
