/**
 * Current public release, taken from the terminal's own announcements
 * (App/public_frontend/announcements.json in Project_Snow) and the 1.0.0
 * promotional video published on Bilibili on 2026-10-24.
 */
export const projectSnow = {
  publicVersion: "1.0.0",
  updatedAt: "2026-10-24",
  productName: { zh: "小吉终端", en: "Xiaoji Terminal" },
  intro: {
    zh: "和海姆达尔的少女们聊聊天：发一条消息，或者直接去见她。",
    en: "Talk with the girls of Heimdall: send her a message, or go and meet her."
  },
  summary: {
    zh: "小吉终端是一个《尘白禁区》同人陪伴向网页应用，非官方、非商业。文字通讯与 Galgame 式面对面场景共享角色语境、记忆和地点；22 位角色、九个地点和四个时段，让每段相处都有看得见的回应。电脑和手机浏览器都能用。",
    en: "Xiaoji Terminal is an unofficial, non-commercial Snowbreak fan companion web app. Messaging and visual-novel-style scenes share character context, memory, and location; 22 characters, nine locations, and four times of day give every encounter a visible response. It works in desktop and mobile browsers."
  },
  status: { zh: "正式上线 · v1.0.0", en: "Live · v1.0.0" },
  /** The promotional film. The page embeds Bilibili's player only after a click. */
  promo: {
    bvid: "BV1vbna6KECh",
    url: "https://www.bilibili.com/video/BV1vbna6KECh/",
    publishedAt: "2026-10-24",
    // As Bilibili's player rounds it (the file is 4:31.4).
    duration: "4:32",
    title: {
      zh: "尘白禁区真能变成 Galgame？小吉终端 1.0.0 正式上线！",
      en: "Can Snowbreak become a visual novel? Xiaoji Terminal 1.0.0 is live!"
    }
  },
  /** Three headline changes, reused by the home page progress strip. */
  stages: [
    {
      id: "live",
      status: { zh: "已上线", en: "Live" },
      title: { zh: "1.0.0 正式上线，宣传片已发布", en: "1.0.0 is live, with a launch film" },
      description: {
        zh: "电脑和手机浏览器都能用。宣传片在 B 站发布，四分半钟走完清晨到深夜的一天。",
        en: "It runs in desktop and mobile browsers. The launch film on Bilibili walks through one day, from dawn to late night, in four and a half minutes."
      }
    },
    {
      id: "scenes",
      status: { zh: "10 月 22 日", en: "Oct 22" },
      title: { zh: "九个地点专属场景，白雪转场", en: "Nine dedicated scenes and a snow transition" },
      description: {
        zh: "每个地点有了自己的面对面背景，并随清晨、白天、黄昏、夜晚变化；一起去别处时，她先把话说完，再由白雪带到新地点。",
        en: "Each location now has its own face-to-face backdrop that changes from dawn to night. When you go somewhere together, she finishes her line before snow carries you to the new place."
      }
    },
    {
      id: "memory",
      status: { zh: "10 月 21 日", en: "Oct 21" },
      title: { zh: "记忆档案、约定提醒与主动消息", en: "Memory archive, reminders, and messages from her" },
      description: {
        zh: "查看和删除她记得的事；约定可以到点提醒，也可以选择让她主动发来消息。",
        en: "Review or delete what she remembers. Plans can remind you on time, and you can let her message you first."
      }
    }
  ],
  /** Recent release notes, newest first, condensed from the in-app announcements. */
  updates: [
    {
      date: "2026-10-23",
      title: { zh: "重新配置模型不再重复验证", en: "Fewer repeated checks when reconnecting a model" },
      summary: {
        zh: "同一浏览器的真人验证仍有效时，重新建立模型会话不再弹出验证；验证组件短暂加载失败时会有限重试。",
        en: "While the same browser's human check is still valid, reconnecting a model no longer asks again; a briefly failing check widget retries a limited number of times."
      }
    },
    {
      date: "2026-10-22",
      title: { zh: "每个地点有了自己的场景，换场改用白雪转场", en: "A scene for every location, and a snow transition" },
      summary: {
        zh: "基地海滩、温泉、游戏厅、酒吧、疗愈中心、公园、商业街、购物中心和分析员的房间都有专属背景；邀请她同行时，她先把话说完，白雪盖满画面后再揭开新地点。",
        en: "The base beach, hot spring, arcade, bar, healing centre, park, shopping street, mall, and your room each have a backdrop. When you leave together, she finishes speaking, then snow covers the screen and reveals the new place."
      }
    },
    {
      date: "2026-10-22",
      title: { zh: "锁屏时钟走动，提醒用她平时的称呼", en: "A live lock-screen clock and her usual way of addressing you" },
      summary: {
        zh: "手机锁屏按分钟走动，提醒卡显示约好的时间；角色主动发来的提醒改用她平时对你的称呼，例如里芙会叫你「亲爱的」。",
        en: "The phone lock screen ticks by the minute and shows the agreed time; reminders she sends now use how she usually addresses you, such as Lyfe calling you “darling”."
      }
    },
    {
      date: "2026-10-21",
      title: { zh: "记忆档案、长台词分页、约定提醒与主动消息", en: "Memory archive, paged dialogue, reminders, and messages from her" },
      summary: {
        zh: "查看和删除她记得的事；收藏台词、搜索回看并生成图片卡；长台词按对白框分页、可自动翻页；约定到点提醒；每轮回复显示模型调用次数与 token。",
        en: "Review and delete what she remembers; favourite lines, search the log, and make quote cards; long lines are paged and can auto-advance; plans remind you on time; every reply shows its model calls and tokens."
      }
    },
    {
      date: "2026-10-19",
      title: { zh: "基地地图", en: "Base map" },
      summary: {
        zh: "在基地平面图上查看 22 位角色此刻所在的房间和活动；打开地图不调用模型，选中角色即可去见她。",
        en: "See which room each of the 22 characters is in and what she is doing on the base floor plan. Opening the map makes no model call, and you can go to meet her from it."
      }
    },
    {
      date: "2026-10-18",
      title: { zh: "暮色与夜色界面", en: "Dusk and night interface tones" },
      summary: {
        zh: "界面默认跟随舞台时段，黄昏变为暮色、夜晚变深；远景加入晶体世界树和收容墙信标，室内加入基地编号。",
        en: "By default the interface follows the stage: dusk tones at sunset and a dark theme at night. The skyline adds the crystal world tree and containment-wall beacons, and rooms carry base numbers."
      }
    },
    {
      date: "2026-10-15",
      title: { zh: "雪境界面：面对面改为全屏舞台", en: "Snowscape interface: a full-screen stage" },
      summary: {
        zh: "磨砂对白框、角色色名牌和快捷菜单；九个地点各有分层雪景；电脑以终端开机画面开场，手机以锁屏开场。",
        en: "Frosted dialogue boxes, character-coloured name tags, and a quick menu; layered snowscapes for nine locations; a terminal boot screen on desktop and a lock screen on phones."
      }
    }
  ]
} as const;
