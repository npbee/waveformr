import { createFileRoute, useRouterState } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { getLinks, getSeo } from "~/seo";
import { Editor } from "~/components/editor";
import { useDebouncedCallback } from "use-debounce";
import { svgSize } from "~/utils.server";
import { SvgSize } from "~/components/file-size";
import { GetForm, useSubmitForm } from "~/components/get-form";
import * as schemas from "~/waveform/schemas";
import { clientKey, renderWaveform } from "~/waveform/render_waveform.server";

// TODO: Share with backend??
export let renderSchema = z.object({
  url: z.string(),
  stroke: z.string().optional().default("#001219ff"),
  fill: z.string().optional().default("#001219ff"),
  type: z.enum(["mirror", "steps", "bars"]).optional().default("mirror"),
  samples: z.coerce.number().int().optional().default(200),
  cacheKey: z.string().optional(),
  "stroke-width": z.coerce.number().int().optional().default(2),
  "stroke-linecap": z
    .enum(["square", "butt", "round"])
    .optional()
    .default("round"),
});

const renderEditor = createServerFn({ method: "GET" })
  .validator(renderSchema)
  .handler(async ({ data: config }) => {
    const request = getRequest();
    const renderUrl = new URL("/render", publicOrigin(request));
    for (const [key, value] of Object.entries(config)) {
      renderUrl.searchParams.set(key, String(value));
    }

    const title = config.url.split("/").at(-1) ?? "...";
    const params = schemas.render.safeParse(
      Object.fromEntries(renderUrl.searchParams.entries()),
    );

    if (params.success) {
      try {
        const svg = await renderWaveform(params.data, clientKey(request));
        return {
          config,
          status: "ok",
          svg,
          renderUrl: renderUrl.toString(),
          title,
          svgSize: await svgSize(svg),
        } as const;
      } catch (err) {
        console.error(err);
      }
    }

    return {
      status: "error",
      config,
      svg: null,
      renderUrl: null,
      title,
    } as const;
  });

// Defaults live in `renderSchema` rather than here so they aren't written back
// into the URL, which would redirect every shared link on first load.
const searchSchema = z.object({ url: z.string() }).catchall(z.string());

export const Route = createFileRoute("/edit")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => renderSchema.parse(search),
  loader: ({ deps }) => renderEditor({ data: deps }),
  head: () => ({
    meta: getSeo({
      title: "Edit waveform - Waveformr",
      description:
        "Design, and build responsive audio waveform visualizations that you can copy and paste to your site or serve as an image.",
      pathname: "/edit",
    }),
    links: getLinks({ pathname: "/edit" }),
  }),
  component: EditRoute,
});

function EditRoute() {
  const data = Route.useLoaderData();
  const submit = useDebouncedCallback(useSubmitForm(), 100);
  const isLoading = useRouterState({ select: (s) => s.isLoading });
  const editorState =
    data.status === "error" ? "error" : isLoading ? "pending" : "idle";

  return (
    <GetForm
      className="h-full"
      action="/edit"
      onChange={(evt) => {
        submit(evt.currentTarget);
      }}
    >
      <Editor
        svg={data.svg}
        config={data.config}
        renderUrl={data.renderUrl}
        state={editorState}
        title={data.title}
        svgSize={data.status === "ok" ? <SvgSize size={data.svgSize} /> : null}
      />
    </GetForm>
  );
}

/**
 * Origin as the user sees it. TLS terminates at Fly's proxy, so the request
 * itself arrives over plain HTTP.
 */
function publicOrigin(request: Request) {
  const url = new URL(request.url);
  if (request.headers.get("x-forwarded-proto") === "https") {
    url.protocol = "https:";
  }
  return url.origin;
}
