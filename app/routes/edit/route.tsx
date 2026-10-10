import {
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction,
  defer,
} from "@remix-run/node";
import { z } from "zod";
import {
  Form,
  SubmitFunction,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import { getLinks, getSeo } from "~/seo";
import { Editor } from "~/components/editor";
import { useDebouncedCallback } from "use-debounce";
import { useState } from "react";
import { svgSize } from "~/utils.server";
import { SvgSize } from "~/components/file-size";
import * as schemas from "~/waveform/schemas";
import { clientKey, renderWaveform } from "~/waveform/render_waveform.server";

export const meta: MetaFunction = () => [
  ...getSeo({
    title: "Edit waveform - Waveformr",
    description:
      "Design, and build responsive audio waveform visualizations that you can copy and paste to your site or serve as an image.",
    pathname: "/edit",
  }),
];

export const links: LinksFunction = () => [...getLinks({ pathname: "/edit" })];

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

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const searchParams = new URL(request.url).searchParams;
  const parsed = renderSchema.parse(Object.fromEntries(searchParams.entries()));

  const renderUrl = new URL("/render", publicOrigin(request));
  for (const [key, value] of Object.entries(parsed)) {
    renderUrl.searchParams.set(key, String(value));
  }

  const title = parsed.url.split("/").at(-1) ?? "...";
  const params = schemas.render.safeParse(
    Object.fromEntries(renderUrl.searchParams.entries()),
  );

  if (params.success) {
    try {
      const svg = await renderWaveform(params.data, clientKey(request));
      return defer({
        config: parsed,
        status: "ok",
        svg,
        renderUrl: renderUrl.toString(),
        title,
        svgSize: svgSize(svg),
      } as const);
    } catch (err) {
      console.error(err);
    }
  }

  return {
    status: "error",
    config: parsed,
    svg: null,
    renderUrl: null,
    title,
  } as const;
};

export default function EditRoute() {
  const data = useLoaderData<typeof loader>();
  const [submit, editorState] = useEditorState();

  return (
    <Form
      className="h-full"
      method="GET"
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
    </Form>
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

function useEditorState(): [SubmitFunction, "idle" | "pending" | "error"] {
  const data = useLoaderData<typeof loader>();
  const submit = useSubmit();
  const [state, setState] = useState<"idle" | "pending">("idle");
  const navigation = useNavigation();

  const debouncedSubmit = useDebouncedCallback((form) => {
    submit(form);
    setState("idle");
  }, 100);

  let editorState: "idle" | "pending" | "error" = state;

  if (data.status === "error") {
    editorState = data.status;
  } else if (
    navigation.state === "loading" ||
    navigation.state === "submitting"
  ) {
    editorState = "pending";
  }

  return [debouncedSubmit, editorState];
}
