import { z } from "../deps.ts";

export let ext = z.enum(["mp3"]);
export type Ext = z.infer<typeof ext>;
export let output = z.enum(["json", "dat"]);
export type Output = z.infer<typeof output>;
