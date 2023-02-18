import { Application, oakCors, Router } from "./deps.ts";
import { analyzeFile, help } from "./service.ts";

const port = 8000;
const app = new Application();

const router = new Router();

router.post("/", async (ctx) => {
  const { request } = ctx;

  if (!request.hasBody) {
    ctx.response.status = 400;
    ctx.response.headers.set("Content-Type", "application/json");
    ctx.response.body = { error: "No body" };
    return;
  }

  let body = ctx.request.body({ type: "form-data" });

  try {
    let formData = await body.value.read();

    // TODO GET ENCODING
    let file = formData.files?.find((file) => file.name === "file");
    let samples = parseInt(formData.fields.samples ?? 200);

    if (Number.isNaN(samples)) {
      samples = 200;
    }

    if (file) {
      let { filename } = file;

      if (filename) {
        let result = await analyzeFile(filename, "mp3", samples);

        await Deno.remove(filename);

        ctx.response.status = 200;
        ctx.response.headers.set("Content-Type", "application/json");
        ctx.response.body = result;
      }
    }
  } catch (_err) {
    console.log(_err);
    ctx.response.status = 400;
    ctx.response.headers.set("Content-Type", "application/json");
    ctx.response.body = {
      status: "error",
    };
  }
});

router.get("/help", async (ctx) => {
  const output = await help();

  ctx.response.status = 200;
  ctx.response.body = output;
});

app.use(
  oakCors({
    origin: [/^.+localhost:3000$/, /^.+waveformr.deno.dev$/],
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  }),
);
app.use(router.allowedMethods());
app.use(router.routes());

console.log(`Server running on port http://localhost:${port}`);

await app.listen({ port });
