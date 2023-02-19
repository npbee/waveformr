import { bearerAuth, extname, Hono, loadSync, serve } from "./deps.ts";
import { analyzeFile, ValidExt } from "./service.ts";

export let app = new Hono();

app.use("*", (c, next) => {
  console.log(c.req);
  return next();
});

app.use("*", bearerAuth({ token: getApiKey() }));

app.post("/", async (c) => {
  let formData = await c.req.formData();
  let file = formData.get("file");

  if (!file || !(file instanceof File)) {
    c.status(400);

    return c.json({
      status: "error",
      message: "Expected a file",
    });
  }

  let ext = formData.get("ext") ?? extname(file.name).slice(1);

  if (!isValidExt(ext)) {
    c.status(400);

    return c.json({
      status: "error",
      message: "Expected a valid extension. Received: " + ext,
    });
  }

  let samples = parseSamples(formData.get("samples"));
  let result = await analyzeFile(file, ext, samples);

  return c.json(result);
});

export function run() {
  serve(app.fetch);
}

if (import.meta.main) {
  run();
}

function isValidExt(ext: unknown): ext is ValidExt {
  let res = ext === "mp3" || ext === "wav";

  return res;
}

function parseSamples(samples: unknown) {
  if (typeof samples !== "string") {
    return;
  }

  let parsed = parseInt(samples);

  if (Number.isNaN(parsed)) return;

  return parsed;
}

function getApiKey(): string {
  let dotenv = loadSync();
  let secret = Deno.env.get("API_KEY") ?? dotenv.API_KEY;
  if (!secret) {
    throw new Error("Could not find secret");
  }
  return secret;
}
