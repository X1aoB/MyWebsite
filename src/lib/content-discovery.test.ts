import { describe, expect, it } from "vitest";
import { buildRssXml } from "./rss";
import {
  filterSearchEntries,
  isPublicContent,
  toGalleryHashUrl,
  type SearchIndexEntry
} from "./search";
import { sortUpdates, type UpdateItem } from "./update-types";

const entries: SearchIndexEntry[] = [
  {
    id: "journal:snow-foundation",
    source: "journal",
    title: { zh: "Project Snow 数据底座", en: "Project Snow data foundation" },
    description: { zh: "记录可追溯的数据链路。", en: "Notes on a traceable data pipeline." },
    location: { zh: "Project Snow · 数据工程", en: "Project Snow · Data engineering" },
    tags: ["Project Snow", "数据工程"],
    url: "/journal/snow-foundation/",
    date: "2026-07-23T00:00:00.000Z",
    searchText: "Project Snow 数据底座 traceable data pipeline incremental updates"
  },
  {
    id: "gallery:summer-walk",
    source: "gallery",
    title: { zh: "夏日散步", en: "Summer walk" },
    description: { zh: "傍晚的树影。", en: "Evening tree shadows." },
    location: { zh: "上海", en: "Shanghai" },
    tags: ["摄影", "夏天"],
    url: "/gallery/#photo-set-summer-walk",
    date: "2026-07-24T00:00:00.000Z",
    searchText: "夏日散步 Summer walk 上海 photography"
  },
  {
    id: "now:focus",
    source: "now",
    title: { zh: "当前专注", en: "Current focus" },
    description: { zh: "持续写开发日志。", en: "Keep writing dev logs." },
    location: { zh: "当前专注", en: "Current focus" },
    tags: ["开发日志"],
    url: "/now/#now-focus",
    date: "2026-07-26T00:00:00.000Z",
    searchText: "当前专注 Current focus dev logs"
  }
];

const update = (id: string, date: string, source: UpdateItem["source"] = "journal"): UpdateItem => ({
  id,
  source,
  sourceLabel: source === "gallery" ? { zh: "摄影集", en: "Photography" } : source === "project" ? { zh: "项目", en: "Project" } : { zh: "开发日志", en: "Dev log" },
  title: { zh: `${id} 标题`, en: `${id} title` },
  description: { zh: "带有 & 符号的说明", en: "A description with & characters" },
  location: { zh: "测试地点", en: "Test location" },
  tags: ["测试"],
  date: new Date(date),
  url: source === "gallery" ? "/gallery/#photo-set-summer-walk" : `/${id}/`
});

describe("静态搜索索引", () => {
  it("排除草稿，并能查找中英文内容", () => {
    expect(isPublicContent({ data: { draft: false } })).toBe(true);
    expect(isPublicContent({ data: { draft: true } })).toBe(false);
    expect(filterSearchEntries(entries, { query: "数据底座" }).map((entry) => entry.id)).toEqual(["journal:snow-foundation"]);
    expect(filterSearchEntries(entries, { query: "INCREMENTAL pipeline" }).map((entry) => entry.id)).toEqual(["journal:snow-foundation"]);
  });

  it("支持来源、标签、空查询与空结果", () => {
    expect(filterSearchEntries(entries, { source: "gallery" }).map((entry) => entry.id)).toEqual(["gallery:summer-walk"]);
    expect(filterSearchEntries(entries, { tag: "开发日志" }).map((entry) => entry.id)).toEqual(["now:focus"]);
    expect(filterSearchEntries(entries).map((entry) => entry.id)).toHaveLength(3);
    expect(filterSearchEntries(entries, { query: "不存在的关键词" })).toEqual([]);
  });

  it("为摄影结果生成可直开同页套图窗口的哈希链接", () => {
    expect(toGalleryHashUrl("summer walk_01")).toBe("/gallery/#photo-set-summer-walk_01");
  });
});

describe("更新流与 RSS", () => {
  it("按日期从新到旧排序", () => {
    const sorted = sortUpdates([
      update("older", "2026-07-21"),
      update("newer", "2026-07-26"),
      update("middle", "2026-07-23")
    ]);
    expect(sorted.map((entry) => entry.id)).toEqual(["newer", "middle", "older"]);
  });

  it("生成只包含正式更新内容的有效 RSS 结构和绝对链接", () => {
    const xml = buildRssXml({
      siteUrl: "https://xiaob.example",
      siteName: "Xiao B Data & Systems",
      siteDescription: "Static updates",
      updates: [update("project-snow", "2026-07-23", "project"), update("summer", "2026-07-24", "gallery")]
    });

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain("https://xiaob.example/project-snow/");
    expect(xml).toContain("https://xiaob.example/gallery/#photo-set-summer-walk");
    expect(xml).toContain("&amp;");
    expect(xml.match(/<item>/g)).toHaveLength(2);
    expect(xml).not.toContain("<category>Now</category>");
  });
});
