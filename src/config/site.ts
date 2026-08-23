const configuredSiteUrl = import.meta.env.PUBLIC_SITE_URL?.replace(/\/$/, "");

export const site = {
  name: "Xiao B · Data & Systems",
  shortName: "Xiao B",
  displayName: "小B",
  description: "小B 的个人站：记录 Project Snow、数据开发与分析实践、摄影和个人工具。",
  locale: "zh-CN",
  url: configuredSiteUrl || "https://xiaob.dev",
  githubAccount: "X1aoB",
  githubDisplayName: "Xiao B",
  githubProfile: "https://github.com/X1aoB",
  repositories: {
    website: "https://github.com/X1aoB/MyWebsite",
    projectSnow: "https://github.com/X1aoB/Project_Snow"
  },
  legal: {
    original: {
      zh: "本站原创文章与摄影作品保留所有权利。",
      en: "Original articles and photography on this site are reserved."
    },
    projectSnow: {
      zh: "Project Snow 数据许可（以来源页面声明为准）：",
      en: "Project Snow data license, subject to source-page notices:"
    },
    rights: {
      zh: "游戏及角色原始内容版权归其权利人所有。",
      en: "Game and original character content belongs to its respective rights holders."
    },
    theme: {
      zh: "主题：尘尘的白 / 苹果与狼 · 页面与动效由小B制作",
      en: "Themes: Snowbreak / Spice & Wolf · interface and motion by Xiao B"
    },
    status: {
      zh: "个人站运行于 Cloudflare Pages；Project Snow 作为独立服务开放小规模测试，暂未接入统一实时 uptime 监控。",
      en: "The personal site runs on Cloudflare Pages; Project Snow is a separate small-scale public test, without unified live uptime monitoring yet."
    }
  },
  media: {
    avatar: {
      src: "/images/characters/holo-avatar.webp",
      alt: "赫萝 Q 版表情头像"
    },
    heroCharacter: {
      iceSrc: "/images/characters/snowbreak-theme.webp",
      iceAlt: "里芙·贝斯特拉的蓝白主题插画",
      iceCaption: "里芙·贝斯特拉",
      holoSrc: "/images/characters/spice-wolf-theme.webp",
      holoAlt: "赫萝与麦穗的暖色主题插画",
      holoCaption: "赫萝"
    }
  },
  external: {
    bWiki: "https://wiki.biligame.com/sonw/",
    ccByNcSa: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
    projectSnowPlay: "https://snow.xiaob.dev/",
    projectSnowPrivacy: "https://snow.xiaob.dev/privacy/",
    codexRadar: "https://codexradar.com/#model-ratings",
    codexRadarSummary: "https://codexradar.com/current.json"
  }
} as const;

export const navigation = [
  { href: "/", label: "首页", icon: "⌂", spiceIcon: "apple" },
  { href: "/journal/", label: "开发日志", icon: "≡", spiceIcon: "wheat" },
  { href: "/projects/project-snow/", label: "Project Snow", icon: "✦", spiceIcon: "constellation" },
  { href: "/tools/", label: "工具", icon: "⌘", spiceIcon: "tool-grid" },
  { href: "/gallery/", label: "摄影集", icon: "◌", spiceIcon: "field" },
  { href: "/now/", label: "Now", icon: "◔", spiceIcon: "coin" },
  { href: "/about/", label: "关于", icon: "◎", spiceIcon: "tail" }
] as const;

export const giscus = {
  repo: "X1aoB/MyWebsite",
  category: "General",
  repoId: import.meta.env.PUBLIC_GISCUS_REPO_ID,
  categoryId: import.meta.env.PUBLIC_GISCUS_CATEGORY_ID
} as const;
