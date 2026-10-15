import { describe, expect, it } from "vitest";
import { coverSpan, packRows, type GalleryAspect } from "./gallery-layout";

const sets = (aspects: string) =>
  aspects.split(" ").map((code, index) => ({ id: `${code}${index}`, aspect: (code === "L" ? "landscape" : code === "P" ? "portrait" : "square") as GalleryAspect }));
const spanOf = (item: { aspect: GalleryAspect }) => coverSpan(item.aspect);

describe("gallery row packing", () => {
  it("fills a row with the next portrait instead of leaving a hole", () => {
    const ordered = packRows(sets("P L L L L P L"), spanOf, 4);
    expect(ordered.map((item) => item.id)).toEqual(["P0", "L1", "P5", "L2", "L3", "L4", "L6"]);
  });

  it("keeps the original order when every row already fills", () => {
    const input = sets("L L P P L L");
    expect(packRows(input, spanOf, 4)).toEqual(input);
  });

  it("returns every item exactly once and leaves a gap only when nothing fits", () => {
    const input = sets("L P L");
    const ordered = packRows(input, spanOf, 4);
    expect(ordered.map((item) => item.id)).toEqual(["L0", "P1", "L2"]);
    expect(new Set(ordered).size).toBe(input.length);
  });

  it("treats a span wider than the grid as a full row", () => {
    expect(packRows(sets("L P P"), spanOf, 1).map((item) => item.id)).toEqual(["L0", "P1", "P2"]);
  });

  it("gives landscape covers two columns and others one", () => {
    expect([coverSpan("landscape"), coverSpan("portrait"), coverSpan("square")]).toEqual([2, 1, 1]);
  });
});
