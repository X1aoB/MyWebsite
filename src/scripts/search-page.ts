import {
  filterSearchEntries,
  isSearchSource,
  sourceLabels,
  type SearchIndexEntry
} from "../lib/search";

const labels = {
  zh: {
    allSources: "全部来源",
    allTags: "全部标签",
    resultCount: (count: number) => `找到 ${count} 条公开内容`,
    empty: "没有找到符合当前关键词和筛选条件的公开内容。",
    read: "打开内容",
    tags: "标签"
  },
  en: {
    allSources: "All sources",
    allTags: "All tags",
    resultCount: (count: number) => `${count} public ${count === 1 ? "result" : "results"}`,
    empty: "No public content matches the current query and filters.",
    read: "Open content",
    tags: "Tags"
  }
} as const;

type Locale = keyof typeof labels;

const getLocale = (): Locale => (document.documentElement.dataset.locale === "en" ? "en" : "zh");
const copy = (value: { zh: string; en: string }, locale = getLocale()) => (locale === "en" ? value.en || value.zh : value.zh);

const parseIndex = () => {
  const node = document.querySelector<HTMLScriptElement>("script[data-search-index]");
  if (!node?.textContent) return [] as SearchIndexEntry[];
  try {
    const index = JSON.parse(node.textContent) as unknown;
    return Array.isArray(index) ? (index as SearchIndexEntry[]) : [];
  } catch {
    return [] as SearchIndexEntry[];
  }
};

const formatDate = (value: string, locale: Locale) => {
  const date = new Date(value);
  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "zh-CN", {
    year: "numeric",
    month: locale === "en" ? "short" : "long",
    day: "numeric"
  }).format(date);
};

const createResult = (entry: SearchIndexEntry, locale: Locale) => {
  const article = document.createElement("article");
  article.className = `search-result-card is-${entry.source}`;

  const meta = document.createElement("div");
  meta.className = "search-result-meta";
  const source = document.createElement("span");
  source.className = "search-result-source";
  source.textContent = copy(sourceLabels[entry.source], locale);
  const location = document.createElement("span");
  location.textContent = copy(entry.location, locale);
  meta.append(source, location);
  if (entry.date) {
    const time = document.createElement("time");
    time.dateTime = entry.date;
    time.textContent = formatDate(entry.date, locale);
    meta.append(time);
  }

  const heading = document.createElement("h2");
  const title = document.createElement("a");
  title.href = entry.url;
  title.textContent = copy(entry.title, locale);
  heading.append(title);

  const description = document.createElement("p");
  description.textContent = copy(entry.description, locale);

  const footer = document.createElement("div");
  footer.className = "search-result-footer";
  if (entry.tags.length) {
    const tags = document.createElement("ul");
    tags.className = "search-result-tags";
    tags.setAttribute("aria-label", labels[locale].tags);
    entry.tags.forEach((tag) => {
      const item = document.createElement("li");
      item.textContent = tag;
      tags.append(item);
    });
    footer.append(tags);
  }
  const link = document.createElement("a");
  link.className = "text-link";
  link.href = entry.url;
  link.textContent = labels[locale].read;
  const arrow = document.createElement("span");
  arrow.setAttribute("aria-hidden", "true");
  arrow.textContent = "→";
  link.append(" ", arrow);
  footer.append(link);

  article.append(meta, heading, description, footer);
  return article;
};

export const initializeSearchPage = () => {
  const root = document.querySelector<HTMLElement>("[data-search-page]");
  const form = document.querySelector<HTMLFormElement>("[data-search-results-form]");
  const input = document.querySelector<HTMLInputElement>("[data-search-results-input]");
  const source = document.querySelector<HTMLSelectElement>("[data-search-results-source]");
  const tag = document.querySelector<HTMLSelectElement>("[data-search-results-tag]");
  const summary = document.querySelector<HTMLElement>("[data-search-results-summary]");
  const results = document.querySelector<HTMLElement>("[data-search-results]");
  if (!root || !form || !input || !source || !tag || !summary || !results) return;

  const index = parseIndex();
  const params = new URLSearchParams(window.location.search);
  input.value = params.get("q") ?? "";
  const requestedSource = params.get("source") ?? "all";
  source.value = isSearchSource(requestedSource) ? requestedSource : "all";
  const requestedTag = params.get("tag") ?? "all";
  tag.value = [...tag.options].some((option) => option.value === requestedTag) ? requestedTag : "all";

  const syncOptionCopy = () => {
    const locale = getLocale();
    form.querySelectorAll<HTMLOptionElement>("option[data-zh]").forEach((option) => {
      option.textContent = locale === "en" ? option.dataset.en || option.dataset.zh || "" : option.dataset.zh || "";
    });
  };

  const render = (syncUrl = false) => {
    const query = input.value.trim();
    const sourceValue = source.value;
    const tagValue = tag.value;
    const matches = filterSearchEntries(index, {
      query,
      source: isSearchSource(sourceValue) ? sourceValue : "all",
      tag: tagValue || "all"
    });
    const locale = getLocale();
    summary.textContent = labels[locale].resultCount(matches.length);
    results.replaceChildren();

    if (matches.length) {
      results.append(...matches.map((entry) => createResult(entry, locale)));
    } else {
      const empty = document.createElement("p");
      empty.className = "search-results-empty";
      empty.textContent = labels[locale].empty;
      results.append(empty);
    }

    if (syncUrl) {
      const next = new URLSearchParams();
      if (query) next.set("q", query);
      if (sourceValue !== "all") next.set("source", sourceValue);
      if (tagValue && tagValue !== "all") next.set("tag", tagValue);
      const queryString = next.toString();
      window.history.replaceState(null, "", `${window.location.pathname}${queryString ? `?${queryString}` : ""}`);
    }
  };

  syncOptionCopy();
  render();
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (composing) return;
    render(true);
  });
  let composing = false;
  input.addEventListener("compositionstart", () => { composing = true; });
  input.addEventListener("compositionend", () => { composing = false; render(true); });
  input.addEventListener("input", () => { if (!composing) render(true); });
  source.addEventListener("change", () => render(true));
  tag.addEventListener("change", () => render(true));
  window.addEventListener("site-locale-change", () => {
    syncOptionCopy();
    render();
  });
};
