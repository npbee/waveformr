import { z } from "zod";

export let ext = z.enum(["mp3"]);
export type Ext = z.infer<typeof ext>;
export let output = z.enum(["json", "dat"]);
export type Output = z.infer<typeof output>;

export let render = z
  .object({
    url: z.string(),
    ext: ext.optional(),
    stroke: z.string().optional(),
    fill: z.string().optional(),
    type: z.enum(["mirror", "steps", "bars"]).optional().default("mirror"),
    samples: z.coerce.number().int().optional().default(200),
    width: z.coerce.number().optional().default(800),
    height: z.coerce.number().optional().default(100),
    "stroke-width": z.coerce.number().int().optional().default(2),
    "stroke-linecap": z
      .enum(["square", "butt", "round"])
      .optional()
      .default("round"),
  })
  .transform((val) => {
    let extResult = ext.safeParse(val.ext ?? extractExtensionFromUrl(val.url));
    if (!extResult.success) {
      throw new Error("Must provide an extension");
    }

    const {
      "stroke-linecap": strokeLinecap,
      "stroke-width": strokeWidth,
      ...rest
    } = val;

    return { ...rest, strokeLinecap, strokeWidth, ext: extResult.data };
  });

export type RenderParams = z.output<typeof render>;

function extractExtensionFromUrl(url: string) {
  return url.split(".").at(-1);
}
