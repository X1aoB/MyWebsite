# 可选统计

`public/statistics/config.mjs` 默认关闭，不创建统计标识、不请求采集服务。开启后由用户主动选择允许；配置公开路径列表和独立采集 endpoint，外域地址需要精确加入 CSP connect-src。

统计页面 `/statistics/` 在运行时读取 summaryEndpoint；构建不调用统计服务，失败显示暂不可用。页脚入口由 PUBLIC_STATISTICS_PAGE_ENABLED=true 控制。公开 JSON 仅允许聚合，页面没有数据库凭据。

实现源为独立 Snow_Statistics 仓库中的 v1 浏览器适配器，当前仓库持有完整副本，运行、构建和测试不依赖其存在。修改副本后独立测试、提交与发布。

移除：回退 BaseLayout 模块入口，删除 public/statistics，移除/归档 statistics 页面及页脚入口。不会修改业务数据库或主题/语言偏好。
