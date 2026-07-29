# 网站内容维护手册

本站按“内容与页面分离”的方式维护：日常更新优先改配置、Markdown 和 `public` 中的资源，不需要修改 Astro 页面组件。

## 最常修改的文件

| 想修改什么 | 修改位置 |
| --- | --- |
| 站点名称、域名、GitHub、社交链接、仓库链接 | `src/config/site.ts` |
| 自我介绍、首页简介、About 页面和联系方式状态 | `src/config/profile.ts` |
| 开发日志 | `src/content/blog/*.md` |
| 摄影套图与设备信息 | `src/content/gallery/*.md` |
| Now 页面近况 | `src/config/now.ts` |
| 未来项目案例 | `src/content/projects/*.md` |
| 照片和角色插画 | `public/images/` |

`profile.ts` 中每段内容都有 `zh` 与 `en`。中文是主文案；英语切换会读取 `en`。暂时没有英文时，可以先把中文复制到 `en`，之后再补译。

## 1. 修改个人资料与链接

编辑 `src/config/profile.ts`：

- `sidebarIntro`：左侧栏的简短介绍。
- `homeLead`：首页主标题下的介绍。
- `about`：About 页的个人简介、当前状态和联系说明。
- `links`：公开链接。拥有 `href` 的条目会变成外链；只有 `status` 的条目会显示为不可点击的状态卡。

域名邮箱准备好后，将“域名邮箱”这一项改成如下形式，并删除 `status`：

```ts
{
  label: "域名邮箱",
  description: {
    zh: "工作与项目合作联系。",
    en: "For professional and project contact."
  },
  href: "mailto:hello@你的域名"
}
```

站点范围的 URL 位于 `src/config/site.ts`。首次公开部署前，请在 GitHub 创建并推送 `X1aoB/MyWebsite`；它也是网站源码链接和后续 Giscus 评论配置所使用的仓库名。

## 2. 发布开发日志

在 `src/content/blog/` 新建一个英文文件名的 Markdown，例如 `first-etl-notes.md`：

```md
---
title: "从一份 CSV 开始整理 ETL 流程"
description: "记录一次小型数据清洗与字段校验的实践。"
pubDate: 2026-07-24
tags:
  - 数据工程
  - ETL
accent: mint
draft: false
---

正文从这里开始。
```

- `accent` 可选 `ice`、`mint` 或 `violet`。
- 草稿阶段使用 `draft: true`，构建后的公开站不会显示它。
- 文件名会成为文章 URL，因此发布后不要随意改名。

## 3. 添加一套摄影图

摄影集按“**一套图一份 Markdown**”维护：列表页只显示标题图，点击后会在当前页面打开可下拉阅读的悬浮窗。窗口以图片网格为主，点击任意画面可打开大图预览；`equipment` 会显示在套图信息中。

1. 将这一套图的图片放到 `public/images/gallery/`，例如 `public/images/gallery/2026-summer-walk-cover.webp`、`public/images/gallery/2026-summer-walk-01.webp`。
2. 在 `src/content/gallery/` 新建一份 Markdown，例如 `2026-summer-walk.md`：

```md
---
title: 夏日散步
date: 2026-07-24
location: 上海松江
description: 傍晚出门绕了一圈，把天空、树影和路边的小细节收进同一套图里。
equipment: 相机型号 / 手机型号 / 镜头组合
cover:
  image: /images/gallery/2026-summer-walk-cover.webp
  alt: 傍晚天空下的湖边步道，作为套图标题图
  aspect: landscape
photos:
  - image: /images/gallery/2026-summer-walk-01.webp
    alt: 夕阳照在湖面的浅金色光影
    caption: 先是湖面被太阳照亮。
    note: 说明可以是一句当时的想法，也可以写拍摄时的上下文。
    aspect: landscape
  - image: /images/gallery/2026-summer-walk-02.webp
    alt: 树影落在步道边的长椅上
    caption: 然后是路边这张没人坐的长椅。
    aspect: portrait
tags:
  - 散步
  - 夏天
draft: false
---
```

`cover` 是列表页的标题图，`photos` 是悬浮阅读窗里顺序展示的内容，`equipment` 是公开展示的设备信息。`caption` 和 `note` 会保留在内容数据中供搜索与后续整理，但不会在图片窗口内显示；`aspect` 都可以不写，图片横竖比例不同时填写 `landscape`、`portrait` 或 `square` 会让网格更贴合原图。

图片建议优先使用 WebP 或 JPEG，单张尽量控制在 1–3 MB 内。上传前移除 EXIF 中不希望公开的 GPS 信息；地点可以只写城市、区域或留空，不必写精确位置。

## 4. 更新 Now 页面

编辑 `src/config/now.ts` 即可。文件按三个区块组织：`当前专注`、`最近在玩 / 看 / 拍`、`下一步`；每一项都有 `zh` 和 `en` 两套文字。当前没有英文时，先把中文复制过去也可以，页面不会因为缺少英文而中断。

复制一项时可使用这个结构：

```ts
{
  title: { zh: "这周正在做的事", en: "What I am working on this week" },
  description: {
    zh: "一句愿意公开、也方便以后回看的近况。",
    en: "A public update that will still make sense later."
  },
  tags: ["开发日志", "作品集"]
}
```

Now 会进入全站搜索，但不会进入 RSS 或自动更新流。不要在这里填不愿长期公开的行程、精确住址、内部公司信息或私人联系方式。

## 5. 添加未来项目案例

`Project Snow` 是例外：它继续维护在原来的独立页面中。其他项目从 `src/content/projects/project-case-template.md` 复制一份开始，并重命名为稳定的英文文件名，例如 `csv-quality-checker.md`。

```md
---
title: "CSV 质量检查器"
description: "用本地规则检查 CSV 字段、空值和常见格式问题的小工具。"
status: "已完成"
period: "2026.08"
role: "个人开发"
tags:
  - 数据工程
  - Python
techStack:
  - Python
  - Pandas
repository: "https://github.com/X1aoB/csv-quality-checker"
updatedAt: 2026-08-01
draft: true
---

## 问题

这里写真实的输入、限制和目标。

## 方案

这里写方案与取舍。

## 链路

这里写数据或处理流程。

## 结果

这里写可验证结果与限制。

## 复盘

这里写下一次会怎样做得更好。
```

保留 `draft: true` 时案例不会公开；改为 `draft: false` 后，构建会自动生成 `/projects/文件名/`，并让它进入搜索、`/updates/` 和 `/rss.xml`。不要把仓库中的密钥、内部数据或无权公开的截图放进案例正文。

## 6. 搜索、更新流与 RSS

不需要手动维护搜索索引。每次 `npm run build` 会自动收录：

- 所有 `draft: false` 的开发日志全文；
- 所有公开摄影套图的标题、地点、说明与逐张照片注释；
- `src/config/now.ts` 的公开近况；
- Project Snow 的公开元数据；
- 所有 `draft: false` 的未来项目案例。

顶部隐藏栏中央的搜索框按 Enter 会进入 `/search/`；结果页可按来源和标签筛选。摄影结果使用哈希链接，进入摄影页后会自动打开对应的同页套图窗。

`/updates/` 与 `/rss.xml` 不收录 Now 和草稿。RSS 需要正式域名来生成正确的绝对链接，因此部署时务必设置：

```text
PUBLIC_SITE_URL=https://你的根域名
```

## 7. 添加首页角色插画（可选）

将已获得使用许可的图片放在 `public/images/characters/`，然后编辑 `src/config/site.ts`：

```ts
heroCharacter: {
  iceSrc: "/images/characters/snowbreak-theme.webp",
  iceAlt: "尘尘的白主题插画的简短说明",
  iceCaption: "里芙·贝斯特拉",
  holoSrc: "/images/characters/spice-wolf-theme.webp",
  holoAlt: "苹果与狼主题插画的简短说明",
  holoCaption: "赫萝"
}
```

两张插画会随主题平滑切换。站点头像也位于同一配置块的 `avatar.src`。建议使用自己的创作、已获授权的图片或明确允许转载的素材；没有图片时可将对应的路径设为空，页面会继续显示设计好的占位卡。

## 8. 公开信息与简历

是否公开城市、家乡、实习经历、电话或邮箱完全由你决定；这些文字都集中在 `src/config/profile.ts`。即使选择公开，也建议只写你愿意长期保留在网页上的版本，例如城市 / 区域而非门牌地址、公司名称而非内部团队信息。

对于求职，GitHub、LinkedIn、项目说明和经脱敏的作品链接通常已经足够；其他信息按你的意愿补充即可。

如要增加简历，推荐制作单独的公开版 PDF：删除电话、住址、身份证明、学校学号和内部项目细节；确认后再放到 `public/files/`，并在 About 页面增加链接。不要直接上传用于投递的完整版简历。

## 发布前检查

每次修改内容后，在项目根目录运行：

```powershell
npm run check
npm test
npm run build
```

`npm run build` 成功后，静态文件会生成在 `dist/`。Cloudflare Pages 的构建命令保持为 `npm run build`，输出目录保持为 `dist`。
