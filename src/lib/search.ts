export const searchSources = ["journal", "gallery", "project", "now", "tool"] as const;

export type SearchSource = (typeof searchSources)[number];

export type SearchLocalizedValue = {
  zh: string;
  en: string;
};

export type SearchIndexEntry = {
  id: string;
  source: SearchSource;
  title: SearchLocalizedValue;
  description: SearchLocalizedValue;
  location: SearchLocalizedValue;
  tags: string[];
  url: string;
  date?: string;
  searchText: string;
};

export type SearchFilters = {
  query?: string;
  source?: SearchSource | "all";
  tag?: string | "all";
};

export const sourceLabels: Record<SearchSource, SearchLocalizedValue> = {
  journal: { zh: "开发日志", en: "Dev log" },
  gallery: { zh: "摄影集", en: "Photography" },
  project: { zh: "项目", en: "Project" },
  now: { zh: "Now", en: "Now" },
  tool: { zh: "工具", en: "Tool" }
};

export const isSearchSource = (value: string): value is SearchSource =>
  (searchSources as readonly string[]).includes(value);

export const normalizeSearchText = (value: string) =>
  value
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/\s+/g, " ")
    .trim();

export const toGalleryHashUrl = (slug: string) => `/gallery/#photo-set-${slug.replace(/[^a-z0-9_-]/gi, "-")}`;

export const isPublicContent = (entry: { data: { draft?: boolean } }) => !entry.data.draft;

export const filterSearchEntries = (entries: readonly SearchIndexEntry[], filters: SearchFilters = {}) => {
  const query = normalizeSearchText(filters.query ?? "");
  const tokens = query ? query.split(" ").filter(Boolean) : [];

  return entries.flatMap((entry, order) => {
    if (filters.source && filters.source !== "all" && entry.source !== filters.source) return [];
    if (filters.tag && filters.tag !== "all" && !entry.tags.includes(filters.tag)) return [];

    const haystack = normalizeSearchText(
      [
        entry.searchText,
        entry.title.zh,
        entry.title.en,
        entry.description.zh,
        entry.description.en,
        entry.location.zh,
        entry.location.en,
        sourceLabels[entry.source].zh,
        sourceLabels[entry.source].en,
        entry.tags.join(" ")
      ].join(" ")
    );

    if (!tokens.every((token) => haystack.includes(token))) return [];
    if (!query) return [{ entry, score: 0, order }];

    const titles = [entry.title.zh, entry.title.en].map(normalizeSearchText);
    const tags = normalizeSearchText(entry.tags.join(" "));
    const description = normalizeSearchText(`${entry.description.zh} ${entry.description.en}`);
    // A title match always outranks a body-only match, independent of publication date.
    const titleScore = titles.some((title) => title === query) ? 1000
      : titles.some((title) => title.startsWith(query)) ? 800
      : titles.some((title) => title.includes(query)) ? 600
      : tokens.every((token) => titles.some((title) => title.includes(token))) ? 400 : 0;
    const detailScore = tokens.reduce((score, token) => score + (tags.includes(token) ? 30 : description.includes(token) ? 10 : 0), 0);
    return [{ entry, score: titleScore + Math.min(detailScore, 99), order }];
  }).sort((a, b) => b.score - a.score || a.order - b.order).map(({ entry }) => entry);
};

export const getSearchTags = (entries: readonly SearchIndexEntry[]) =>
  [...new Set(entries.flatMap((entry) => entry.tags))].sort((a, b) => a.localeCompare(b, "zh-CN"));
