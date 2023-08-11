export type ValidExt = "mp3" | "wav";
export type ValidOutput = "dat" | "json";

/**
 * I've tried various ways to pass data to the subprocess and just reading &
 * writing to the file system seems to work the best.
 */
export async function analyzeFile(
  file: File,
  ext: ValidExt,
  outputType: ValidOutput,
) {
  let inFile = await Deno.makeTempFile({ suffix: `.${ext}` });
  await Deno.writeFile(inFile, file.stream());

  let outFile = await Deno.makeTempFile({ suffix: `.${outputType}` });

  let cmd = new Deno.Command("audiowaveform", {
    args: ["-q", "-i", inFile, "-o", outFile],
  });

  let { code } = await cmd.output();

  if (code !== 0) {
    throw new Error("Error running audiowaveform");
  }

  let data = await Deno.readFile(outFile);
  Deno.remove(outFile);
  Deno.remove(inFile);
  return data;
}
