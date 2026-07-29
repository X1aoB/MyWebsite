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
  publishedAt: string;
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
  updatedAt: "2026-07-29",
  intro: {
    zh: "小B的龙门阵和随想",
    en: "Xiao B's ramblings and thoughts"
  },
  sections: [
    {
      id: "now-daily",
      label: { zh: "", en: "" },
      title: { zh: "日常分享", en: "Daily sharing" },
      items: [
        {
          publishedAt: "2026-07-29T14:24:30+08:00",
          title: { zh: "实习、网站和一点随拍", en: "Internship, site-building, and a few snapshots" },
          description: {
            zh: "现在住在上海松江，工作之余继续搭网站，偶尔打乒乓球、徒步和拍照；想到什么就记录一点。",
            en: "Based in Songjiang, Shanghai, I keep building this site outside work, play table tennis, hike, and take photos when I can."
          },
          tags: []
        }
      ]
    },
    {
      id: "now-games",
      label: { zh: "", en: "" },
      title: { zh: "游戏讨论", en: "Game discussions" },
      items: [
        {
          publishedAt: "2026-07-29T14:24:30+08:00",
          title: { zh: "最近在玩的几款游戏", en: "Games in the current rotation" },
          description: {
            zh: "尘白禁区、异环、公主连接、棕色尘埃 2，偶尔也开 CS2、以撒的结合，什么都玩一点，也欢迎聊聊游戏体验。",
            en: "Snowbreak, Neverness to Everness, Princess Connect!, and BrownDust2, plus occasional CS2 and The Binding of Isaac. I play a little of everything and am always up for a chat."
          },
          tags: []
        }
      ]
    },
    {
      id: "now-ideas",
      label: { zh: "", en: "" },
      title: { zh: "项目灵感", en: "Project ideas" },
      items: [
        {
          publishedAt: "2026-07-29T14:24:30+08:00",
          title: { zh: "Project Snow 与角色对话", en: "Project Snow and character dialogue" },
          description: {
            zh: "正在尝试把尘白禁区的世界资料整理成可追溯的数据底座，再逐步探索角色对话和助手形态；目前先把爬虫、增量更新和语料规范化做好。",
            en: "I am turning Snowbreak world material into a traceable data foundation before exploring character dialogue and an assistant form; for now, the focus is crawling, incremental updates, and corpus cleanup."
          },
          tags: []
        }
      ]
    }
  ] satisfies readonly NowSection[]
} as const;
