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
  href: string;
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
      zh: "Project Snow 开发中 · 数据与 AI 工程实践 · 用作品记录过程",
      en: "Building Project Snow · Data and AI engineering practice · Documenting the process through finished work"
    },
    details: [
      {
        label: { zh: "现在的我", en: "Right now" },
        value: {
          zh: "Project Snow 0.9.2 小规模测试版已经上线，目前继续根据真实反馈打磨对话体验、数据链路与部署细节。",
          en: "Project Snow 0.9.2 is now live as a small-scale test; I am refining its dialogue experience, data pipeline, and deployment through real feedback."
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
        zh: "维护 Project Snow 公开测试 / 修 Bug / 评估 TTS。",
        en: "Maintaining the Project Snow public test / fixing bugs / evaluating TTS."
      },
      description: {
        zh: "Project Snow 的网页版试玩已经开放，目前先服务小规模测试、收集反馈并完善安全与交互，同时继续补齐数据开发、数据分析和 AI 应用方向的工程实践。",
        en: "Project Snow's web experience is now open. I am keeping the test small while collecting feedback and improving safety and interaction, alongside continued work in data development, analytics, and applied AI."
      }
    },
    contact: {
      title: {
        zh: "什么都会一点，但更欢迎一起聊点真的有意思的东西。",
        en: "I know a little about many things, but I’d much rather talk about something genuinely interesting together."
      },
      description: {
        zh: "数据工程、知识库 / RAG、个人工具、游戏和摄影都能聊；项目反馈与技术交流可以通过 GitHub 进行。",
        en: "Data engineering, knowledge bases / RAG, personal tools, games, and photography are all fair game. Project feedback and technical discussion are welcome on GitHub."
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
      label: "Project Snow",
      description: {
        zh: "尘白禁区知识库与对话项目源码",
        en: "Snowbreak knowledge-base and dialogue project source"
      },
      href: site.repositories.projectSnow
    },
    {
      label: "Project Snow 试玩",
      description: {
        zh: "0.9.2 小规模公开测试入口",
        en: "0.9.2 small-scale public test"
      },
      href: site.external.projectSnowPlay
    }
  ] satisfies ProfileLink[]
} as const;
