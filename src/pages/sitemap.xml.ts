import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { site } from "../config/site";
import { projectSnowRecord } from "../lib/project-snow";

export const prerender = true;

const escapeXml = (value: string) =>
  value.replace(/[<>&'\"]/g, (character) => {
    const entities: Record<string, string> = {
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
      "'": "&apos;",
      '"': "&quot;"
    };
    return entities[character];
  });

const absoluteUrl = (path: string) => new URL(path, site.url).toString();
const contentPath = (collection: string, id: string) =>
  `/${collection}/${id.split("/").map((segment) => encodeURIComponent(segment)).join("/")}/`;
const dateValue = (date: Date | string) => new Date(date).toISOString().slice(0, 10);

interface SitemapEntry {
  path: string;
  lastmod?: string;
}

export const GET: APIRoute = async () => {
  const [posts, projects] = await Promise.all([
    getCollection("blog", ({ data }) => !data.draft),
    getCollection("projects", ({ data }) => !data.draft)
  ]);

  const entries: SitemapEntry[] = [
    { path: "/" },
    { path: "/journal/" },
    { path: "/projects/project-snow/", lastmod: projectSnowRecord.updatedAt },
    { path: "/tools/" },
    { path: "/tools/model-iq/" },
    { path: "/gallery/" },
    { path: "/now/" },
    { path: "/about/" },
    { path: "/updates/" },
    { path: "/privacy/" },
    ...posts.map((post) => ({
      path: contentPath("journal", post.id),
      lastmod: dateValue(post.data.pubDate)
    })),
    ...projects.map((project) => ({
      path: contentPath("projects", project.id),
      lastmod: dateValue(project.data.updatedAt)
    }))
  ];

  const uniqueEntries = Array.from(new Map(entries.map((entry) => [entry.path, entry])).values());
  const urls = uniqueEntries
    .map(({ path, lastmod }) => {
      const lastmodTag = lastmod ? `\n    <lastmod>${escapeXml(lastmod)}</lastmod>` : "";
      return `  <url>\n    <loc>${escapeXml(absoluteUrl(path))}</loc>${lastmodTag}\n  </url>`;
    })
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, must-revalidate"
    }
  });
};
