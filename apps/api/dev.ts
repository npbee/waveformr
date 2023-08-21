import "$std/dotenv/load.ts";
import { run } from "./main.ts";

Deno.env.set("ENV", "development");

run();
