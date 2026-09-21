# 可选统计

`public/statistics/config.mjs` 默认关闭，不创建统计标识、不请求采集服务。开启后由用户主动选择允许；配置公开路径列表和独立采集 endpoint，外域地址需要精确加入 CSP connect-src。

正式发布在 Cloudflare Pages 的 **Production** 构建环境中设置 `PUBLIC_STATISTICS_ENABLED=true`；预览环境保持不设置或 `false`。`npm run build` 最后只将生成目录 `dist/statistics/config.mjs` 中的公开布尔开关改为指定值，不修改源文件、不读取其他环境凭据，也不请求统计服务。允许值是 `true`、`false` 或空；错误值使构建明确失败。用户仍须另行主动同意，发布开关不代表用户同意。

关闭时将该环境变量改为 `false` 并重新发布，核对正式 `/statistics/config.mjs` 为 `enabled: false`。已打开的标签页刷新后取得新配置；紧急情况下可先关闭 collector 接收，使未刷新页面的请求不能入库。配置以 `no-store` 发布，但这不会自动替换已经执行的页面脚本。页脚公开统计入口由独立的 `PUBLIC_STATISTICS_PAGE_ENABLED=true` 控制；关闭采集与移除页面分别操作。

统计页面 `/statistics/` 和首页/项目页紧凑卡优先读取构建生成的同源 `/statistics-summary.json`，避免公开汇总端点缺少 CORS 时影响浏览器；该快照由构建时请求 `summaryEndpoint` 生成，失败时写入可渲染的 unavailable 合约。运行时仍保留 summaryEndpoint 作为配置降级源。页脚入口由 PUBLIC_STATISTICS_PAGE_ENABLED=true 控制。公开 JSON 仅允许聚合，页面没有数据库凭据。

实现源为独立 Snow_Statistics 仓库中的 v1 浏览器适配器，当前仓库持有完整副本，运行、构建和测试不依赖其存在。修改副本后独立测试、提交与发布。

移除：回退 BaseLayout 模块入口，删除 public/statistics，移除/归档 statistics 页面及页脚入口。不会修改业务数据库或主题/语言偏好。
