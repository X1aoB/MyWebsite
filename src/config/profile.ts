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
  label: LocalizedCopy;
  description: LocalizedCopy;
  href: string;
};

/** Previously published contact destinations, restored from the parent of commit 5684beb. */
export const profileContacts = {
  bilibili: "https://space.bilibili.com/91372056",
  steam: "https://steamcommunity.com/profiles/76561198401024601/",
  email: "admin@xiaob.dev"
} as const;

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
    zh: "目前正在维护《尘白禁区》对话项目小吉终端。也会在这里记录开发日志、数据实践、游戏和摄影里的小碎片。",
    en: "I’m maintaining Xiaoji Terminal, a Snowbreak dialogue project. This is also where I keep dev logs, data notes, games, and small photography fragments."
  },
  about: {
    title: {
      zh: "你好，我是小B。",
      en: "Hi, I’m Xiao B."
    },
    summary: {
      zh: "大四在读 · 有外企实习经历 · 数据与 AI 工程实践",
      en: "Final-year student · Internship experience at a foreign company · Data and AI engineering practice"
    },
    details: [
      {
        label: { zh: "现在的我", en: "Right now" },
        value: {
          zh: "现居上海松江，家乡四川绵阳。大四在读，有外企实习经历；实习已告一段落，目前正在准备秋招，一边维护小吉终端，一边把喜欢的东西慢慢做成作品。",
          en: "Based in Songjiang, Shanghai and originally from Mianyang, Sichuan. I’m a final-year student with internship experience at a foreign company. My internship has finished and I’m preparing for autumn recruiting while maintaining Xiaoji Terminal and turning my interests into projects."
        }
      },
      {
        label: { zh: "当前项目", en: "Current project" },
        value: {
          zh: "小吉终端的新界面已展示，22 名角色与 18 种基础表情已公开。目前继续根据体验反馈完善角色对话、表情表现和交互细节。",
          en: "Xiaoji Terminal’s new interface is on display, with 22 characters and 18 base expressions publicly available. I’m refining character dialogue, expressions, and interaction details based on feedback."
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
          zh: "小吉终端的进度、数据开发和数据分析的实践、摄影分享、一些小工具，以及莫名其妙想啥说啥的个人博客。",
          en: "Xiaoji Terminal updates, data-development and analytics practice, photography, a few useful tools, and a personal blog for whatever I feel like saying."
        }
      }
    ],
    current: {
      title: {
        zh: "准备秋招 / 维护小吉终端 / 记录开发过程。",
        en: "Preparing for autumn recruiting / maintaining Xiaoji Terminal / documenting the process."
      },
      description: {
        zh: "继续完善小吉终端的文字通讯、面对面体验和公开角色表情，也记录开发过程、整理项目经历，补齐数据开发、数据分析与 AI 应用方向的工程实践。",
        en: "I’m improving Xiaoji Terminal’s messaging, face-to-face experience, and public character expressions while documenting the work, reviewing my project experience, and developing practical skills in data engineering, analytics, and applied AI."
      }
    },
    contact: {
      title: {
        zh: "什么都会一点，但更欢迎一起聊点真的有意思的东西。",
        en: "I know a little about many things, but I’d much rather talk about something genuinely interesting together."
      },
      description: {
        zh: "数据工程、知识库 / RAG、个人工具、游戏、摄影、乒乓球和徒步都能聊；工作相关沟通、项目反馈与技术交流可以通过 GitHub 或 admin@xiaob.dev 联系。",
        en: "Data engineering, knowledge bases / RAG, personal tools, games, photography, table tennis, and hiking are all fair game. For professional contact, project feedback, or technical discussion, reach me through GitHub or admin@xiaob.dev."
      }
    }
  },
  links: [
    {
      label: { zh: "GitHub", en: "GitHub" },
      description: {
        zh: "代码、项目与提交记录",
        en: "Code, projects, and commit history"
      },
      href: site.githubProfile
    },
    {
      label: { zh: "小吉终端源码", en: "Xiaoji Terminal source" },
      description: {
        zh: "尘白禁区知识库与对话项目源码",
        en: "Snowbreak knowledge-base and dialogue project source"
      },
      href: site.repositories.projectSnow
    },
    {
      label: { zh: "小吉终端试玩", en: "Try Xiaoji Terminal" },
      description: {
        zh: "新版界面与角色对话的公开体验入口",
        en: "Public access to the new interface and character conversations"
      },
      href: site.external.projectSnowPlay
    },
    {
      label: { zh: "Bilibili", en: "Bilibili" },
      description: { zh: "游戏、视频与日常内容", en: "Games, videos, and everyday posts" },
      href: profileContacts.bilibili
    },
    {
      label: { zh: "Steam", en: "Steam" },
      description: { zh: "游戏主页与公开资料", en: "Game profile and public activity" },
      href: profileContacts.steam
    },
    {
      label: { zh: "域名邮箱", en: "Email" },
      description: { zh: "admin@xiaob.dev · 项目、数据开发与合作交流", en: "admin@xiaob.dev · Projects, data development, and collaboration" },
      href: `mailto:${profileContacts.email}`
    }
  ] satisfies ProfileLink[]
} as const;
