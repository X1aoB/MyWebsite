import { filterSearchEntries, sourceLabels, type SearchIndexEntry } from "../lib/search";

const indexUrl = "/search-index.json";
let indexPromise: Promise<SearchIndexEntry[]> | undefined;

const labels = {
  zh: {
    placeholder: "搜索文章、摄影、项目…",
    inputLabel: "搜索全站内容",
    clear: "清除搜索",
    suggestions: "搜索建议",
    empty: "没有找到相关公开内容",
    unavailable: "搜索索引暂时不可用",
    search: "搜索全站"
  },
  en: {
    placeholder: "Search posts, photos, projects…",
    inputLabel: "Search the site",
    clear: "Clear search",
    suggestions: "Search suggestions",
    empty: "No matching public content found",
    unavailable: "The search index is temporarily unavailable",
    search: "Search the site"
  }
} as const;

type Locale = keyof typeof labels;

const getLocale = (): Locale => (document.documentElement.dataset.locale === "en" ? "en" : "zh");
const copy = (value: { zh: string; en: string }, locale = getLocale()) => (locale === "en" ? value.en || value.zh : value.zh);

const getIndex = () => {
  if (!indexPromise) {
    indexPromise = fetch(indexUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`Search index request failed: ${response.status}`);
        return response.json() as Promise<SearchIndexEntry[]>;
      })
      .then((index) => (Array.isArray(index) ? index : []));
  }
  return indexPromise;
};

const createSuggestion = (entry: SearchIndexEntry, locale: Locale) => {
  const item = document.createElement("a");
  item.href = entry.url;
  item.className = `preference-search-suggestion is-${entry.source}`;
  item.setAttribute("role", "option");
  item.setAttribute("aria-label", `${copy(sourceLabels[entry.source], locale)}：${copy(entry.title, locale)}`);

  const meta = document.createElement("span");
  meta.className = "preference-search-suggestion-meta";
  const source = document.createElement("span");
  source.className = "preference-search-suggestion-source";
  source.textContent = copy(sourceLabels[entry.source], locale);
  const location = document.createElement("span");
  location.textContent = copy(entry.location, locale);
  meta.append(source, location);

  const title = document.createElement("strong");
  title.textContent = copy(entry.title, locale);
  const description = document.createElement("span");
  description.className = "preference-search-suggestion-description";
  description.textContent = copy(entry.description, locale);

  item.append(meta, title, description);
  return item;
};

export const initializeSiteSearch = () => {
  const form = document.querySelector<HTMLFormElement>("[data-site-search-form]");
  const input = document.querySelector<HTMLInputElement>("[data-site-search-input]");
  const suggestions = document.querySelector<HTMLElement>("[data-site-search-suggestions]");
  const clear = document.querySelector<HTMLButtonElement>("[data-site-search-clear]");
  const toggle = document.querySelector<HTMLButtonElement>("[data-site-search-toggle]");
  const bar = document.querySelector<HTMLElement>("[data-preference-bar]");
  if (!form || !input || !suggestions) return;

  let latestQuery = "";
  let requestId = 0;

  const syncCopy = () => {
    const currentLabels = labels[getLocale()];
    input.placeholder = currentLabels.placeholder;
    input.setAttribute("aria-label", currentLabels.inputLabel);
    suggestions.setAttribute("aria-label", currentLabels.suggestions);
    clear?.setAttribute("aria-label", currentLabels.clear);
    toggle?.setAttribute("aria-label", currentLabels.search);
  };

  const hideSuggestions = () => {
    suggestions.hidden = true;
    suggestions.replaceChildren();
    input.setAttribute("aria-expanded", "false");
  };

  const showSuggestions = (nodes: Node[]) => {
    suggestions.replaceChildren(...nodes);
    suggestions.hidden = false;
    input.setAttribute("aria-expanded", "true");
  };

  const updateSuggestions = async () => {
    const query = input.value.trim();
    latestQuery = query;
    clear && (clear.hidden = !query);
    if (!query) {
      hideSuggestions();
      return;
    }

    const currentRequest = ++requestId;
    try {
      const index = await getIndex();
      if (currentRequest !== requestId || latestQuery !== input.value.trim()) return;
      const results = filterSearchEntries(index, { query }).slice(0, 5);
      const locale = getLocale();
      if (results.length) {
        showSuggestions(results.map((entry) => createSuggestion(entry, locale)));
        return;
      }

      const empty = document.createElement("p");
      empty.className = "preference-search-empty";
      empty.textContent = labels[locale].empty;
      showSuggestions([empty]);
    } catch {
      const unavailable = document.createElement("p");
      unavailable.className = "preference-search-empty";
      unavailable.textContent = labels[getLocale()].unavailable;
      showSuggestions([unavailable]);
    }
  };

  const closeMobileSearch = () => {
    bar?.classList.remove("is-search-open");
    toggle?.setAttribute("aria-expanded", "false");
  };

  const submitSearch = () => {
    const query = input.value.trim();
    const target = query ? `/search/?q=${encodeURIComponent(query)}` : "/search/";
    window.location.assign(target);
  };

  syncCopy();
  input.addEventListener("input", () => void updateSuggestions());
  input.addEventListener("focus", () => {
    if (input.value.trim()) void updateSuggestions();
  });
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      submitSearch();
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      hideSuggestions();
      if (bar?.classList.contains("is-search-open")) {
        closeMobileSearch();
        toggle?.focus();
      }
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    submitSearch();
  });

  clear?.addEventListener("click", () => {
    input.value = "";
    clear.hidden = true;
    hideSuggestions();
    input.focus();
  });

  toggle?.addEventListener("click", () => {
    const open = !bar?.classList.contains("is-search-open");
    bar?.classList.toggle("is-search-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    if (open) {
      window.setTimeout(() => input.focus(), 0);
    } else {
      hideSuggestions();
    }
  });

  document.addEventListener("pointerdown", (event) => {
    if (!form.contains(event.target as Node) && !toggle?.contains(event.target as Node)) hideSuggestions();
  });
  window.addEventListener("site-locale-change", () => {
    syncCopy();
    if (input.value.trim()) void updateSuggestions();
  });
};
