import { z } from "../deps.ts";
import * as schemas from "$lib/schemas.ts";

let baseSchema = z.object({
  output: z.enum(["json", "dat"]),
});
let extSchema = z.enum(["mp3"]);

export let analyzeUrlSchema = baseSchema
  .extend({
    ext: extSchema.optional(),
    url: z.string(),
    access_key: z.string().optional(),
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

interface AnalyzeUrlParams {
  url: string;
  ext: schemas.Ext;
  output: schemas.Output;
}

export async function analyzeUrl(params: AnalyzeUrlParams) {
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
  let { paths, run } = await setupAnalysis(params);
  await Deno.writeFile(paths.in, file.stream());

  let data = await run();
  return data;
}

async function setupAnalysis(params: {
  ext: schemas.Ext;
  output: schemas.Output;
}) {
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

      let { code } = await cmd.output();

      if (code !== 0) {
        throw new Error("Error running audiowaveform. Code: " + code);
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
