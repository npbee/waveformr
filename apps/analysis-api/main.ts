import { validator, Hono, z } from "./deps.ts";
import { rateLimiter } from "$lib/rate_limit_middleware.ts";

export let app = new Hono();

const FILE_SIZE_LIMIT = 8000000;

if (Deno.env.get("UPSTASH_REDIS_REST_URL")) {
  app.use("*", rateLimiter());
}

app.notFound((c) => c.json({ message: "Not found", ok: false }, 404));

let baseSchema = z.object({
  output: z.enum(["json", "dat"]),
});

let extSchema = z.enum(["mp3"]);

let urlSchema = baseSchema
  .extend({
    ext: extSchema.optional(),
    url: z.string(),
  })
  .transform((val) => {
    let extResult = extSchema.safeParse(
      val.ext ?? extractExtensionFromUrl(val.url),
    );
    if (!extResult.success) {
      throw new Error("Must provide an extension");
    }
    return { ...val, ext: extResult.data };
  });

let fileSchema = baseSchema.extend({
  // TODO: Should be able to extract the extension from the file name
  ext: z.enum(["mp3"]),
  file: z
    .custom<File>((val) => val instanceof File, "Please include a file")
    .refine((file) => file.size < FILE_SIZE_LIMIT, "File size is too big"),
});

app.get(
  "/",
  validator("query", (value, c) => {
    let parsed = urlSchema.safeParse(value);
    if (!parsed.success) {
      console.error(parsed.error.format());
      return c.json({ message: "Invalid parameters", status: "error" }, 401);
    }
    let url = new URL(c.req.url).searchParams.get("url");
    if (!url) {
      return c.json({ message: "URL not valid", status: "error" }, 401);
    }
    return { ...parsed.data, url };
  }),
  async (c) => {
    let params = c.req.valid("query");
    let result = await analyzeUrl(params);

    return new Response(result.buffer, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Length": String(result.buffer.byteLength),
      },
    });
  },
);

app.post(
  "/",
  validator("form", (value, c) => {
    let parsed = fileSchema.safeParse(value);
    if (!parsed.success) {
      return c.json({ message: "Invalid parameters", status: "error" }, 401);
    }
    return parsed.data;
  }),
  async (c) => {
    let params = c.req.valid("form");
    let result = await analyzeFile(params);

    return new Response(result.buffer, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Length": String(result.buffer.byteLength),
      },
    });
  },
);

export function run() {
  Deno.serve(app.fetch);
}

if (import.meta.main) {
  run();
}

async function analyzeUrl(params: z.infer<typeof urlSchema>) {
  let { url } = params;
  let { paths, run } = await setupAnalysis(params);
  let fileResponse = await fetch(url);

  if (fileResponse.body) {
    let file = await Deno.open(paths.in, { write: true });
    await fileResponse.body.pipeTo(file.writable);
  }

  let data = await run();
  return data;
}

async function analyzeFile(params: z.infer<typeof fileSchema>) {
  let { file } = params;
  let { paths, run } = await setupAnalysis(params);
  await Deno.writeFile(paths.in, file.stream());

  let data = await run();
  return data;
}

async function setupAnalysis(
  params: z.infer<typeof baseSchema> & { ext: z.infer<typeof extSchema> },
) {
  let { ext, output } = params;
  let paths = {
    in: await Deno.makeTempFile({ suffix: `.${ext}` }),
    out: await Deno.makeTempFile({ suffix: `.${output}` }),
  };

  return {
    paths,
    async run() {
      let cmd = new Deno.Command("audiowaveform", {
        args: ["-q", "-i", paths.in, "-o", paths.out],
      });

      let { code, stderr } = await cmd.output();

      if (code !== 0) {
        console.error(stderr);
        throw new Error("Error running audiowaveform");
      }

      let data = await Deno.readFile(paths.out);
      Deno.remove(paths.out);
      Deno.remove(paths.in);
      return data;
    },
  };
}

function extractExtensionFromUrl(url: string) {
  return url.split(".").at(1);
}
