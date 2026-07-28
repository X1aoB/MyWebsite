import { site } from "./site";

/**
 * 个人资料的唯一内容入口。
 *
 * 后续修改自我介绍、公开链接或首页简介时，优先编辑本文件；页面组件不需要改动。
 * `zh` 是中文站点的原文，`en` 用于右上角的英语切换。
 */
export type LocalizedCopy = {
  zh: string;
  en: string;
};

type ProfileLink = {
  label: string;
  description: LocalizedCopy;
  href?: string;
  status?: LocalizedCopy;
};

export const profile = {
  homeHeading: {
    zh: "你好，我是小B！",
    en: "Hi, I’m Xiao B!"
  },
  sidebarIntro: {
    zh: "小B的个人网站，这里会介绍我的开源项目，更新开发日志，分享本人经历，以及偶尔更新摄影作品",
    en: "Xiao B's personal site: open-source projects, dev logs, personal experiences, and occasional photography updates."
  },
  homeLead: {
    zh: "目前正在着手做《尘白禁区》对话项目 Project Snow，也会在这里记录开发日志、数据实践、游戏和摄影里的小碎片。",
    en: "I’m currently working on Project Snow, a Snowbreak dialogue project. This is also where I keep dev logs, data notes, games, and small photography fragments."
  },
  about: {
    title: {
      zh: "你好，我是小B。",
      en: "Hi, I’m Xiao B."
    },
    summary: {
      zh: "大四在读 · 某外企实习中 · 什么都会一点，也什么都想试试",
      en: "Final-year student · Interning at a foreign company · Knows a little about many things and wants to try even more"
    },
    details: [
      {
        label: { zh: "现在的我", en: "Right now" },
        value: {
          zh: "现居上海松江，家乡四川绵阳。大四在读，正在某外企实习；一边把 Project Snow 往前推，一边看看自己还能折腾点什么。",
          en: "Based in Songjiang, Shanghai and originally from Mianyang, Sichuan. I’m a final-year student interning at a foreign company, moving Project Snow forward while seeing what else I can build."
        }
      },
      {
        label: { zh: "当前方向", en: "Focus" },
        value: {
          zh: "想往数据开发和数据分析靠拢；目前在补 Python、数据工程、ETL、数据分析、知识库和 RAG。",
          en: "Heading toward data development and analytics; currently building up Python, data engineering, ETL, analytics, knowledge bases, and RAG."
        }
      },
      {
        label: { zh: "兴趣", en: "Outside work" },
        value: {
          zh: "游戏、乒乓球、徒步与摄影。二游在玩尘白禁区、异环、公主连接和棕色尘埃 2；其他时间会开 CS2、以撒结合，或者什么都玩一点点。",
          en: "Games, table tennis, hiking, and photography. I play Snowbreak, Neverness to Everness, Princess Connect!, and BrownDust2, plus CS2, The Binding of Isaac, and a little bit of everything else."
        }
      },
      {
        label: { zh: "这个站点", en: "This site" },
        value: {
          zh: "Project Snow 的进度、数据开发和数据分析的实践、摄影分享、一些小工具，以及莫名其妙想啥说啥的个人博客。",
          en: "Project Snow updates, data-development and analytics practice, photography, a few useful tools, and a personal blog for whatever I feel like saying."
        }
      }
    ],
    current: {
      title: {
        zh: "上学 / 实习 / 推项目 / 搭网站，试试看能不能把喜欢的东西慢慢做成作品集。",
        en: "Study / internship / project work / site-building — seeing if I can slowly turn the things I like into a portfolio."
      },
      description: {
        zh: "现在一边在某外企实习，一边推进 Project Snow、继续搭网站，顺手补数据开发和数据分析方向的工程实践。",
        en: "I’m interning at a foreign company while moving Project Snow forward, continuing to build this site, and picking up the engineering practice needed for data development and analytics."
      }
    },
    contact: {
      title: {
        zh: "什么都会一点，但更欢迎一起聊点真的有意思的东西。",
        en: "I know a little about many things, but I’d much rather talk about something genuinely interesting together."
      },
      description: {
        zh: "数据工程、知识库 / RAG、个人工具、游戏、摄影、乒乓球和徒步都能聊；工作相关沟通可以通过 GitHub、LinkedIn 或 admin@xiaob.dev 联系。",
        en: "Data engineering, knowledge bases / RAG, personal tools, games, photography, table tennis, and hiking are all fair game. For professional contact, reach me through GitHub, LinkedIn, or admin@xiaob.dev."
      }
    }
  },
  links: [
    {
      label: "GitHub",
      description: {
        zh: "代码、项目与提交记录",
        en: "Code, projects, and commit history"
      },
      href: site.githubProfile
    },
    {
      label: "LinkedIn",
      description: {
        zh: "职业经历与数据方向探索",
        en: "Professional experience and data-focused growth"
      },
      href: site.social.linkedIn
    },
    {
      label: "Project Snow",
      description: {
        zh: "尘白禁区知识库与对话项目源码",
        en: "Snowbreak knowledge-base and dialogue project source"
      },
      href: site.repositories.projectSnow
    },
    {
      label: "Bilibili",
      description: {
        zh: "游戏、视频与日常内容",
        en: "Games, videos, and everyday posts"
      },
      href: site.social.bilibili
    },
    {
      label: "Steam",
      description: {
        zh: "游戏主页与公开资料",
        en: "Game profile and public activity"
      },
      href: site.social.steam
    },
    {
      label: "域名邮箱",
      description: {
        zh: "公开联系邮箱，欢迎交流项目、数据开发和合作想法。",
        en: "Public contact address for projects, data development, and collaboration."
      },
      href: `mailto:${site.social.email}`,
      status: {
        zh: "公开联系",
        en: "Available"
      }
    }
  ] satisfies ProfileLink[]
} as const;
