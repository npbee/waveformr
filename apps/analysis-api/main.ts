import { Hono, serve } from "./deps.ts";
import { extname } from "./dev_deps.ts";
import { analyzeFile, ValidExt } from "./service.ts";

export let app = new Hono();

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
    console.log(c);
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

if (import.meta.main) {
  serve(app.fetch);
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
