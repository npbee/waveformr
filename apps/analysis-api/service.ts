import { WaveformData } from "./waveform_data.ts";

export type ValidExt = "mp3" | "wav";

/**
 * I've tried various ways to pass data to the subprocess and just reading &
 * writing to the file system seems to work the best.
 */
export async function analyzeFile(file: File, ext: ValidExt, samples = 500) {
  let inFile = await Deno.makeTempFile({ suffix: `.${ext}` });
  await Deno.writeFile(inFile, file.stream());

  let outFile = await Deno.makeTempFile({ suffix: ".dat" });

  let program = Deno.run({
    cmd: ["audiowaveform", "-q", "-i", inFile, "-o", outFile],
  });

  await program.status();
  program.close();
  let data = await Deno.readFile(outFile);
  Deno.remove(outFile);
  Deno.remove(inFile);
  return toJson(data.buffer, samples);
}

function toJson(buffer: ArrayBuffer, samples: number) {
  return WaveformData.create(buffer).toJSON(samples);
}