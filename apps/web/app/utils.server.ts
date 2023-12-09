import { gzipSize } from "gzip-size";
import prettyBytes from "pretty-bytes";

export async function svgSize(svg: string): Promise<string> {
  return prettyBytes(await gzipSize(svg));
}
