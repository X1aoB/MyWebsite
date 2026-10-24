import { bilibiliEmbedUrl, previewShouldPlay, type PreviewChoice } from "../lib/promo-player";

type NetworkInformationLike = { saveData?: boolean };

const isEnglish = () => document.documentElement.lang.startsWith("en");

/** Updates a LocalizedText span so the site's own locale switch keeps it in sync. */
const setCopy = (element: HTMLElement | null | undefined, zh: string, en: string) => {
  if (!element) return;
  element.dataset.zh = zh;
  element.dataset.en = en;
  element.textContent = isEnglish() ? en : zh;
};

const frameTitle = { zh: "小吉终端 1.0.0 宣传片（哔哩哔哩播放器）", en: "Xiaoji Terminal 1.0.0 launch film (Bilibili player)" };

/**
 * The promo film block: a muted, looping on-page preview that only runs while it is
 * on screen, plus a link to Bilibili that becomes an in-page player on click. The
 * Bilibili iframe (and every request it makes) is created only after that click.
 */
export const initializePromoPlayer = () => {
  const root = document.querySelector<HTMLElement>("[data-promo]");
  const stage = root?.querySelector<HTMLElement>("[data-promo-stage]");
  const video = root?.querySelector<HTMLVideoElement>("[data-promo-preview]");
  const playLink = root?.querySelector<HTMLAnchorElement>("[data-promo-play]");
  const toggle = root?.querySelector<HTMLButtonElement>("[data-promo-toggle]");
  const bvid = root?.dataset.promoBvid;
  if (!root || !stage || !video || !playLink || !toggle || !bvid) return;

  const toggleLabel = toggle.querySelector<HTMLElement>("[data-localized-text]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const saveData = Boolean((navigator as Navigator & { connection?: NetworkInformationLike }).connection?.saveData);
  let choice: PreviewChoice = "auto";
  let inView = false;
  let embedded = false;
  let frame: HTMLIFrameElement | undefined;

  const syncToggle = () => {
    const running = !video.paused;
    toggle.dataset.state = running ? "playing" : "paused";
    setCopy(toggleLabel, running ? "暂停预览" : "播放预览", running ? "Pause preview" : "Play preview");
  };

  const update = () => {
    if (embedded) return;
    const shouldPlay = previewShouldPlay({
      choice,
      inView,
      pageVisible: document.visibilityState === "visible",
      reducedMotion: reducedMotion.matches,
      saveData
    });
    if (shouldPlay && video.paused) {
      // A refused play() (for example a browser autoplay setting) leaves the poster in place.
      video.play().catch(() => syncToggle());
    } else if (!shouldPlay && !video.paused) {
      video.pause();
    }
  };

  video.addEventListener("playing", () => {
    stage.dataset.preview = "playing";
    syncToggle();
  });
  video.addEventListener("pause", syncToggle);
  toggle.hidden = false;
  syncToggle();

  toggle.addEventListener("click", () => {
    choice = video.paused ? "playing" : "paused";
    update();
    syncToggle();
  });

  const observer = new IntersectionObserver((entries) => {
    inView = entries.some((entry) => entry.isIntersecting);
    update();
  }, { threshold: 0.35 });
  observer.observe(stage);
  document.addEventListener("visibilitychange", update);
  reducedMotion.addEventListener("change", update);

  playLink.addEventListener("click", (event) => {
    if (embedded || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    let source: string;
    try {
      source = bilibiliEmbedUrl(bvid);
    } catch {
      return; // Fall back to opening the video page.
    }
    event.preventDefault();
    embedded = true;
    observer.disconnect();
    video.pause();
    video.removeAttribute("src");
    video.querySelectorAll("source").forEach((element) => element.remove());
    video.load();

    frame = document.createElement("iframe");
    frame.src = source;
    frame.title = isEnglish() ? frameTitle.en : frameTitle.zh;
    frame.allow = "autoplay; fullscreen; picture-in-picture; encrypted-media";
    frame.referrerPolicy = "strict-origin-when-cross-origin";
    // The player may open bilibili.com in a new tab, but can never navigate this page.
    frame.setAttribute("sandbox", "allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-presentation");
    frame.className = "xj-film-frame";
    stage.dataset.state = "embedded";
    stage.append(frame);
    frame.focus();
  });

  window.addEventListener("site-locale-change", () => {
    if (frame) frame.title = isEnglish() ? frameTitle.en : frameTitle.zh;
  });
};
