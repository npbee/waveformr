import {
  createFileRoute,
  stripSearchParams,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { getLinks, getSeo } from "~/seo";
import { Editor } from "~/components/editor";
import { useDebouncedCallback } from "use-debounce";
import { svgSize } from "~/utils.server";
import * as schemas from "~/waveform/schemas";
import { clientKey, renderWaveform } from "~/waveform/render_waveform.server";

const defaults = {
  // The "ink" ink, so the editor's ink pickers start with it selected.
  stroke: "212017",
  fill: "212017",
  type: "mirror",
  samples: 200,
  "stroke-width": 2,
  "stroke-linecap": "round",
} as const;

export const editorSearch = z.object({
  url: z.string(),
  stroke: z.string().default(defaults.stroke),
  fill: z.string().default(defaults.fill),
  type: z
    .enum(["mirror", "steps", "bars"])
    .default(defaults.type)
    .catch(defaults.type),
  samples: z.number().int().default(defaults.samples).catch(defaults.samples),
  "stroke-width": z
    .number()
    .int()
    .default(defaults["stroke-width"])
    .catch(defaults["stroke-width"]),
  "stroke-linecap": z
    .enum(["square", "butt", "round"])
    .default(defaults["stroke-linecap"])
    .catch(defaults["stroke-linecap"]),
});

export type EditorConfig = z.infer<typeof editorSearch>;

const renderEditor = createServerFn({ method: "GET" })
  .validator(editorSearch)
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

export const Route = createFileRoute("/edit")({
  validateSearch: editorSearch,
  search: { middlewares: [stripSearchParams(defaults)] },
  loaderDeps: ({ search }) => search,
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
  const navigate = useNavigate({ from: Route.fullPath });
  const isLoading = useRouterState({ select: (s) => s.isLoading });
  const editorState =
    data.status === "error" ? "error" : isLoading ? "pending" : "idle";

  const update = (patch: Partial<EditorConfig>) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }) });
  // Sliders fire on every step of a drag
  const debouncedUpdate = useDebouncedCallback(update, 100);

  return (
    <Editor
      svg={data.svg}
      config={data.config}
      renderUrl={data.renderUrl}
      state={editorState}
      title={data.title}
      svgSize={data.status === "ok" ? data.svgSize : null}
      onChange={update}
      onSlide={debouncedUpdate}
    />
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
