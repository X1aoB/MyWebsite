import { isSearchSource, type SearchIndexEntry } from "./search";

const localized = (value: unknown) => {
  if (!value || typeof value !== "object") return false;
  const copy = value as Record<string, unknown>;
  return typeof copy.zh === "string" && typeof copy.en === "string";
};

const validEntry = (value: unknown): value is SearchIndexEntry => {
  if (!value || typeof value !== "object") return false;
  const entry = value as Record<string, unknown>;
  return typeof entry.id === "string" && typeof entry.source === "string" && isSearchSource(entry.source)
    && localized(entry.title) && localized(entry.description) && localized(entry.location)
    && typeof entry.url === "string" && entry.url.startsWith("/") && !entry.url.startsWith("//") && !entry.url.includes("\\")
    && typeof entry.searchText === "string" && Array.isArray(entry.tags) && entry.tags.every((tag) => typeof tag === "string")
    && (entry.date === undefined || (typeof entry.date === "string" && !Number.isNaN(Date.parse(entry.date))));
};

/** Share in-flight work, retain successful data, and allow an explicit retry after failure. */
export const createSearchIndexLoader = (request: typeof fetch = fetch, timeoutMs = 8000) => {
  let pending: Promise<SearchIndexEntry[]> | undefined;
  return (): Promise<SearchIndexEntry[]> => {
    if (pending) return pending;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    pending = request("/search-index.json", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Search index request failed: ${response.status}`);
        const index: unknown = await response.json();
        if (!Array.isArray(index) || !index.every(validEntry)) throw new Error("Invalid search index");
        return index;
      })
      .catch((error: unknown) => {
        pending = undefined;
        throw error;
      })
      .finally(() => clearTimeout(timer));
    return pending;
  };
};
