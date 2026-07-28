import type { APIRoute } from "astro";
import { buildContentIndex } from "../lib/content-index";

export const prerender = true;

export const GET: APIRoute = async () => {
  const index = await buildContentIndex();

  return new Response(JSON.stringify(index), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate"
    }
  });
};

