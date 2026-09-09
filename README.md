# Xiao B · Data & Systems

一个使用 Astro 构建的中文静态个人站：展示数据开发方向、小吉终端、开发日志、摄影集和浏览器内运行的数据工具。

## 已包含的功能

- “尘尘的白 / 苹果与狼”双主题；1200px 起三栏，761–1199px 两栏，760px 及以下单栏。桌面左右栏统一卡片宽度和圆角风格，左栏完整包住资料、导航与 GitHub 入口，无独立滚动条；搜索与主题/语言选择在顶部浮层，移动端设置独立展开。
- 首页已支持随主题切换的角色插画与署名。
- Markdown 驱动的开发日志，包含阅读时间、目录、代码复制、回顶部，以及同项目内的上一篇/下一篇。
- 小吉终端 项目页、路线图、GitHub 链接与来源/许可说明。
- `/tools/json/` JSON 工作台：2/4 空格格式化、压缩、校验、示例、清空、复制与下载；保留大整数、键顺序和字符串字面量，输入仅在当前页面处理。
- `/tools/model-iq/` 模型 IQ 雷达：读取公开摘要，支持模型族筛选与排序。
- 静态摄影集：响应式封面、按原比例排列的阅读窗、连续大图浏览、方向键与未放大时的水平滑动，以及无需数据库的添加流程。
- 构建时生成的全站搜索：覆盖公开开发日志全文、摄影套图说明、Now、小吉终端 元数据、公开项目与工具；标题匹配优先，支持来源和标签筛选、Ctrl/Cmd+K 与建议方向键选择。
- Now 页面、自动更新流和 `/rss.xml`：不需要服务器，发布时从公开内容自动生成。
- 面向未来项目案例的 Markdown 模板与动态路由；小吉终端 保持现有独立专页。
- 可选 Giscus 评论；未配置时自动降级为 GitHub Discussions 引导。
- 页脚包含版权、来源许可、社交入口、RSS、隐私说明与站点状态；`/privacy/` 和 `/status/` 均为静态页面。

## 本地运行

需要 Node.js 22 或更高版本（仓库提供了 `.nvmrc`）。

```powershell
npm install
npm run dev
```

打开终端显示的本地地址，通常为 `http://localhost:4321`。常用检查命令：

```powershell
npm run check
npm test
npm run build
npm run preview
```

生产静态文件会生成到 `dist/`。

## 内容与站点配置

- 新文章放入 `src/content/blog/`，frontmatter 必须包含 `title`、`description`、`pubDate`、`tags`、`accent`、`draft`。
- `src/config/now.ts` 维护 Now 的分类与记录；四类入口跳转到 `/now/daily/`、`/now/interviews/`、`/now/technical/`、`/now/guides/`，分类页再进入独立文章。旧分类 hash 会跳转到对应模块；技术文章可引用现有日志文章，避免复制正文。页面、搜索与 sitemap 在构建时同步生成。
- `src/config/project-snow.ts` 维护小吉终端的公开版本与进度，供首页、项目页、右栏及发现入口复用。目前介绍采用用户提供的 0.10.0-rc.3 截图和公告；历史日志只更新项目名称，保留原日期与阶段内容。旧项目 URL、文章 slug 与真实仓库地址保持可访问。
- 新版终端截图原件在 `public/images/xiaoji-terminal/`，共享元数据与构建图片助手在 `src/assets/xiaoji-terminal/screenshots.ts`；不裁剪原图，构建生成 480/960/1440px WebP，首页与项目页共用响应式预览，点图查看完整原件。
- 未来公开项目放入 `src/content/projects/`。从 `project-case-template.md` 复制开始，`draft: true` 的案例不会被发布。
- 名称、GitHub 及外部链接集中在 `src/config/site.ts`。
- 页脚的版权、来源、主题署名与部署状态文字也集中在 `src/config/site.ts` 的 `site.legal` 中；图片来源不确定时不要猜测，确认后再补充。
- 个人介绍和公开链接维护于 `src/config/profile.ts`；`profileContacts` 包含原先公开的 Bilibili、Steam 和域名邮箱，关于页与页脚同时使用。LinkedIn 不展示。
- 角色插画位于 `public/images/characters/`；在 `src/config/site.ts` 的 `media.heroCharacter.iceSrc`、`holoSrc` 与对应说明字段中维护。两张图会随主题平滑切换。
- 将 `.env.example` 复制为 `.env` 后，可在本地设置站点 URL 与 Giscus ID；`.env` 不会提交到 Git。

```powershell
Copy-Item .env.example .env
```

## 添加自己的照片

相册是纯静态的：一套图的照片文件放在 `public/images/gallery/`，整套图的标题、日期、地点、封面与逐张说明放在 `src/content/gallery/` 的一份 Markdown 文件中。点击标题图后会在当前页面打开可向下滚动的阅读窗。提交并部署后，Cloudflare Pages 会一并发布它们。

1. 将同一套图的照片复制到 `public/images/gallery/`，例如 `summer-harbor-cover.webp`、`summer-harbor-01.webp`。建议使用 WebP 或 JPEG，长边控制在约 2400px 以内，单张尽量在 1–3MB 内，以避免页面加载过慢。
2. 复制 `src/content/gallery/casual-shots-vol-1.md`，重命名为有意义的英文文件名，例如 `summer-harbor.md`，并替换原有内容。
3. 修改 frontmatter；图片路径必须以 `/images/gallery/` 开头，`cover` 用于列表标题图，`photos` 用于悬浮阅读窗；`aspect` 只可填 `landscape`、`portrait` 或 `square`。

```md
---
title: 夏日港口
date: 2026-07-24
location: 香港
description: 傍晚散步时拍下的港口光线，收成一组慢慢翻完的照片。
equipment: 相机型号 / 手机型号 / 镜头组合
cover:
  image: /images/gallery/summer-harbor-cover.webp
  alt: 傍晚港口与远处建筑，作为套图标题图
  aspect: landscape
photos:
  - image: /images/gallery/summer-harbor-01.webp
    alt: 傍晚港口与远处建筑的照片
    caption: 太阳快落下去时，港口的轮廓变得很清楚。
    note: 可以写拍摄当时的上下文，也可以留空。
    aspect: landscape
tags:
  - 城市
  - 夏天
draft: false
---
```

构建会读取照片的真实尺寸，在 `dist/_astro/` 生成 480、960、1440px 宽的 WebP 版本（不放大小于目标宽度的原图）。封面与套图阅读窗通过 `srcset` / `sizes` 选择合适版本；尚未打开的套图不会请求内部照片，大图模式仍使用原图。无需手动维护衍生图，新增或替换照片后重新构建即可；缺失或损坏的图片会使构建失败，便于发布前发现问题。

替换已发布的原图时，建议使用新文件名并同步修改 frontmatter，避免访问者的大图继续命中旧文件缓存。

套图可通过 `/gallery/#photo-set-文件名` 直达。大图首尾不会循环，切图重置缩放，关闭后回到对应照片的焦点；没有 JavaScript 时仍可通过套图下方的照片直链浏览。`caption` 与 `note` 可作为内容记录保留，但不会在图片窗口中显示；发布前请自行移除不希望公开的定位信息，并确保照片拥有公开版权或已获得授权。

## 阅读体验与样式维护

文章至少包含两个真实 H2/H3 时显示目录：宽屏在右栏，较窄屏幕在正文前折叠展示。阅读时间按中文每分钟约 350 字、英文每分钟约 200 词估算。带 `project` 的文章仅在同项目内连续阅读；其他文章在未归属项目的文章中按日期、稳定 ID 排序，草稿不会参与。切换英文界面时，未翻译正文保留 `lang="zh-CN"`。

共享布局与主题位于 `src/styles/global.css` 和 `refinements.css`；摄影、项目、模型 IQ 与阅读增强的样式随页面分别加载。首页正文直接显示，装饰在离开视口或页面转入后台时暂停；系统减少动态效果时关闭装饰运动。英文翻译字典按需下载，中文首屏复用静态 HTML。

## 搜索、更新流与 RSS

这些功能全部在 `npm run build` 时生成，不需要数据库、服务器或第三方搜索服务：

- 桌面鼠标移至页面顶沿可展开原有顶部浮层，或按 Ctrl/Cmd+K 直接搜索；键盘 Tab 也可到达站点设置入口。移动端使用顶部搜索按钮。搜索覆盖公开开发日志全文、摄影套图、Now、小吉终端、公开项目和工具；上下方向键选择建议，Enter 打开选中项，没有选中项时进入 `/search/` 查看完整结果。快捷键不会打断其他输入框或打开的图片弹窗。
- 搜索浮层、手机搜索框和建议列表支持展开与收起动画，淡出完成后再隐藏，连续开关会自然反向过渡；收起时立即停止交互并移出辅助技术读取范围。系统选择减少动态效果时关闭过渡。搜索建议兼容中文输入法，Escape 先收起建议，再关闭搜索，索引读取失败可以重试。搜索与筛选仅使用静态索引，不调用第三方搜索服务。
- 摄影搜索结果会使用 `/gallery/#photo-set-文件名`，进入摄影页后自动打开同页的套图阅读窗。
- `/updates/` 按日期合并公开开发日志、摄影套图、小吉终端 与公开项目案例。
- `/rss.xml` 只收录开发日志、摄影套图与公开项目，不收录 Now、工具或任何草稿。

上线前务必在 Cloudflare Pages 设置正式的 `PUBLIC_SITE_URL`。RSS 使用它生成绝对链接；若保留示例域名，订阅器里的链接也会指向示例地址。

## 本地 JSON 工具

`/tools/json/` 仅在用户点击操作后解析数据，不会上传输入、写入本地存储或引入在线编辑器。输入限制为 **1 MiB（UTF-8 字节）**，最多 **64 层嵌套**，结果最多 **4 MiB**；超限会提示缩小数据或改用压缩。超过 **64 KiB** 的输入按需交给 Web Worker 处理，避免阻塞页面；处理期间可以编辑输入或清空以取消任务，任务完成或离开页面时终止 Worker，失败或 10 秒超时后可重新尝试。格式化只改变字符串外的空白，保留大整数、重复键、负零、指数与字符串转义，避免 `JSON.parse` 后再 `JSON.stringify` 带来的数值舍入。修改输入会清空旧结果，防止复制过期数据；剪贴板不可用时会选中结果供手动复制。

工具入口统一维护在 `src/config/tools.ts`，目前只发布 JSON 工作台和模型 IQ 雷达；CSV/TSV 工具尚未提供。工具参与搜索，但不加入内容更新流或 RSS。

## 添加未来项目案例

小吉终端 保持在 `/projects/project-snow/` 的独立页面，不需要迁移。以后新增作品集项目时：

1. 复制 `src/content/projects/project-case-template.md`，重命名为稳定的英文文件名，例如 `personal-etl-tool.md`。
2. 填写 frontmatter 中的标题、摘要、状态、时间段、职责、标签、技术栈、仓库链接和更新时间。
3. 正文按“问题 / 方案 / 链路 / 结果 / 复盘”写；模板已预置这五个小节。
4. 准备公开时把 `draft: true` 改为 `draft: false`。该案例随后会自动拥有 `/projects/文件名/` 页面，并进入搜索、更新页和 RSS。

## 启用 Giscus 评论

1. 将 `X1aoB/MyWebsite` 设为公开仓库。
2. 在 GitHub 仓库设置中启用 **Discussions**。
3. 安装 [Giscus GitHub App](https://github.com/apps/giscus)。
4. 打开 [giscus.app](https://giscus.app/)，选择 `X1aoB/MyWebsite` 与 `General` 分类，映射方式选择 `pathname`。
5. 将 giscus.app 给出的仓库 ID 和分类 ID 设置为环境变量：

```text
PUBLIC_GISCUS_REPO_ID=...
PUBLIC_GISCUS_CATEGORY_ID=...
```

未设置这两个变量时，文章页不会载入失效的第三方脚本，而会显示 Discussions 链接。

## 通过 Cloudflare Pages 部署

首版不需要服务器。使用现有 GitHub 仓库和已迁移到 Cloudflare 的域名即可。

1. 将本仓库推送到 GitHub `main` 分支，并按上节公开仓库、配置 Giscus。
2. 在 Cloudflare Dashboard 打开 **Workers & Pages → Create application → Pages → Connect to Git**，授权并选择 `X1aoB/MyWebsite`。
3. 使用以下构建设置：

   | 设置 | 值 |
   | --- | --- |
   | Framework preset | Astro |
   | Production branch | `main` |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Node.js version | `22` |

4. 在 Pages 项目的 **Settings → Environment variables** 中设置：

   ```text
   NODE_VERSION=22
   PUBLIC_SITE_URL=https://你的根域名
   PUBLIC_GISCUS_REPO_ID=...
   PUBLIC_GISCUS_CATEGORY_ID=...
   ```

5. 部署成功后，在 **Custom domains** 添加根域名；Cloudflare 会为已托管的域名处理所需 DNS 记录。将 `www` 设为重定向到根域名，保持一个规范 URL。
6. 以后推送 `main` 自动发布生产站，其他分支可生成预览部署。

## 小吉终端 的后续服务

本站以静态页面介绍 小吉终端，并链接到独立子域名上的公开测试体验。对话、模型接入与数据检索由 小吉终端 服务处理，个人站无需新增后端；公开测试的功能和数据处理方式以项目页及试玩站的说明为准。
