import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { projectSnow } from "../config/project-snow";
import { BILIBILI_PLAYER_ORIGIN, bilibiliEmbedUrl, previewShouldPlay, type PreviewConditions } from "./promo-player";

const headers = readFileSync(new URL("../../public/_headers", import.meta.url), "utf8");
const globalHeader = (name: string) => headers.match(new RegExp(`^\\s+${name}: (.+)$`, "m"))?.[1] ?? "";

describe("bilibili embed", () => {
  it("builds the player URL for the promo video", () => {
    const url = new URL(bilibiliEmbedUrl(projectSnow.promo.bvid));
    expect(url.origin).toBe(BILIBILI_PLAYER_ORIGIN);
    expect(url.pathname).toBe("/player.html");
    expect(Object.fromEntries(url.searchParams)).toEqual({ bvid: "BV1vbna6KECh", p: "1", autoplay: "1", high_quality: "1", danmaku: "0" });
  });

  it("refuses anything that is not a BV id", () => {
    for (const value of ["", "BV1vbna6KEC", "BV1vbna6KECh&autoplay=0", "javascript:alert(1)", "av170001"]) {
      expect(() => bilibiliEmbedUrl(value), value).toThrow();
    }
  });

  it("keeps the player origin in the CSP and lets it autoplay after the click", () => {
    const frameSrc = globalHeader("Content-Security-Policy").split(";").map((part) => part.trim()).find((part) => part.startsWith("frame-src "));
    expect(frameSrc?.split(/\s+/)).toContain(BILIBILI_PLAYER_ORIGIN);
    expect(globalHeader("Permissions-Policy")).toContain(`autoplay=(self "${BILIBILI_PLAYER_ORIGIN}")`);
  });

  it("links the promo to the same video", () => {
    expect(projectSnow.promo.url).toBe(`https://www.bilibili.com/video/${projectSnow.promo.bvid}/`);
  });
});

describe("muted preview", () => {
  const base: PreviewConditions = { choice: "auto", inView: true, pageVisible: true, reducedMotion: false, saveData: false };

  it("plays by itself only when motion and data are allowed", () => {
    expect(previewShouldPlay(base)).toBe(true);
    expect(previewShouldPlay({ ...base, reducedMotion: true })).toBe(false);
    expect(previewShouldPlay({ ...base, saveData: true })).toBe(false);
  });

  it("never runs off-screen or in a background tab, even when chosen", () => {
    expect(previewShouldPlay({ ...base, choice: "playing", inView: false })).toBe(false);
    expect(previewShouldPlay({ ...base, choice: "playing", pageVisible: false })).toBe(false);
  });

  it("lets the visitor's pause or play win", () => {
    expect(previewShouldPlay({ ...base, choice: "paused" })).toBe(false);
    expect(previewShouldPlay({ ...base, choice: "playing", reducedMotion: true, saveData: true })).toBe(true);
  });
});
