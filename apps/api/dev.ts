import "@std/dotenv/load";
import { run } from "./main.ts";

Deno.env.set("ENV", "development");

run();
