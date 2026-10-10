import type { LoaderFunctionArgs } from "@remix-run/node";
import { handleRender } from "~/waveform/render_waveform.server";

export const loader = ({ request }: LoaderFunctionArgs) =>
  handleRender(request);
