type Locale = "zh" | "en";
type Theme = "ice" | "holo";

const themeStorageKey = "x1ao-theme";
const localeStorageKey = "x1ao-locale";
let themeTransitionSequence = 0;
let themeTransitionTimer: number | undefined;

let translations: Record<string, string> = {};
let titleTranslations: Record<string, string> = {};
let translationLoad: Promise<void> | undefined;
let localeSequence = 0;
let appliedLocale: Locale = "zh";

const originalTexts = new WeakMap<Text, string>();
const originalAttributes = new WeakMap<Element, Map<string, string>>();
let translatedNodes: Text[] | undefined;

const getStoredPreference = <T extends string>(key: string, fallback: T, allowed: readonly T[]): T => {
  try {
    const value = window.localStorage.getItem(key);
    return value && allowed.includes(value as T) ? (value as T) : fallback;
  } catch {
    return fallback;
  }
};

const savePreference = (key: string, value: string) => {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // A private or restricted browser may deny persistence; the current page still works.
  }
};

const translateValue = (value: string, locale: Locale) => {
  if (locale === "zh") return value;
  const direct = translations[value];
  if (direct) return direct;

  const photoMatch = value.match(/^查看「(.+)」大图$/);
  if (photoMatch) return `View “${translations[photoMatch[1]] || photoMatch[1]}” full size`;

  const readMatch = value.match(/^阅读：(.+)$/);
  if (readMatch) return `Read: ${translations[readMatch[1]] || readMatch[1]}`;

  const countMatch = value.match(/^当前 (\d+) 张作品$/);
  if (countMatch) return `${countMatch[1]} archived works`;

  const setSummaryMatch = value.match(/^当前 (\d+) 组套图，共 (\d+) 个画面$/);
  if (setSummaryMatch) {
    const setLabel = setSummaryMatch[1] === "1" ? "photo set" : "photo sets";
    const frameLabel = setSummaryMatch[2] === "1" ? "image" : "images";
    return `${setSummaryMatch[1]} ${setLabel}, ${setSummaryMatch[2]} ${frameLabel}`;
  }

  const photoCountMatch = value.match(/^(\d+) 张照片$/);
  if (photoCountMatch) return `${photoCountMatch[1]} photos`;

  const frameCountMatch = value.match(/^(\d+) 张$/);
  if (frameCountMatch) return `${frameCountMatch[1]} photos`;

  const storyLabelMatch = value.match(/^(.+) 的照片与说明$/);
  if (storyLabelMatch) return `${translations[storyLabelMatch[1]] || storyLabelMatch[1]} — photos & notes`;

  const imageLabelMatch = value.match(/^(.+) 的影像$/);
  if (imageLabelMatch) return `${translations[imageLabelMatch[1]] || imageLabelMatch[1]} — images`;

  const openPhotoSetMatch = value.match(/^打开套图：(.+)$/);
  if (openPhotoSetMatch) return `Open photo set: ${translations[openPhotoSetMatch[1]] || openPhotoSetMatch[1]}`;

  const closePhotoSetMatch = value.match(/^关闭套图：(.+)$/);
  if (closePhotoSetMatch) return `Close photo set: ${translations[closePhotoSetMatch[1]] || closePhotoSetMatch[1]}`;

  return value;
};

const isTranslatableText = (node: Text) => {
  const parent = node.parentElement;
  if (!parent || parent.closest("[data-no-translate], [data-localized-text], [lang='zh-CN']")) return false;
  return !["SCRIPT", "STYLE", "TEXTAREA", "CODE", "PRE"].includes(parent.tagName);
};

const applyTextTranslations = (locale: Locale) => {
  if (!translatedNodes) {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    translatedNodes = [];
    let node = walker.nextNode();
    while (node) {
      if (node instanceof Text && isTranslatableText(node)) translatedNodes.push(node);
      node = walker.nextNode();
    }
  }
  const nodes = translatedNodes.filter((node) => node.isConnected);

  nodes.forEach((node) => {
    const original = originalTexts.get(node) ?? node.nodeValue ?? "";
    if (!originalTexts.has(node)) originalTexts.set(node, original);
    const compact = original.trim();
    if (!compact) return;
    const translated = translateValue(compact, locale);
    const next = original.replace(compact, translated);
    if (node.nodeValue !== next) node.nodeValue = next;
  });
};

const applyLocalizedText = (locale: Locale) => {
  document.querySelectorAll<HTMLElement>("[data-localized-text]").forEach((element) => {
    const zh = element.dataset.zh ?? element.textContent ?? "";
    const en = element.dataset.en ?? zh;
    const next = locale === "en" ? en : zh;
    if (element.textContent !== next) element.textContent = next;
  });
};

const applyAttributeTranslations = (locale: Locale) => {
  document.querySelectorAll<HTMLElement>("[aria-label], [placeholder], [title], [alt]").forEach((element) => {
    const attributes = ["aria-label", "placeholder", "title", "alt"];
    let originals = originalAttributes.get(element);
    if (!originals) {
      originals = new Map<string, string>();
      originalAttributes.set(element, originals);
    }

    attributes.forEach((attribute) => {
      const current = element.getAttribute(attribute);
      if (current === null) return;
      const original = originals?.get(attribute) ?? current;
      if (!originals?.has(attribute)) originals?.set(attribute, original);
      const next = translateValue(original, locale);
      if (current !== next) element.setAttribute(attribute, next);
    });
  });
};

const applyDateLocale = (locale: Locale) => {
  document.querySelectorAll<HTMLTimeElement>("time[datetime]").forEach((time) => {
    if (time.querySelector("[data-localized-text]")) return;
    const original = time.dataset.originalText ?? time.textContent ?? "";
    if (!time.dataset.originalText) time.dataset.originalText = original;
    if (locale === "zh") {
      time.textContent = original;
      return;
    }

    const date = new Date(time.dateTime);
    if (!Number.isNaN(date.valueOf())) {
      time.textContent = new Intl.DateTimeFormat("en-US", {
        timeZone: "UTC",
        year: "numeric",
        month: "short",
        day: "numeric"
      }).format(date);
    }
  });
};

const updateThemeControls = (theme: Theme) => {
  document.querySelectorAll<HTMLButtonElement>("[data-theme-choice]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.themeChoice === theme));
  });
};

const updateLocaleControls = (locale: Locale) => {
  document.querySelectorAll<HTMLButtonElement>("[data-locale-choice]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.localeChoice === locale));
  });
};

const loadThemeArtwork = (theme: Theme) => {
  document.querySelectorAll<HTMLImageElement>(`[data-theme-image="${theme}"]`).forEach((image) => {
    const source = image.dataset.src;
    if (source && image.getAttribute("src") !== source) image.setAttribute("src", source);
    const srcset = image.dataset.srcset;
    if (srcset && image.getAttribute("srcset") !== srcset) image.setAttribute("srcset", srcset);
    if (source) {
      image.loading = "eager";
      image.setAttribute("fetchpriority", "high");
    }
  });
};

const updateLocale = async (requestedLocale: Locale) => {
  const sequence = ++localeSequence;
  let locale = requestedLocale;
  const status = document.querySelector<HTMLElement>("[data-preference-status]");
  if (locale === "en") {
    try {
      translationLoad ??= import("./locale-translations").then((module) => {
        translations = module.translations;
        titleTranslations = module.titleTranslations;
      });
      await translationLoad;
    } catch {
      translationLoad = undefined;
      if (sequence !== localeSequence) return;
      locale = "zh";
      if (status) status.textContent = "语言资源加载失败，请稍后重试。 / Could not load English. Please try again.";
    }
  }
  if (sequence !== localeSequence) return;
  const root = document.documentElement;
  root.dataset.locale = locale;
  root.lang = locale === "en" ? "en" : "zh-CN";
  if (locale !== appliedLocale) {
    applyTextTranslations(locale);
    applyLocalizedText(locale);
    applyAttributeTranslations(locale);
    applyDateLocale(locale);
    appliedLocale = locale;
  }
  updateLocaleControls(locale);
  const originalTitle = root.dataset.documentTitle || document.title;
  document.title = locale === "en" ? titleTranslations[originalTitle] || originalTitle : originalTitle;
  savePreference(localeStorageKey, locale);
  window.dispatchEvent(new CustomEvent("site-locale-change", { detail: { locale } }));
};

const updateTheme = (theme: Theme, origin?: HTMLElement) => {
  const root = document.documentElement;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const themeChanged = root.dataset.theme !== theme;
  loadThemeArtwork(theme);
  const applyTheme = () => {
    root.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "holo" ? "#f3d394" : "#eaf6ff");
    document.querySelectorAll<HTMLElement>("[data-theme-image]").forEach((image) => {
      image.setAttribute("aria-hidden", String(image.dataset.themeImage !== theme));
    });
    const captions = document.querySelectorAll<HTMLElement>(".character-art-caption");
    captions.forEach((caption) => {
      const active = caption.classList.contains(`character-art-caption-${theme}`);
      caption.setAttribute("aria-hidden", String(!active));
      if (active) caption.closest("figure")?.setAttribute("aria-label", caption.textContent || "");
    });
  };

  updateThemeControls(theme);
  savePreference(themeStorageKey, theme);

  if (origin && themeChanged && !prefersReducedMotion) {
    const transitionSequence = ++themeTransitionSequence;
    const rect = origin.getBoundingClientRect();
    root.style.setProperty("--theme-origin-x", `${rect.left + rect.width / 2}px`);
    root.style.setProperty("--theme-origin-y", `${rect.top + rect.height / 2}px`);
    root.dataset.themeTarget = theme;
    root.classList.remove("is-theme-transitioning");
    if (themeTransitionTimer !== undefined) window.clearTimeout(themeTransitionTimer);

    requestAnimationFrame(() => {
      if (transitionSequence !== themeTransitionSequence) return;
      root.classList.add("is-theme-transitioning");
      requestAnimationFrame(() => {
        if (transitionSequence !== themeTransitionSequence) return;
        applyTheme();
      });
    });

    themeTransitionTimer = window.setTimeout(() => {
      if (transitionSequence !== themeTransitionSequence) return;
      root.classList.remove("is-theme-transitioning");
      delete root.dataset.themeTarget;
      root.style.removeProperty("--theme-origin-x");
      root.style.removeProperty("--theme-origin-y");
    }, 1080);
    return;
  }

  themeTransitionSequence += 1;
  if (themeTransitionTimer !== undefined) window.clearTimeout(themeTransitionTimer);
  root.classList.remove("is-theme-transitioning");
  delete root.dataset.themeTarget;
  applyTheme();
};

const initializePreferenceBar = () => {
  const root = document.documentElement;
  const bar = document.querySelector<HTMLElement>("[data-preference-bar]");
  const sidebar = document.querySelector<HTMLElement>("[data-site-header]");
  const controls = document.querySelector<HTMLElement>("#preference-controls");
  const triggers = [...document.querySelectorAll<HTMLButtonElement>("[data-preference-trigger]")];
  const mobile = window.matchMedia("(max-width: 760px)");
  if (!bar) return;
  let settingsOpen = false;
  let previousTrigger: HTMLElement | null = null;
  const setVisible = (visible: boolean, settings = false) => {
    settingsOpen = visible && settings;
    root.classList.toggle("topbar-visible", visible);
    sidebar?.classList.toggle("settings-open", settingsOpen);
    bar.inert = mobile.matches ? false : !visible;
    if (controls) controls.inert = mobile.matches ? !settingsOpen : !visible;
    if (sidebar) { sidebar.inert = false; sidebar.classList.remove("mobile-bar-hidden"); }
    triggers.forEach((trigger) => trigger.setAttribute("aria-expanded", String(settingsOpen)));
  };
  const closeMenu = () => {
    sidebar?.classList.remove("menu-open");
    sidebar?.querySelector("[data-menu-toggle]")?.setAttribute("aria-expanded", "false");
  };
  triggers.forEach((trigger) => trigger.addEventListener("click", () => {
    previousTrigger = trigger;
    const next = !settingsOpen;
    window.dispatchEvent(new CustomEvent("site-search-dismiss"));
    closeMenu();
    bar.classList.remove("is-search-open");
    bar.querySelector("[data-site-search-toggle]")?.setAttribute("aria-expanded", "false");
    setVisible(next, next);
    if (next) bar.querySelector<HTMLButtonElement>("[data-theme-choice]")?.focus({ preventScroll: true });
  }));
  window.addEventListener("site-search-open", () => {
    previousTrigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeMenu();
    setVisible(true);
  });
  window.addEventListener("site-search-close", () => setVisible(false));
  const dismissPanels = () => {
    window.dispatchEvent(new CustomEvent("site-search-dismiss"));
    setVisible(false);
  };
  sidebar?.querySelector("[data-menu-toggle]")?.addEventListener("click", dismissPanels);
  window.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || event.defaultPrevented || document.querySelector("dialog[open]")) return;
    if (root.classList.contains("topbar-visible")) {
      window.dispatchEvent(new CustomEvent("site-search-dismiss"));
      setVisible(false);
      bar.classList.remove("is-search-open");
      bar.querySelector("[data-site-search-toggle]")?.setAttribute("aria-expanded", "false");
      previousTrigger?.focus();
    }
  });
  document.addEventListener("pointerdown", (event) => {
    const target = event.target as Node;
    if (!bar.contains(target) && !triggers.some((trigger) => trigger.contains(target))) dismissPanels();
  });
  mobile.addEventListener("change", dismissPanels);
  // Keep the original desktop top-edge access without adding sidebar controls.
  document.addEventListener("pointermove", (event) => {
    if (mobile.matches || document.querySelector("dialog[open]")) return;
    const visible = root.classList.contains("topbar-visible");
    if (event.clientY <= 16 && !visible) setVisible(true, settingsOpen);
    else if (visible && event.clientY > 96 && !bar.matches(":hover, :focus-within") && !settingsOpen && !bar.classList.contains("is-search-open")) setVisible(false);
  }, { passive: true });
  setVisible(false);
};

export const initializeSitePreferences = () => {
  const theme = getStoredPreference<Theme>(themeStorageKey, "ice", ["ice", "holo"]);
  const locale = getStoredPreference<Locale>(localeStorageKey, "zh", ["zh", "en"]);

  updateTheme(theme);
  void updateLocale(locale);

  document.querySelectorAll<HTMLButtonElement>("[data-theme-choice]").forEach((button) => {
    button.addEventListener("click", () => updateTheme(button.dataset.themeChoice as Theme, button));
  });

  document.querySelectorAll<HTMLButtonElement>("[data-locale-choice]").forEach((button) => {
    button.addEventListener("click", () => updateLocale(button.dataset.localeChoice as Locale));
  });

  initializePreferenceBar();
};
