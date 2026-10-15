# 可选统计

`public/statistics/config.mjs` 默认关闭，不创建统计标识、不请求采集服务。开启后由用户主动选择允许；配置公开路径列表和独立采集 endpoint，外域地址需要精确加入 CSP connect-src。

正式发布在 Cloudflare Pages 的 **Production** 构建环境中设置 `PUBLIC_STATISTICS_ENABLED=true`；预览环境保持不设置或 `false`。`npm run build` 最后只将生成目录 `dist/statistics/config.mjs` 中的公开布尔开关改为指定值，不修改源文件、不读取其他环境凭据，也不请求统计服务。允许值是 `true`、`false` 或空；错误值使构建明确失败。用户仍须另行主动同意，发布开关不代表用户同意。

关闭时将该环境变量改为 `false` 并重新发布，核对正式 `/statistics/config.mjs` 为 `enabled: false`。已打开的标签页刷新后取得新配置；紧急情况下可先关闭 collector 接收，使未刷新页面的请求不能入库。配置以 `no-store` 发布，但这不会自动替换已经执行的页面脚本。页脚公开统计入口由独立的 `PUBLIC_STATISTICS_PAGE_ENABLED=true` 控制；关闭采集与移除页面分别操作。

统计页面 `/statistics/` 和首页/项目页紧凑卡运行时优先读取 `summaryEndpoint`，每次读取使用 `no-store` 和时间参数，避免 CDN 或浏览器保留旧汇总；同源 `/statistics-summary.json` 是构建生成的故障回退快照，失败时写入可渲染的 unavailable 合约。完整页面和紧凑卡都会在页面可见时定期刷新，页面隐藏时暂停请求。页脚入口由 PUBLIC_STATISTICS_PAGE_ENABLED=true 控制。公开 JSON 仅允许聚合，页面没有数据库凭据。

紧凑卡按各自应用选择最近一个至少有一组 `published` 的统计日期，所有指标均来自该日期，不拼接不同日期的数值；该日期未公开的组继续显示“样本不足”“等待公开”或“无数据”。若所有日期均未公开，显示最新日期的原始状态；完全没有日期时显示无数据。卡片明确显示所选统计日期，完整统计页保留逐日记录。此选择不改变 D+3、样本门槛、公开接口或采集策略。

实现源为独立 Snow_Statistics 仓库中的 v1 浏览器适配器，当前仓库持有完整副本，运行、构建和测试不依赖其存在。修改副本后独立测试、提交与发布。

本站副本目前有两处尚未回传上游的本地改动。第一处：`bootstrap.mjs` 把“服务质量统计”和“保留期限”两段放进 `<details>`（展开说明），同意条首层只保留标题、一句说明、隐私说明链接和三个按钮。存储键、30 天时效、页脚撤销入口和同意语义均未改变，测试见 `src/lib/statistics-notice.test.ts`。第二处是关闭按钮的中文文案：尚未选择时显示“稍后再说”（只关闭本次提示，不保存选择），已选择后从页脚设置重新打开时显示“完成”，英文保持 “Close notice”；原文案“收起说明”和“展开说明”放在一起容易误读成一对展开收起。从上游重新覆盖副本前，先把这两处改动合入上游或重新应用。站点的主题样式写在 `src/styles/statistics-notice.css`，`public/statistics/notice.css` 保持适配器的中性默认样式。

移除：回退 BaseLayout 模块入口，删除 public/statistics，移除/归档 statistics 页面及页脚入口。不会修改业务数据库或主题/语言偏好。
