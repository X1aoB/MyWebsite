# Xiao B · Data & Systems

一个使用 Astro 构建的中文静态个人站：展示数据开发方向、Project Snow、开发日志、摄影集和浏览器内运行的数据工具。

## 已包含的功能

- 蓝白冰晶工作台视觉、桌面三栏阅读布局、移动端折叠菜单、滚动进度与“减少动态效果”支持。
- 首页已支持随主题切换的角色插画与署名。
- Markdown 驱动的开发日志；首发文章介绍 Project Snow 的数据采集与溯源阶段。
- Project Snow 项目页、路线图、GitHub 链接与来源/许可说明。
- JSON 格式化、压缩、校验与复制工具。
- CSV/TSV 本地预览、分隔符识别、前 50 行展示和基础字段类型统计。
- 静态摄影集：套图标题卡、当前页面内可滚动的悬浮阅读窗，以及无需数据库的添加流程。
- 构建时生成的全站搜索：覆盖公开开发日志全文、摄影套图说明、Now、Project Snow 元数据与未来公开项目；支持来源和标签筛选，摄影结果可直接打开对应套图窗。
- Now 页面、自动更新流和 `/rss.xml`：不需要服务器，发布时从公开内容自动生成。
- 面向未来项目案例的 Markdown 模板与动态路由；Project Snow 保持现有独立专页。
- 可选 Giscus 评论；未配置时自动降级为 GitHub Discussions 引导。

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
- `src/config/now.ts` 是 Now 页的唯一内容入口；修改后页面与搜索索引会在构建时同步更新。
- 未来公开项目放入 `src/content/projects/`。从 `project-case-template.md` 复制开始，`draft: true` 的案例不会被发布。
- 名称、GitHub 及外部链接集中在 `src/config/site.ts`。
- 角色插画位于 `public/images/characters/`；在 `src/config/site.ts` 的 `media.heroCharacter.iceSrc`、`holoSrc` 与对应说明字段中维护。两张图会随主题平滑切换。
- 将 `.env.example` 复制为 `.env` 后，可在本地设置站点 URL 与 Giscus ID；`.env` 不会提交到 Git。

```powershell
Copy-Item .env.example .env
```

## 添加自己的照片

相册是纯静态的：一套图的照片文件放在 `public/images/gallery/`，整套图的标题、日期、地点、封面与逐张说明放在 `src/content/gallery/` 的一份 Markdown 文件中。点击标题图后会在当前页面打开可向下滚动的阅读窗。提交并部署后，Cloudflare Pages 会一并发布它们。

1. 将同一套图的照片复制到 `public/images/gallery/`，例如 `summer-harbor-cover.webp`、`summer-harbor-01.webp`。建议使用 WebP 或 JPEG，长边控制在约 2400px 以内，单张尽量在 1–3MB 内，以避免页面加载过慢。
2. 复制 `src/content/gallery/first-layout-demo.md`，重命名为有意义的英文文件名，例如 `summer-harbor.md`。
3. 修改 frontmatter；图片路径必须以 `/images/gallery/` 开头，`cover` 用于列表标题图，`photos` 用于悬浮阅读窗；`aspect` 只可填 `landscape`、`portrait` 或 `square`。

```md
---
title: 夏日港口
date: 2026-07-24
location: 香港
description: 傍晚散步时拍下的港口光线，收成一组慢慢翻完的照片。
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

`first-layout-demo.md` 和三张几何图只是首版预览示例；添加第一套真实照片后可替换或删除它。发布前请自行移除不希望公开的定位信息，并确保照片拥有公开版权或已获得授权。

## 搜索、更新流与 RSS

这些功能全部在 `npm run build` 时生成，不需要数据库、服务器或第三方搜索服务：

- 顶部隐藏栏中央可搜索公开开发日志全文、摄影套图、Now、Project Snow 和未来公开项目；按 Enter 会进入 `/search/` 查看完整结果与筛选项。
- 摄影搜索结果会使用 `/gallery/#photo-set-文件名`，进入摄影页后自动打开同页的套图阅读窗。
- `/updates/` 按日期合并公开开发日志、摄影套图、Project Snow 与公开项目案例。
- `/rss.xml` 只收录开发日志、摄影套图与公开项目，不收录 Now 或任何草稿。

上线前务必在 Cloudflare Pages 设置正式的 `PUBLIC_SITE_URL`。RSS 使用它生成绝对链接；若保留示例域名，订阅器里的链接也会指向示例地址。

## 添加未来项目案例

Project Snow 保持在 `/projects/project-snow/` 的独立页面，不需要迁移。以后新增作品集项目时：

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

## Project Snow 的后续服务

本站当前只展示 Project Snow，不分发其原始数据或伪造在线 RAG。未来在线体验应部署在独立子域名，并由服务端处理 Turnstile、匿名限额、模型密钥、向量检索和引用来源；长期用户则通过项目仓库进行本地部署。
