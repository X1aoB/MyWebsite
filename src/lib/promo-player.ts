/** Bilibili's embeddable player. Must stay in the CSP frame-src allowlist (public/_headers). */
export const BILIBILI_PLAYER_ORIGIN = "https://player.bilibili.com";

const BVID = /^BV[0-9A-Za-z]{10}$/;

/** Player URL for one video: starts playing on load (the user just clicked), danmaku off. */
export const bilibiliEmbedUrl = (bvid: string): string => {
  if (!BVID.test(bvid)) throw new Error(`Not a Bilibili BV id: ${bvid}`);
  const url = new URL("/player.html", BILIBILI_PLAYER_ORIGIN);
  url.searchParams.set("bvid", bvid);
  url.searchParams.set("p", "1");
  url.searchParams.set("autoplay", "1");
  url.searchParams.set("high_quality", "1");
  url.searchParams.set("danmaku", "0");
  return url.toString();
};

/** "auto" until the visitor uses the pause/play control; their choice then wins. */
export type PreviewChoice = "auto" | "playing" | "paused";

export interface PreviewConditions {
  choice: PreviewChoice;
  inView: boolean;
  pageVisible: boolean;
  reducedMotion: boolean;
  saveData: boolean;
}

/**
 * Whether the muted on-page preview should be running. It never plays off-screen
 * or in a background tab; it only starts by itself when the visitor allows motion
 * and is not saving data, and an explicit pause or play always wins.
 */
export const previewShouldPlay = ({ choice, inView, pageVisible, reducedMotion, saveData }: PreviewConditions): boolean => {
  if (!inView || !pageVisible || choice === "paused") return false;
  if (choice === "playing") return true;
  return !reducedMotion && !saveData;
};
