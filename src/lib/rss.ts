import type { UpdateItem } from "./update-types";

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const absoluteUrl = (siteUrl: string, path: string) => new URL(path, siteUrl).toString();

const localized = (value: { zh: string; en: string }) => value.zh || value.en;

export const buildRssXml = ({
  siteUrl,
  siteName,
  siteDescription,
  updates
}: {
  siteUrl: string;
  siteName: string;
  siteDescription: string;
  updates: readonly UpdateItem[];
}) => {
  const safeSiteUrl = new URL(siteUrl).toString();
  const items = updates
    .map((update) => {
      const link = absoluteUrl(safeSiteUrl, update.url);
      const description = [localized(update.description), localized(update.location), update.tags.join(" · ")]
        .filter(Boolean)
        .join(" — ");

      return `    <item>\n      <title>${escapeXml(localized(update.title))}</title>\n      <link>${escapeXml(link)}</link>\n      <guid isPermaLink="true">${escapeXml(link)}</guid>\n      <pubDate>${update.date.toUTCString()}</pubDate>\n      <description>${escapeXml(description)}</description>\n      <category>${escapeXml(localized(update.sourceLabel))}</category>\n    </item>`;
    })
    .join("\n");
  const lastBuildDate = updates[0]?.date.toUTCString() ?? new Date("2026-01-01T00:00:00.000Z").toUTCString();

  return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>${escapeXml(siteName)}</title>\n    <link>${escapeXml(safeSiteUrl)}</link>\n    <description>${escapeXml(siteDescription)}</description>\n    <language>zh-CN</language>\n    <lastBuildDate>${lastBuildDate}</lastBuildDate>\n${items}\n  </channel>\n</rss>\n`;
};
