import { z } from "../deps.ts";
import * as schemas from "$lib/schemas.ts";
import { audioAnalysis } from "$lib/metrics.ts";
import * as Cache from "$lib/cache.ts";

let baseSchema = z.object({
  output: z.enum(["json", "dat"]),
});

interface AnalyzeUrlParams {
  url: string;
  ext: schemas.Ext;
  output: schemas.Output;
}

export async function analyzeUrl(params: AnalyzeUrlParams) {
  let { url, ext } = params;

  let cacheKey = await Cache.createKey({ url, ext });
  let cached = await Cache.getWaveform(cacheKey);

  if (cached) {
    console.log("Cache hit for : " + cacheKey);
    return cached;
  }

  console.log("Cache miss for : " + cacheKey);

  let result = await analyze({
    ext: params.ext,
    output: params.output,
    prepare: async (paths) => {
      let fileResponse = await fetch(url);
      if (fileResponse.body) {
        let file = await Deno.open(paths.in, { write: true });
        await fileResponse.body.pipeTo(file.writable);
      }
    },
  });

  await Cache.setWaveform(cacheKey, result);

  return result;
}

const FILE_SIZE_LIMIT = 8000000;

let fileSchema = baseSchema.extend({
  // TODO: Should be able to extract the extension from the file name
  ext: z.enum(["mp3"]),
  file: z
    .custom<File>((val) => val instanceof File, "Please include a file")
    .refine((file) => file.size < FILE_SIZE_LIMIT, "File size is too big"),
});

export async function analyzeFile(params: z.infer<typeof fileSchema>) {
  let { file } = params;
  let result = await analyze({
    ext: params.ext,
    output: params.output,
    prepare: async (paths) => {
      await Deno.writeFile(paths.in, file.stream());
    },
  });
  return result;
}

async function analyze(params: {
  ext: schemas.Ext;
  output: schemas.Output;
  prepare: (paths: { in: string; out: string }) => Promise<void>;
}): Promise<ArrayBuffer> {
  let { ext, output, prepare } = params;
  let paths = {
    in: await Deno.makeTempFile({ suffix: `.${ext}` }),
    out: await Deno.makeTempFile({ suffix: `.${output}` }),
  };

  await prepare(paths);

  let cmd = new Deno.Command("audiowaveform", {
    args: ["-q", "-i", paths.in, "-o", paths.out],
  });

  audioAnalysis.inc();

  let { code } = await cmd.output();

  if (code !== 0) {
    throw new Error("Error running audiowaveform. Code: " + code);
  }

  let data = await Deno.readFile(paths.out);
  await Deno.remove(paths.out);
  await Deno.remove(paths.in);
  return data.buffer;
}
