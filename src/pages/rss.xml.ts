import type { APIRoute } from "astro";
import { site } from "../config/site";
import { buildRssXml } from "../lib/rss";
import { getUpdates } from "../lib/updates";

export const prerender = true;

export const GET: APIRoute = async () => {
  const updates = await getUpdates();
  const xml = buildRssXml({
    siteUrl: site.url,
    siteName: site.name,
    siteDescription: site.description,
    updates
  });

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate"
    }
  });
};

