import { filterSearchEntries, sourceLabels, type SearchIndexEntry } from "../lib/search";
import { createSearchIndexLoader } from "../lib/search-index-loader";
import "../styles/search-enhancements.css";

const getIndex = createSearchIndexLoader();
const labels = {
  zh: {
    placeholder: "搜索文章、摄影、工具…", inputLabel: "搜索全站内容", clear: "清除搜索",
    suggestions: "搜索建议", empty: "没有找到相关内容，试试更短的关键词。",
    unavailable: "搜索暂时不可用，点击重试", loading: "正在读取搜索索引…", search: "搜索全站",
    all: (count: number) => `查看全部 ${count} 条结果 →`, count: (count: number) => `${count} 条结果，可用上下方向键选择。`
  },
  en: {
    placeholder: "Search posts, photos, tools…", inputLabel: "Search the site", clear: "Clear search",
    suggestions: "Search suggestions", empty: "No matches. Try a shorter keyword.",
    unavailable: "Search unavailable. Select to retry", loading: "Loading the search index…", search: "Search the site",
    all: (count: number) => `View all ${count} results →`, count: (count: number) => `${count} results. Use the up and down arrow keys to choose.`
  }
} as const;
type Locale = keyof typeof labels;
const getLocale = (): Locale => document.documentElement.dataset.locale === "en" ? "en" : "zh";
const copy = (value: { zh: string; en: string }, locale = getLocale()) => locale === "en" ? value.en || value.zh : value.zh;

const createSuggestion = (entry: SearchIndexEntry, locale: Locale) => {
  const item = document.createElement("a");
  item.href = entry.url;
  item.className = `preference-search-suggestion is-${entry.source}`;
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
  if (!form || !input || !suggestions || form.dataset.searchInitialized) return;
  form.dataset.searchInitialized = "true";
  form.action = "/search/";
  form.method = "get";

  const announcement = document.createElement("span");
  announcement.className = "sr-only";
  announcement.setAttribute("role", "status");
  announcement.setAttribute("aria-live", "polite");
  announcement.setAttribute("aria-atomic", "true");
  form.append(announcement);

  let requestId = 0;
  let composing = false;
  let activeIndex = -1;
  let options: HTMLElement[] = [];
  let returnFocus: HTMLElement | null = null;
  const mobile = window.matchMedia("(max-width: 760px)");
  const syncMobileSearch = () => { form.inert = mobile.matches && !bar?.classList.contains("is-search-open"); };
  const searchUrl = () => input.value.trim() ? `/search/?q=${encodeURIComponent(input.value.trim())}` : "/search/";

  const syncCopy = () => {
    const current = labels[getLocale()];
    input.placeholder = current.placeholder;
    input.setAttribute("aria-label", current.inputLabel);
    suggestions.setAttribute("aria-label", current.suggestions);
    clear?.setAttribute("aria-label", current.clear);
    toggle?.setAttribute("aria-label", current.search);
  };
  const selectOption = (index: number) => {
    activeIndex = index;
    options.forEach((option, optionIndex) => option.setAttribute("aria-selected", String(optionIndex === index)));
    if (options[index]) {
      input.setAttribute("aria-activedescendant", options[index].id);
      options[index].scrollIntoView({ block: "nearest", behavior: "instant" });
    } else input.removeAttribute("aria-activedescendant");
  };
  const hideSuggestions = () => {
    requestId += 1;
    suggestions.hidden = true;
    // Preserve the painted results for the fade-out, but dismiss them immediately
    // for keyboard interaction and assistive technology. A new request replaces them.
    suggestions.inert = true;
    suggestions.setAttribute("aria-hidden", "true");
    suggestions.removeAttribute("aria-busy");
    input.setAttribute("aria-expanded", "false");
    options = [];
    selectOption(-1);
    announcement.textContent = "";
  };
  const showOptions = (nodes: HTMLElement[], message: string) => {
    options = nodes.filter((node) => node.getAttribute("aria-disabled") !== "true");
    nodes.forEach((node, index) => {
      node.id = `site-search-option-${index}`;
      node.tabIndex = -1;
      node.setAttribute("role", "option");
      node.setAttribute("aria-selected", "false");
      node.addEventListener("pointerdown", (event) => event.preventDefault());
      node.addEventListener("pointermove", () => selectOption(options.indexOf(node)));
    });
    suggestions.replaceChildren(...nodes);
    suggestions.hidden = false;
    suggestions.inert = false;
    suggestions.removeAttribute("aria-hidden");
    suggestions.removeAttribute("aria-busy");
    input.setAttribute("aria-expanded", "true");
    selectOption(-1);
    announcement.textContent = message;
  };

  const updateSuggestions = async () => {
    const query = input.value.trim();
    if (clear) clear.hidden = !query;
    if (!query || composing || document.activeElement !== input) {
      hideSuggestions();
      return;
    }
    const currentRequest = ++requestId;
    const isCurrent = () => currentRequest === requestId && input.value.trim() === query && document.activeElement === input && !composing;
    const loading = document.createElement("p");
    loading.className = "preference-search-empty";
    loading.setAttribute("aria-disabled", "true");
    loading.textContent = labels[getLocale()].loading;
    showOptions([loading], loading.textContent);
    suggestions.setAttribute("aria-busy", "true");
    try {
      const index = await getIndex();
      if (!isCurrent()) return;
      const matches = filterSearchEntries(index, { query });
      const locale = getLocale();
      if (matches.length) {
        const nodes: HTMLElement[] = matches.slice(0, 5).map((entry) => createSuggestion(entry, locale));
        const all = document.createElement("a");
        all.href = searchUrl();
        all.className = "preference-search-suggestion preference-search-view-all";
        all.textContent = labels[locale].all(matches.length);
        nodes.push(all);
        showOptions(nodes, labels[locale].count(matches.length));
      } else {
        const empty = document.createElement("p");
        empty.className = "preference-search-empty";
        empty.setAttribute("aria-disabled", "true");
        empty.textContent = labels[locale].empty;
        showOptions([empty], empty.textContent);
      }
    } catch {
      if (!isCurrent()) return;
      const retry = document.createElement("button");
      retry.type = "button";
      retry.className = "preference-search-suggestion preference-search-retry";
      retry.textContent = labels[getLocale()].unavailable;
      retry.addEventListener("click", () => { input.focus(); void updateSuggestions(); });
      showOptions([retry], retry.textContent);
    }
  };

  const openSearch = () => {
    if (document.activeElement instanceof HTMLElement && document.activeElement !== input) returnFocus = document.activeElement;
    bar?.classList.add("is-search-open");
    syncMobileSearch();
    toggle?.setAttribute("aria-expanded", "true");
    window.dispatchEvent(new CustomEvent("site-search-open"));
    input.focus({ preventScroll: true });
    input.select();
    if (document.activeElement !== input) {
      requestAnimationFrame(() => {
        if (!bar?.classList.contains("is-search-open") || document.activeElement === input) return;
        input.focus({ preventScroll: true });
        input.select();
      });
    }
  };
  const closeSearch = (restoreFocus = true) => {
    hideSuggestions();
    bar?.classList.remove("is-search-open");
    syncMobileSearch();
    toggle?.setAttribute("aria-expanded", "false");
    if (restoreFocus) {
      if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
      else toggle?.focus({ preventScroll: true });
    }
    returnFocus = null;
    window.dispatchEvent(new CustomEvent("site-search-close"));
  };

  syncCopy();
  syncMobileSearch();
  hideSuggestions();
  mobile.addEventListener("change", syncMobileSearch);
  window.addEventListener("site-search-dismiss", () => closeSearch(false));
  input.addEventListener("compositionstart", () => { composing = true; hideSuggestions(); });
  input.addEventListener("compositionend", () => { composing = false; void updateSuggestions(); });
  input.addEventListener("input", () => { if (!composing) void updateSuggestions(); });
  input.addEventListener("focus", () => { if (input.value.trim()) void updateSuggestions(); });
  input.addEventListener("keydown", (event) => {
    if (composing || event.isComposing || event.key === "Process") return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      if (!options.length) { if (suggestions.hidden) void updateSuggestions(); return; }
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      selectOption(activeIndex < 0 ? (direction > 0 ? 0 : options.length - 1) : (activeIndex + direction + options.length) % options.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (activeIndex >= 0 && options[activeIndex]) options[activeIndex].click();
      else window.location.assign(searchUrl());
    } else if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      if (!suggestions.hidden) hideSuggestions();
      else closeSearch();
    } else if (event.key === "Tab") hideSuggestions();
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!composing) window.location.assign(searchUrl());
  });
  clear?.addEventListener("click", () => {
    input.value = "";
    clear.hidden = true;
    hideSuggestions();
    input.focus();
  });
  toggle?.addEventListener("click", () => bar?.classList.contains("is-search-open") ? closeSearch() : openSearch());
  document.querySelectorAll<HTMLAnchorElement>("[data-search-launch]").forEach((launch) => launch.addEventListener("click", (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    openSearch();
  }));
  document.addEventListener("keydown", (event) => {
    if (!(event.ctrlKey || event.metaKey) || event.altKey || event.shiftKey || event.key.toLowerCase() !== "k" || event.isComposing) return;
    const target = event.target instanceof HTMLElement ? event.target : null;
    if (target !== input && target?.closest("input, textarea, select, [contenteditable]:not([contenteditable='false'])")) return;
    if (document.querySelector("dialog[open]")) return;
    event.preventDefault();
    openSearch();
  });
  document.addEventListener("pointerdown", (event) => {
    if (!form.contains(event.target as Node) && !toggle?.contains(event.target as Node)) hideSuggestions();
  });
  form.addEventListener("focusout", (event) => {
    if (!form.contains(event.relatedTarget as Node)) hideSuggestions();
  });
  window.addEventListener("site-locale-change", () => {
    syncCopy();
    if (input.value.trim() && document.activeElement === input) void updateSuggestions();
  });
};
