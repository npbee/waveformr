import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { z } from "zod";
import type * as schemas from "#lib/schemas.ts";
import { audioAnalysis } from "#lib/metrics.ts";

let execFileAsync = promisify(execFile);

let baseSchema = z.object({
  output: z.enum(["json", "dat"]),
});

interface AnalyzeUrlParams {
  url: string;
  ext: schemas.Ext;
  output: schemas.Output;
}

export function analyzeUrl(params: AnalyzeUrlParams) {
  let { url } = params;

  return analyze({
    ext: params.ext,
    output: params.output,
    prepare: async (paths) => {
      let fileResponse = await fetch(url);
      if (fileResponse.body) {
        await writeFile(paths.in, fileResponse.body);
      }
    },
  });
}

const FILE_SIZE_LIMIT = 8000000;

let fileSchema = baseSchema.extend({
  // TODO: Should be able to extract the extension from the file name
  ext: z.enum(["mp3"]),
  file: z
    .custom<File>((val) => val instanceof File, "Please include a file")
    .refine((file) => file.size < FILE_SIZE_LIMIT, "File size is too big"),
});

export function analyzeFile(params: z.infer<typeof fileSchema>) {
  let { file } = params;
  return analyze({
    ext: params.ext,
    output: params.output,
    prepare: async (paths) => {
      await writeFile(paths.in, file.stream());
    },
  });
}

async function analyze(params: {
  ext: schemas.Ext;
  output: schemas.Output;
  prepare: (paths: { in: string; out: string }) => Promise<void>;
}): Promise<ArrayBuffer> {
  let { ext, output, prepare } = params;
  let dir = await mkdtemp(join(tmpdir(), "waveformr-"));
  let paths = {
    in: join(dir, `in.${ext}`),
    out: join(dir, `out.${output}`),
  };

  try {
    await prepare(paths);

    audioAnalysis.inc();

    try {
      await execFileAsync("audiowaveform", [
        "-q",
        "-i",
        paths.in,
        "-o",
        paths.out,
      ]);
    } catch (err) {
      let { code, signal } = err as { code?: unknown; signal?: unknown };
      throw new Error(`Error running audiowaveform. Code: ${code ?? signal}`, {
        cause: err,
      });
    }

    let data = await readFile(paths.out);
    // Copy out of the Buffer: it may be a view into a larger shared pool
    return new Uint8Array(data).buffer;
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}
