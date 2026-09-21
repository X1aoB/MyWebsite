export type PersonalSkillGroup = "data" | "release" | "content" | "career";

export type PersonalSkill = {
  slug: string;
  group: PersonalSkillGroup;
  icon: string;
  title: { zh: string; en: string };
  summary: { zh: string; en: string };
  useWhen: { zh: string; en: string };
  output: { zh: string; en: string };
  tags: string[];
};

export const personalSkillGroups: Array<{ id: PersonalSkillGroup; title: { zh: string; en: string }; description: { zh: string; en: string } }> = [
  { id: "data", title: { zh: "数据与证据", en: "Data & evidence" }, description: { zh: "从采集、契约到可追溯的统计与基准整理。", en: "From collection and contracts to traceable statistics and benchmark curation." } },
  { id: "release", title: { zh: "交付与质量", en: "Delivery & quality" }, description: { zh: "把候选改动变成可验收、可回滚的发布。", en: "Turn candidate changes into releases that can be accepted and rolled back." } },
  { id: "content", title: { zh: "内容与文档", en: "Content & documents" }, description: { zh: "静态内容、旅行手册和可复用的文档生产流程。", en: "Reusable production flows for static content, handbooks, and documents." } },
  { id: "career", title: { zh: "职业材料", en: "Career material" }, description: { zh: "让项目证据准确对应职位要求和申请材料。", en: "Connect project evidence to role requirements and application material." } }
];

export const personalSkills: PersonalSkill[] = [
  {
    slug: "production-data-pipeline-runbook", group: "data", icon: "01",
    title: { zh: "生产数据管道运行手册", en: "Production data pipeline runbook" },
    summary: { zh: "规划批处理、虚拟机资源闸门、暂停恢复和故障记录。", en: "Plan batch jobs, VM resource gates, pause and recovery steps, and incident records." },
    useWhen: { zh: "需要安全启动、暂停或恢复一条数据链路时。", en: "When a data flow needs to be started, paused, or recovered safely." },
    output: { zh: "带前置检查、操作记录、停止条件和恢复证据的运行单。", en: "A run sheet with preflight checks, stop conditions, operations, and recovery evidence." },
    tags: ["VM", "batch", "runbook"]
  },
  {
    slug: "data-contract-quality-gate", group: "data", icon: "02",
    title: { zh: "数据契约质量门禁", en: "Data contract quality gate" },
    summary: { zh: "检查 Schema、版本兼容、去重、隔离和黄金指标。", en: "Check schemas, version compatibility, deduplication, quarantine, and golden metrics." },
    useWhen: { zh: "新增字段、升级事件协议或接入新数据源时。", en: "When adding fields, changing an event contract, or onboarding a source." },
    output: { zh: "契约差异、质量结果、风险等级和是否放行的结论。", en: "A contract diff, quality result, risk level, and release decision." },
    tags: ["schema", "quality", "compatibility"]
  },
  {
    slug: "observability-lineage-and-evidence", group: "data", icon: "03",
    title: { zh: "可观测性、血缘与证据", en: "Observability, lineage, and evidence" },
    summary: { zh: "把新鲜度、血缘、日志、指标和验证收据整理成可信状态。", en: "Turn freshness, lineage, logs, metrics, and validation receipts into a trustworthy status." },
    useWhen: { zh: "需要解释数据从哪里来、是否新鲜、结果是否可信时。", en: "When you need to explain provenance, freshness, or confidence in a result." },
    output: { zh: "来源图、时间线、异常说明和可复核证据清单。", en: "A source map, timeline, exception note, and reviewable evidence checklist." },
    tags: ["lineage", "freshness", "evidence"]
  },
  {
    slug: "release-acceptance-and-rollback", group: "release", icon: "04",
    title: { zh: "发布验收与回滚", en: "Release acceptance and rollback" },
    summary: { zh: "设计候选版本、CI、人工验收、发布、回滚和收据。", en: "Design candidate, CI, manual acceptance, promotion, rollback, and receipt steps." },
    useWhen: { zh: "准备把网站、服务或数据任务从候选状态推到生产时。", en: "When a site, service, or data job is moving from candidate to production." },
    output: { zh: "验收矩阵、发布门槛、回滚点和上线后观察项。", en: "An acceptance matrix, promotion gates, rollback point, and post-release checks." },
    tags: ["release", "rollback", "CI"]
  },
  {
    slug: "privacy-safe-analytics-integration", group: "release", icon: "05",
    title: { zh: "隐私安全的统计接入", en: "Privacy-safe analytics integration" },
    summary: { zh: "规划默认关闭、用户同意、公开聚合、CORS/CSP 和数据边界。", en: "Plan opt-in collection, public aggregates, CORS/CSP, and data boundaries." },
    useWhen: { zh: "给静态站或独立产品增加匿名统计和公开摘要时。", en: "When adding anonymous analytics and public summaries to a static site or product." },
    output: { zh: "采集白名单、同意流程、脱敏规则、保留策略和撤销方案。", en: "An allowlist, consent flow, redaction rules, retention policy, and revocation plan." },
    tags: ["privacy", "consent", "CSP"]
  },
  {
    slug: "static-site-content-release", group: "content", icon: "06",
    title: { zh: "静态站内容发布", en: "Static site content release" },
    summary: { zh: "管理 Astro 内容、Schema、搜索、RSS、构建检查和部署。", en: "Manage Astro content, schemas, search, RSS, build checks, and deployment." },
    useWhen: { zh: "发布日志、项目页、工具页或其他结构化静态内容时。", en: "When publishing a journal entry, project page, tool, or structured static content." },
    output: { zh: "内容清单、链接/Schema 检查、构建结果和发布记录。", en: "A content inventory, link/schema checks, build result, and release record." },
    tags: ["Astro", "content", "SEO"]
  },
  {
    slug: "product-interface-qa-release", group: "release", icon: "07",
    title: { zh: "产品界面质量验收", en: "Product interface QA release" },
    summary: { zh: "覆盖响应式、可访问性、状态空态、截图回归和手动发布。", en: "Cover responsive behavior, accessibility, empty states, visual regression, and manual promotion." },
    useWhen: { zh: "改动产品页面、交互组件或跨端布局时。", en: "When changing product pages, interaction components, or cross-device layouts." },
    output: { zh: "桌面/移动检查表、关键路径结果和已知限制。", en: "A desktop/mobile checklist, key-path results, and known limitations." },
    tags: ["UI", "a11y", "responsive"]
  },
  {
    slug: "benchmark-data-curation", group: "data", icon: "08",
    title: { zh: "基准数据整理", en: "Benchmark data curation" },
    summary: { zh: "抓取、规范化、合并模型榜单，保存来源、快照和降级结果。", en: "Fetch, normalize, and merge model benchmarks with source, snapshot, and fallback handling." },
    useWhen: { zh: "需要把外部榜单或公开 API 变成稳定站内展示时。", en: "When turning an external leaderboard or public API into a stable site view." },
    output: { zh: "带来源时间、去重规则、异常状态和降级数据的快照。", en: "A snapshot with source times, deduplication rules, error states, and fallback data." },
    tags: ["benchmark", "snapshot", "fallback"]
  },
  {
    slug: "travel-handbook-and-document-production", group: "content", icon: "09",
    title: { zh: "旅行手册与文档生产", en: "Travel handbook and document production" },
    summary: { zh: "把路线、地图、二维码、来源和行程说明生成可交付文档。", en: "Turn routes, maps, QR codes, sources, and itinerary notes into a deliverable document." },
    useWhen: { zh: "制作旅行手册、操作手册或其他需要渲染质检的文档时。", en: "When producing a travel handbook, operating manual, or render-sensitive document." },
    output: { zh: "结构化源稿、DOCX/PDF、渲染检查和可访问性记录。", en: "Structured source, DOCX/PDF output, render checks, and accessibility notes." },
    tags: ["DOCX", "PDF", "render QA"]
  },
  {
    slug: "resume-and-application-tailoring", group: "career", icon: "10",
    title: { zh: "简历与申请材料定制", en: "Resume and application tailoring" },
    summary: { zh: "拆解职位要求，用项目证据改写简历并校验每项表述。", en: "Break down role requirements, rewrite from project evidence, and verify every claim." },
    useWhen: { zh: "准备简历、项目介绍、求职信或面试项目讲解时。", en: "When preparing a resume, project summary, cover letter, or interview explanation." },
    output: { zh: "要求-证据矩阵、定制稿、事实校验表和待补信息。", en: "A requirement-evidence matrix, tailored draft, fact-check table, and missing-input list." },
    tags: ["resume", "evidence", "interview"]
  }
];
