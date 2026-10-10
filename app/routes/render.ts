import { createFileRoute } from "@tanstack/react-router";
import { handleRender } from "~/waveform/render_waveform.server";

export const Route = createFileRoute("/render")({
  server: {
    handlers: {
      GET: ({ request }) => handleRender(request),
    },
  },
});
