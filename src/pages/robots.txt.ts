import type { APIRoute } from "astro";
import { site } from "../config/site";

export const prerender = true;

export const GET: APIRoute = () => {
  const sitemapUrl = new URL("/sitemap.xml", site.url).toString();
  const body = [
    "User-agent: *",
    "Allow: /",
    "# Search pages declare noindex in their HTML metadata.",
    "Disallow: /search-index.json",
    `Sitemap: ${sitemapUrl}`
  ].join("\n");

  return new Response(`${body}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, must-revalidate"
    }
  });
};
