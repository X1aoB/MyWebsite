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
  updatedAt: "2026-08-11",
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
          publishedAt: "2026-08-11T16:26:41+08:00",
          title: { zh: "台风&秋招", en: "Typhoon & autumn recruiting" },
          description: {
            zh: "白海豚真把松江变成江了，上海外国语大学退化成下河中国语小学有没有懂的。秋招都要来了感觉自己什么都还在干还在学，俨然一具尸体。",
            en: "The typhoon really turned Songjiang into a river. Shanghai International Studies University has devolved into a riverside language primary school—if you know, you know. Autumn recruiting is almost here, yet I feel like I’m still doing and learning everything, practically a corpse."
          },
          tags: []
        }
      ]
    }
  ] satisfies readonly NowSection[]
} as const;
