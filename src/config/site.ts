const configuredSiteUrl = import.meta.env.PUBLIC_SITE_URL?.replace(/\/$/, "");

export const site = {
  name: "Xiao B · Data & Systems",
  shortName: "Xiao B",
  displayName: "小B",
  description: "小B 的个人站：记录 Project Snow、数据开发与分析实践、摄影和个人工具。",
  locale: "zh-CN",
  url: configuredSiteUrl || "https://example.com",
  githubAccount: "X1aoB",
  githubDisplayName: "Xiao B",
  githubProfile: "https://github.com/X1aoB",
  repositories: {
    website: "https://github.com/X1aoB/MyWebsite",
    projectSnow: "https://github.com/X1aoB/Project_Snow"
  },
  social: {
    bilibili: "https://space.bilibili.com/91372056",
    steam: "https://steamcommunity.com/profiles/76561198401024601/",
    linkedIn: "https://www.linkedin.com/in/kaletu7116"
  },
  media: {
    avatar: {
      src: "/images/characters/holo-avatar.jpg",
      alt: "赫萝 Q 版表情头像"
    },
    heroCharacter: {
      iceSrc: "/images/characters/snowbreak-theme.png",
      iceAlt: "里芙·贝斯特拉的蓝白主题插画",
      iceCaption: "里芙·贝斯特拉",
      holoSrc: "/images/characters/spice-wolf-theme.png",
      holoAlt: "赫萝与麦穗的暖色主题插画",
      holoCaption: "赫萝"
    }
  },
  external: {
    bWiki: "https://wiki.biligame.com/sonw/"
  }
} as const;

export const navigation = [
  { href: "/", label: "首页", icon: "⌂", spiceIcon: "apple" },
  { href: "/journal/", label: "开发日志", icon: "≡", spiceIcon: "wheat" },
  { href: "/projects/project-snow/", label: "Project Snow", icon: "✦", spiceIcon: "constellation" },
  { href: "/tools/", label: "数据工具", icon: "⌘", spiceIcon: "tool-grid" },
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
