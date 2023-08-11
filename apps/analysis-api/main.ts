import { bearerAuth, extname, Hono, loadSync, serve } from "./deps.ts";
import { analyzeFile, ValidExt, ValidOutput } from "./service.ts";

export let app = new Hono();

const LIMIT = 8000000;

app.use("*", bearerAuth({ token: getApiKey() }));

app.post("/stats", async (c) => {
  let formData = await c.req.formData();
  let file = formData.get("file");

  if (!file || !(file instanceof File)) {
    c.status(400);

    return c.json({
      status: "error",
      message: "Expected a file",
    });
  }

  if (file.size > LIMIT) {
    c.status(413);

    return c.json({
      status: "error",
      message: "File size to big",
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

  let output = formData.get("output");

  if (!isValidOutput(output)) {
    c.status(400);

    return c.json({
      status: "error",
      message: "Output must be either 'dat' or 'json'",
    });
  }

  let result = await analyzeFile(file, ext, output);

  return new Response(result.buffer, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Length": String(result.buffer.byteLength),
    },
  });
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

function isValidOutput(output: unknown): output is ValidOutput {
  return output === "json" || output === "dat";
}

function getApiKey(): string {
  let dotenv = loadSync();
  let secret = Deno.env.get("API_KEY") ?? dotenv.API_KEY;
  if (!secret) {
    throw new Error("Could not find secret");
  }
  return secret;
}
