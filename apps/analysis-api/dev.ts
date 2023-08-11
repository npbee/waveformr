import { load, loadSync } from "./dev_deps.ts";
import { run } from "./main.ts";

let config = loadSync();

console.log(config);

Deno.env.set("API_KEY", config.API_KEY);

run();
