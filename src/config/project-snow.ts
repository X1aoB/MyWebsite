/** Current public experience, confirmed by the supplied 2026-09-09 screenshots and announcement. */
export const projectSnow = {
  publicVersion: "0.10.0-rc.3",
  updatedAt: "2026-09-09",
  productName: { zh: "小吉终端", en: "Xiaoji Terminal" },
  intro: {
    zh: "与《尘白禁区》的角色保持日常联系，把文字通讯延伸成面对面的故事。",
    en: "Stay in touch with Snowbreak characters, and carry a conversation from messages into face-to-face stories."
  },
  summary: {
    zh: "小吉终端是一个非官方、非商业的 AI 角色互动项目。文字通讯与 Galgame 式面对面场景共享角色语境、记忆和地点；22 位角色的立绘与表情，让每段对话多一份看得见的回应。",
    en: "Xiaoji Terminal is an unofficial, non-commercial AI character-interaction project. Messaging and visual-novel-style scenes share character context, memory, and location, with artwork and expressions for 22 characters bringing a visible response to each conversation."
  },
  status: { zh: "公开体验 · v0.10.0-rc.3", en: "Public experience · v0.10.0-rc.3" },
  stages: [
    {
      id: "live",
      status: { zh: "已更新", en: "Available" },
      title: { zh: "小吉终端 · 新名称与新界面", en: "Xiaoji Terminal · A new name and interface" },
      description: {
        zh: "公开入口现为 0.10.0-rc.3。文字通讯、面对面场景、设置与公告整合进新版终端，继续保留浏览器本地记录与自备模型的使用方式。",
        en: "The public entry now runs 0.10.0-rc.3. Messaging, face-to-face scenes, settings, and announcements share the new terminal interface, with browser-local history and bring-your-own-model access."
      }
    },
    {
      id: "characters",
      status: { zh: "已加入", en: "Available" },
      title: { zh: "22 位角色 · 每位 18 种基础表情", en: "22 characters · 18 basic expressions each" },
      description: {
        zh: "全部 22 位角色的立绘与 18 种基础表情已加入面对面通讯，部分角色还有特别表现，让对白、动作与角色神情一起组成相处的场景。",
        en: "Face-to-face communication now includes artwork and 18 basic expressions for all 22 characters, plus special expressions for some characters, connecting dialogue, actions, and emotion."
      }
    },
    {
      id: "comfort",
      status: { zh: "已改善", en: "Improved" },
      title: { zh: "窄屏输入、角色切换与减少动效", en: "Narrow-screen input, character switching, and reduced motion" },
      description: {
        zh: "新版改善了窄屏输入和角色切换体验，也可以在设置中减少动态效果。公告与生日入口让版本变化和角色生日更容易找到。",
        en: "The new interface improves input and character switching on narrow screens, with a reduced-motion option in settings. Announcements and birthdays make updates and character dates easier to find."
      }
    }
  ]
} as const;
