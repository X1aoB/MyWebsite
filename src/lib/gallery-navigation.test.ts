import { describe, expect, it } from "vitest";
import { adjacentPhotoIndex, parsePhotoSetHash, photoSwipeDirection } from "./gallery-navigation";

describe("gallery deep links and sequential viewing", () => {
  it("accepts existing photo-set links and ignores malformed or unrelated hashes", () => {
    expect(parsePhotoSetHash("#photo-set-2026-chinajoy")).toBe("photo-set-2026-chinajoy");
    expect(parsePhotoSetHash("#photo-set-summer%5Fwalk")).toBe("photo-set-summer_walk");
    expect(parsePhotoSetHash("#photo-set-%E0%A4%A")).toBeNull();
    expect(parsePhotoSetHash("#section-title")).toBeNull();
    expect(parsePhotoSetHash("#photo-set-")).toBeNull();
  });

  it("stops at both ends and handles single-photo sets", () => {
    expect(adjacentPhotoIndex(0, 3, -1)).toBe(0);
    expect(adjacentPhotoIndex(0, 3, 1)).toBe(1);
    expect(adjacentPhotoIndex(2, 3, 1)).toBe(2);
    expect(adjacentPhotoIndex(0, 1, 1)).toBe(0);
    expect(adjacentPhotoIndex(0, 0, 1)).toBe(-1);
  });

  it("only advances on deliberate horizontal swipes", () => {
    expect(photoSwipeDirection(-90, 12)).toBe(1);
    expect(photoSwipeDirection(90, -12)).toBe(-1);
    expect(photoSwipeDirection(20, 1)).toBe(0);
    expect(photoSwipeDirection(70, 90)).toBe(0);
    expect(photoSwipeDirection(-80, 70)).toBe(0);
  });
});
