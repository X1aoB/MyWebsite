import { describe, expect, it } from "vitest";
import { now, type NowSection } from "../config/now";
import { getNowArticleSummaries, nowArticlePaths } from "./now-pages";

describe("Now 分类与文章路由", () => {
  const posts = [{ id: "project-snow-data-foundation", data: { title: "小吉终端：为可追溯 RAG 构建数据底座", description: "真实文章摘要", pubDate: new Date("2026-07-23"), draft: false } }];
  it("分类保持指定顺序，技术文章引用既有阅读页且不生成副本", () => {
    expect(now.sections.map((section) => section.title.zh)).toEqual(["日常分享", "面试经历", "技术文章", "随机攻略"]);
    expect(now.sections.map((section) => getNowArticleSummaries(section, posts).length)).toEqual([3, 1, 1, 1]);
    const technical = getNowArticleSummaries(now.sections[2], posts);
    expect(technical[0]).toMatchObject({ url: "/journal/project-snow-data-foundation/", includeTime: false, title: { zh: posts[0].data.title } });
    const paths = nowArticlePaths(now.sections);
    expect(paths.map((path) => path.params)).toEqual([
      { section: "daily", slug: "failed-before-the-start" },
      { section: "daily", slug: "japan-trip-preparation" },
      { section: "daily", slug: "typhoon-autumn-recruiting" },
      { section: "interviews", slug: "xiaohongshu-ai-data-interview" },
      { section: "guides", slug: "japan-eleven-day-route-and-tips" }
    ]);
    expect(paths[0].props.item.publishedAt).toBe("2026-10-14T18:30:11+08:00");
    expect(paths[0].props.item.title.zh).toBe("出师未捷身先死这一块");
    expect(paths[0].props.item.description.zh).toBe(
      "发现自己好像确实是不是编程脑子，一直刷力扣和SQL是不是路给走窄了...手撕撕不出来真的感觉不是这块料，该考虑换行了也许，数据开发也没有什么具体的经历看上去也是死路一条啊，感觉来个一年的耍起指不定真是最好的选择XDDDDDDDDD"
    );
    expect(paths[1].props.item.publishedAt).toBe("2026-09-19T13:32:55+08:00");
    expect(paths[2].props.item.publishedAt).toBe("2026-08-11T16:26:41+08:00");
    expect(paths[3].props.item.publishedAt).toBe("2026-09-03T14:23:32+08:00");
    expect(paths[4].props.item.publishedAt).toBe("2026-10-14T18:30:12+08:00");
    expect(paths[4].props.item.description.zh).toContain("下午乘JR前往名古屋，晚上入住网咖");
    expect(paths[4].props.item.description.zh).toContain("东京部分自行查找攻略，想怎么逛就怎么逛，交通吃饭都非常方便");
    expect(paths[4].props.item.description.zh).toContain("如果有更多问题，可以通过网站邮箱联系我，乐意解答√");
  });
  it("缺失或草稿引用不发布，重复引用只显示一次", () => {
    const section: NowSection = { ...now.sections[2], journalIds: ["missing", "project-snow-data-foundation", "project-snow-data-foundation"] };
    expect(getNowArticleSummaries(section, posts)).toHaveLength(1);
    expect(getNowArticleSummaries(section, [{ ...posts[0], data: { ...posts[0].data, draft: true } }])).toEqual([]);
    expect(getNowArticleSummaries(section)).toEqual([]);
  });
});
