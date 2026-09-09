import { afterEach, describe, expect, it, vi } from "vitest";
import { tools } from "../config/tools";
import { filterSearchEntries, isSearchSource, type SearchIndexEntry } from "./search";
import { createSearchIndexLoader } from "./search-index-loader";
import { updateSources } from "./update-types";

const entry = (id: string, title: string, body = "", overrides: Partial<SearchIndexEntry> = {}): SearchIndexEntry => ({
  id, source: "journal", title: { zh: title, en: title }, description: { zh: "", en: "" },
  location: { zh: "", en: "" }, tags: [], url: `/journal/${id}/`, searchText: body, ...overrides
});

describe("搜索相关度与工具索引", () => {
  it("标题完整、前缀、包含命中依次优先于正文，且不修改原数组", () => {
    const entries = [entry("body", "新文章", "JSON 工作台"), entry("contains", "本地 JSON 工具"), entry("prefix", "JSON 工作台"), entry("exact", "JSON")];
    expect(filterSearchEntries(entries, { query: "json" }).map((row) => row.id)).toEqual(["exact", "prefix", "contains", "body"]);
    expect(entries[0].id).toBe("body");
    expect(filterSearchEntries(entries)).toEqual(entries);
  });
  it("NFKC 和多关键词匹配，匹配强度相同时保留原序", () => {
    const entries = [entry("one", "JSON 工作台", "精度"), entry("two", "JSON 工作台", "精度"), entry("three", "其他", "JSON")];
    expect(filterSearchEntries(entries, { query: "ＪＳＯＮ  精度" }).map((row) => row.id)).toEqual(["one", "two"]);
  });
  it("工具可独立筛选，无发布日期，并且更新流不扩展工具类型", () => {
    const toolEntries = tools.map((tool) => entry(tool.id, tool.title.zh, tool.description.zh, { source: "tool", tags: tool.tags, url: tool.url }));
    expect(isSearchSource("tool")).toBe(true);
    expect(isSearchSource("arbitrary")).toBe(false);
    expect(filterSearchEntries(toolEntries, { query: "JSON", source: "tool" }).map((row) => row.id)).toEqual(["json"]);
    expect(filterSearchEntries(toolEntries, { source: "journal" })).toEqual([]);
    expect(filterSearchEntries(toolEntries, { source: "tool", tag: "JSON" })).toHaveLength(1);
    expect(toolEntries.every((row) => row.date === undefined)).toBe(true);
    expect(updateSources).toEqual(["journal", "gallery", "project"]);
  });
});

describe("搜索索引加载", () => {
  afterEach(() => vi.useRealTimers());
  it("共享并发请求，成功后复用缓存", async () => {
    const request = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify([entry("one", "JSON")])));
    const load = createSearchIndexLoader(request);
    const first = load();
    expect(load()).toBe(first);
    await expect(first).resolves.toHaveLength(1);
    await expect(load()).resolves.toHaveLength(1);
    expect(request).toHaveBeenCalledTimes(1);
  });
  it("请求失败后可以重新请求", async () => {
    const request = vi.fn<typeof fetch>().mockRejectedValueOnce(new TypeError("offline")).mockResolvedValueOnce(new Response("[]"));
    const load = createSearchIndexLoader(request);
    await expect(load()).rejects.toThrow("offline");
    await expect(load()).resolves.toEqual([]);
    expect(request).toHaveBeenCalledTimes(2);
  });
  it("拒绝错误状态及不完整索引，不把损坏数据误报成零结果", async () => {
    const request = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(new Response("unavailable", { status: 503 }))
      .mockResolvedValueOnce(new Response('[{"source":"unknown"}]'))
      .mockResolvedValueOnce(new Response(JSON.stringify([entry("bad", "Bad", "", { url: "//outside.example" })])));
    const load = createSearchIndexLoader(request);
    await expect(load()).rejects.toThrow("503");
    await expect(load()).rejects.toThrow("Invalid search index");
    await expect(load()).rejects.toThrow("Invalid search index");
  });
  it("超时中止请求且下一次仍可重试", async () => {
    vi.useFakeTimers();
    const request = vi.fn<typeof fetch>().mockImplementationOnce((_url, init) => new Promise((_resolve, reject) => {
      init?.signal?.addEventListener("abort", () => reject(new DOMException("Timed out", "AbortError")));
    })).mockResolvedValueOnce(new Response("[]"));
    const load = createSearchIndexLoader(request, 100);
    const pending = expect(load()).rejects.toThrow("Timed out");
    await vi.advanceTimersByTimeAsync(100);
    await pending;
    await expect(load()).resolves.toEqual([]);
  });
  it.each(["/\\outside.example/path", "/journal\\entry/"])("拒绝含反斜线的 URL %s", async (url) => {
    const request = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify([entry("bad", "Bad", "", { url })])));
    await expect(createSearchIndexLoader(request)()).rejects.toThrow("Invalid search index");
  });
});
