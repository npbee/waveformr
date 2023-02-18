import { copy, readerFromStreamReader, writeAll } from "./deps.ts";
import { WaveformData } from "./waveform_data.ts";

// TODO: Can probably just use the file input of audiowaveform now...
export async function analyzeFile(
  filePath: string,
  ext: string,
  samples = 500,
) {
  let stream = await Deno.open(filePath);
  return analyzeStream(stream.readable, ext, samples);
}

export async function analyzeBytes(
  bytes: Uint8Array,
  ext: string,
  samples = 500,
) {
  let program = run(ext);
  await writeAll(program.stdin, bytes);
  program.stdin.close();
  let output = await program.output();
  program.close();
  return toJson(output.buffer, samples);
}

// Only works for MP3 and WAV
export async function analyzeStream(
  stream: ReadableStream<Uint8Array>,
  ext: string,
  samples = 500,
) {
  let program = run(ext);
  let reader = readerFromStreamReader(stream.getReader());
  await copy(reader, program.stdin);
  program.stdin.close();
  let output = await program.output();
  program.close();
  return toJson(output.buffer, samples);
}

function toJson(buffer: ArrayBuffer, samples: number) {
  return WaveformData.create(buffer).toJSON(samples);
}

function run(ext: string) {
  return Deno.run({
    cmd: [
      "audiowaveform",
      "-q",
      "--input-format",
      ext,
      "--output-format",
      "dat",
    ],
    stdout: "piped",
    stdin: "piped",
  });
}

export async function help() {
  const program = Deno.run({
    cmd: ["audiowaveform", "--help"],
    stdout: "piped",
    stdin: "piped",
  });

  const output = await program.output();
  program.close();
  return output;
}
