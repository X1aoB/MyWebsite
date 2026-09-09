import { describe, expect, it } from "vitest";
import { compareReadingPosts, estimateReadingMinutes, readingHeadings, readingNeighbors } from "./reading";

const post = (id: string, date: string, project = "Project Snow") => ({ id, data: { pubDate: new Date(date), project } });

describe("article reading helpers", () => {
  it("orders dates newest first and same-day posts by a stable ID", () => {
    const posts = [post("z", "2026-09-01"), post("old", "2026-08-01"), post("a", "2026-09-01")];
    expect(posts.sort(compareReadingPosts).map(({ id }) => id)).toEqual(["a", "z", "old"]);
  });

  it("keeps continuous reading inside the explicit project and handles its endpoints", () => {
    const first = post("first", "2026-07-01");
    const middle = post("middle", "2026-08-01");
    const last = post("last", "2026-09-01");
    const posts = [last, post("unrelated", "2026-08-15", "Other"), first, middle];
    expect(readingNeighbors(posts, middle)).toEqual({ previous: first, next: last, project: "Project Snow" });
    expect(readingNeighbors(posts, first).previous).toBeNull();
    expect(readingNeighbors(posts, last).next).toBeNull();
  });

  it("never leaves a project even when it has only one entry", () => {
    const first = post("first", "2026-07-01", "未分类");
    const second = post("second", "2026-08-01", "Other");
    expect(readingNeighbors([first, second], second)).toEqual({ previous: null, next: null, project: "Other" });
    expect(readingNeighbors([first], first)).toEqual({ previous: null, next: null, project: null });
  });

  it("orders uncategorized entries together without crossing into a named project", () => {
    const first = post("first", "2026-07-01", "未分类");
    const last = post("last", "2026-09-01", "  ");
    const unrelated = post("unrelated", "2026-08-01");
    expect(readingNeighbors([last, unrelated, first], first)).toEqual({ previous: null, next: last, project: null });
  });

  it("counts Chinese and English together and excludes image URLs and markup", () => {
    expect(estimateReadingMinutes("中".repeat(350))).toBe(1);
    expect(estimateReadingMinutes("word ".repeat(200))).toBe(1);
    expect(estimateReadingMinutes("中".repeat(350) + " word".repeat(200))).toBe(2);
    expect(estimateReadingMinutes("![" + "图".repeat(1000) + "](https://example.com/pic.webp)\n[read](https://example.com/)" )).toBe(1);
    expect(estimateReadingMinutes("")).toBe(1);
  });

  it("only exposes a table of contents for two or more real H2/H3 headings", () => {
    const h2 = { depth: 2, slug: "one", text: "One" };
    const h3 = { depth: 3, slug: "two", text: "Two" };
    expect(readingHeadings([{ depth: 1, slug: "title", text: "Title" }, h2])).toEqual([]);
    expect(readingHeadings([h2, h3, { depth: 4, slug: "tiny", text: "Tiny" }])).toEqual([h2, h3]);
  });
});
