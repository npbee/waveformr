import type { APIRoute } from "astro";

let ANALYSIS_URL = import.meta.env.ANALYSIS_URL;

export const post: APIRoute = async function post({ request }) {
  let result = await fetch(ANALYSIS_URL, request);
  let json = await result.json();

  return new Response(JSON.stringify(json), {
    status: 200,
  });
};
