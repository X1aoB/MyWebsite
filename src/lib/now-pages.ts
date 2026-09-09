import type { NowItem, NowSection } from "../config/now";

type JournalReference = { id: string; data: { title: string; description: string; pubDate: Date; draft?: boolean } };
export type NowArticleSummary = {
  id: string;
  source: "now" | "journal";
  url: string;
  title: NowItem["title"];
  description: NowItem["description"];
  publishedAt: string;
  includeTime: boolean;
};

export const nowSectionUrl = (slug: string) => `/now/${encodeURIComponent(slug)}/`;
export const nowArticleUrl = (section: string, slug: string) => `${nowSectionUrl(section)}${encodeURIComponent(slug)}/`;
export const nowExcerpt = (text: string) => text.split(/\r?\n\s*\r?\n/)[0].trim();
/** Journal references point to their canonical article instead of copying content. */
export const getNowArticleSummaries = (section: NowSection, posts: readonly JournalReference[] = []): NowArticleSummary[] => {
  const notes: NowArticleSummary[] = section.items.map((item) => ({
    id: item.slug, source: "now", url: nowArticleUrl(section.slug, item.slug), title: item.title,
    description: { zh: nowExcerpt(item.description.zh), en: nowExcerpt(item.description.en) },
    publishedAt: item.publishedAt, includeTime: true
  }));
  for (const id of new Set(section.journalIds ?? [])) {
    const post = posts.find((entry) => entry.id === id && !entry.data.draft);
    if (!post) continue;
    notes.push({
      id: `journal:${id}`, source: "journal", url: `/journal/${id}/`,
      title: { zh: post.data.title, en: post.data.title },
      description: { zh: post.data.description, en: post.data.description },
      publishedAt: post.data.pubDate.toISOString(), includeTime: false
    });
  }
  return notes.sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt) || a.id.localeCompare(b.id));
};
export const nowArticlePaths = (sections: readonly NowSection[]) => sections.flatMap((section) =>
  section.items.map((item) => ({
    params: { section: section.slug, slug: item.slug },
    props: { section, item }
  }))
);
export const formatNowDateTime = (date: string, locale: "zh-CN" | "en-US", includeTime = true) =>
  new Intl.DateTimeFormat(locale, {
    timeZone: "Asia/Shanghai",
    year: "numeric", month: "2-digit", day: "2-digit",
    ...(includeTime ? { hour: "2-digit" as const, minute: "2-digit" as const, second: "2-digit" as const, hour12: false } : {})
  }).format(new Date(date));
