export const searchSources = ["journal", "gallery", "project", "now"] as const;

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
  date: string;
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
  now: { zh: "Now", en: "Now" }
};

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

  return entries.filter((entry) => {
    if (filters.source && filters.source !== "all" && entry.source !== filters.source) return false;
    if (filters.tag && filters.tag !== "all" && !entry.tags.includes(filters.tag)) return false;

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

    return tokens.every((token) => haystack.includes(token));
  });
};

export const getSearchTags = (entries: readonly SearchIndexEntry[]) =>
  [...new Set(entries.flatMap((entry) => entry.tags))].sort((a, b) => a.localeCompare(b, "zh-CN"));
