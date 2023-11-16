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
import invariant from "tiny-invariant";
import { svgSize } from "~/utils.server";
import { SvgSize } from "~/components/file-size";

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

  const API_URL = process.env.API_URL;
  invariant(API_URL, "Expected API_URL in environment");
  const renderUrl = new URL(`/render`, API_URL);
  renderUrl.searchParams.set("url", parsed.url);

  for (const [key, value] of Object.entries(parsed)) {
    renderUrl.searchParams.set(key, String(value));
  }

  const svgResp = await fetch(renderUrl);
  const title = parsed.url.split("/").at(-1) ?? "...";

  if (svgResp.ok) {
    const svg = await svgResp.text();
    return defer({
      config: parsed,
      status: "ok",
      svg,
      renderUrl,
      title,
      svgSize: svgSize(svg),
    } as const);
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
