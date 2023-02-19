import type { APIRoute } from "astro";

let ANALYSIS_URL = import.meta.env.ANALYSIS_URL;
let API_KEY = import.meta.env.API_KEY;

export const post: APIRoute = async function post({ request }) {
  let analysisReq = new Request(request);

  analysisReq.headers.set(`Authorization`, `Bearer ${API_KEY}`);

  let resp = await fetch(ANALYSIS_URL, analysisReq);

  if (resp.ok) {
    let json = await resp.json();

    return new Response(JSON.stringify(json), {
      status: 200,
    });
  } else if (resp.status === 401) {
    return new Response(
      JSON.stringify({ status: "error", message: "Unauthorized" }),
      {
        status: 401,
      }
    );
  } else {
    return new Response(
      JSON.stringify({ status: "error", message: "Unknown error" }),
      {
        status: 401,
      }
    );
  }
};
