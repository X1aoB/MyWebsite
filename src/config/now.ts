/**
 * The site-wide Now page is maintained here instead of in a page component.
 * Edit this one file for routine updates; the page and the search index will
 * pick up the changes during the next static build.
 */
export type LocalizedNowCopy = {
  zh: string;
  en: string;
};

export type NowItem = {
  title: LocalizedNowCopy;
  description: LocalizedNowCopy;
  tags?: string[];
};

export type NowSection = {
  id: string;
  label: LocalizedNowCopy;
  title: LocalizedNowCopy;
  items: readonly NowItem[];
};

export const now = {
  updatedAt: "2026-07-26",
  intro: {
    zh: "小B的龙门阵和随想",
    en: "Xiao B's ramblings and thoughts"
  },
  sections: [
    {
      id: "now-focus",
      label: { zh: "当前专注", en: "Current focus" },
      title: { zh: "先把能持续推进的事，慢慢做扎实。", en: "Making the things worth continuing a little more solid." },
      items: [
        {
          title: { zh: "Project Snow 的数据链路", en: "Project Snow's data pipeline" },
          description: {
            zh: "继续整理采集、增量更新与来源溯源，为之后的结构化、检索和对话阶段打底。",
            en: "Continuing collection, incremental updates, and provenance work before the later structuring, retrieval, and dialogue stages."
          },
          tags: ["Project Snow", "数据工程", "RAG"]
        },
        {
          title: { zh: "数据开发与数据分析作品集", en: "A data-development and analytics portfolio" },
          description: {
            zh: "把学习和实习之外真正做过的工程实践整理成可以回看的记录。",
            en: "Turning real engineering practice beyond study and internship work into things I can look back on."
          },
          tags: ["Python", "ETL", "数据分析"]
        }
      ]
    },
    {
      id: "now-recent",
      label: { zh: "最近在玩 / 看 / 拍", en: "Recently playing / watching / shooting" },
      title: { zh: "游戏、照片和一些不太需要解释的碎片。", en: "Games, photos, and fragments that do not need much explanation." },
      items: [
        {
          title: { zh: "在玩的游戏", en: "Games in the rotation" },
          description: {
            zh: "尘白禁区、异环、公主连接、棕色尘埃 2，偶尔也会开 CS2、以撒结合，或者什么都玩一点点。",
            en: "Snowbreak, Neverness to Everness, Princess Connect!, and BrownDust2—plus occasional CS2, The Binding of Isaac, and a little of everything else."
          },
          tags: ["游戏", "尘白禁区"]
        },
        {
          title: { zh: "摄影集", en: "Photography archive" },
          description: {
            zh: "正在把摄影集从版式示例慢慢换成自己的套图：一组照片，加上一点当时的上下文。",
            en: "Slowly replacing the photography layout demo with my own sets: a group of photos and a little context from the moment."
          },
          tags: ["摄影", "套图"]
        }
      ]
    },
    {
      id: "now-next",
      label: { zh: "下一步", en: "Next" },
      title: { zh: "让网站更像一个能持续使用的工作台。", en: "Making this site feel more like a workspace I can keep using." },
      items: [
        {
          title: { zh: "持续写与持续更新", en: "Write and update consistently" },
          description: {
            zh: "补齐开发日志、摄影套图和可公开的项目案例，也继续把这个站点本身往前搭。",
            en: "Add dev logs, photography sets, and publishable project cases while continuing to build the site itself."
          },
          tags: ["开发日志", "作品集"]
        }
      ]
    }
  ] satisfies readonly NowSection[]
} as const;
