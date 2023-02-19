import { bcrypt } from "./deps.ts";

export async function hash(key: string) {
  let salt = await bcrypt.genSalt(8);
  return bcrypt.hash(key, salt);
}

export function compare(candidate: string, hash: string) {
  return bcrypt.compare(candidate, hash);
}
