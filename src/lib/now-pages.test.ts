import { describe, expect, it } from "vitest";
import { now, type NowSection } from "../config/now";
import { getNowArticleSummaries, nowArticlePaths } from "./now-pages";

describe("Now 分类与文章路由", () => {
  const posts = [{ id: "project-snow-data-foundation", data: { title: "小吉终端：为可追溯 RAG 构建数据底座", description: "真实文章摘要", pubDate: new Date("2026-07-23"), draft: false } }];
  it("分类保持指定顺序，技术文章引用既有阅读页且不生成副本", () => {
    expect(now.sections.map((section) => section.title.zh)).toEqual(["日常分享", "面试经历", "技术文章", "随机攻略"]);
    expect(now.sections.map((section) => getNowArticleSummaries(section, posts).length)).toEqual([1, 1, 1, 0]);
    const technical = getNowArticleSummaries(now.sections[2], posts);
    expect(technical[0]).toMatchObject({ url: "/journal/project-snow-data-foundation/", includeTime: false, title: { zh: posts[0].data.title } });
    const paths = nowArticlePaths(now.sections);
    expect(paths.map((path) => path.params)).toEqual([
      { section: "daily", slug: "typhoon-autumn-recruiting" },
      { section: "interviews", slug: "xiaohongshu-ai-data-interview" }
    ]);
    expect(paths[0].props.item.publishedAt).toBe("2026-08-11T16:26:41+08:00");
    expect(paths[1].props.item.publishedAt).toBe("2026-09-03T14:23:32+08:00");
  });
  it("缺失或草稿引用不发布，重复引用只显示一次", () => {
    const section: NowSection = { ...now.sections[2], journalIds: ["missing", "project-snow-data-foundation", "project-snow-data-foundation"] };
    expect(getNowArticleSummaries(section, posts)).toHaveLength(1);
    expect(getNowArticleSummaries(section, [{ ...posts[0], data: { ...posts[0].data, draft: true } }])).toEqual([]);
    expect(getNowArticleSummaries(section)).toEqual([]);
  });
});
