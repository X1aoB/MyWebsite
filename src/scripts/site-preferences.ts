type Locale = "zh" | "en";
type Theme = "ice" | "holo";

const themeStorageKey = "x1ao-theme";
const localeStorageKey = "x1ao-locale";
let themeTransitionSequence = 0;
let themeTransitionTimer: number | undefined;

const translations: Record<string, string> = {
  "相关标签": "Related tags",
  "标签": "Tags",
  "站点更新": "Site updates",
  "内容来源": "Content source",
  "关键词": "Keywords",
  "搜索全站": "Search the site",
  "搜索全站内容": "Search the site",
  "搜索建议": "Search suggestions",
  "清除搜索": "Clear search",
  "订阅 RSS": "Subscribe via RSS",
  "更新": "Updates",
  "跳到主要内容": "Skip to main content",
  "首页": "Home",
  "开发日志": "Dev Log",
  "数据工具": "Data Tools",
  "工具": "Tools",
  "工具索引": "Tool index",
  "模型 IQ 对比表": "Model IQ comparison table",
  "Project log": "Project log",
  "摄影集": "Photography",
  "关于": "About",
  "打开导航菜单": "Open navigation menu",
  "Xiao B · Data & Systems 首页": "Xiao B · Data & Systems home",
  "主导航": "Primary navigation",
  "数据开发、可追溯知识库，以及被认真记录下来的项目过程。": "Data development, traceable knowledge bases, and project work documented with care.",
  "静态优先 · 持续构建": "Static first · continuously built",
  "站点索引": "Site index",
  "持续推进": "In progress",
  "先把采集、增量更新与来源链路做扎实，再进入检索与 RAG 阶段。": "Build reliable collection, incremental updates, and provenance first; retrieval and RAG come next.",
  "快速入口": "Quick links",
  "关于与作品集": "About & portfolio",
  "访问 GitHub ↗": "Visit GitHub ↗",
  "尘尘的白工作台 · 静态优先": "Snowbreak workspace · static first",
  "站点链接": "Site links",
  "站点在线": "Online",
  "站点状态": "Site status",
  "公开入口": "Public links",
  "查看来源 ↗": "View source ↗",
  "隐私与数据说明": "Privacy & data",
  "站点设置": "Site settings",
  "主题": "Theme",
  "尘尘的白": "Snowbreak",
  "苹果与狼": "Spice&Wolf",
  "语言": "Language",
  "打开站点设置": "Open site settings",
  "把数据、项目与碎片，": "Data, projects, and fragments—",
  "留下可见的轨迹。": "leave a visible trail.",
  "这里记录数据工程实践、可追溯知识库与仍在生长的 Project Snow；也留出一格空间，收藏开发之外的照片和观察。": "A record of data-engineering work, traceable knowledge bases, and the evolving Project Snow—with room for photographs and observations beyond development.",
  "查看 Project Snow": "Explore Project Snow",
  "阅读开发日志": "Read the dev log",
  "站点特性": "Site principles",
  "静态优先": "Static first",
  "来源可追溯": "Traceable sources",
  "工具本地处理": "Local-only tools",
  "预留的角色插画位置": "Reserved character artwork area",
  "主题插画": "Theme artwork",
  "里芙·贝斯特拉": "Lyfe Bestla",
  "赫萝": "Holo",
  "里芙·贝斯特拉的蓝白主题插画": "Blue-and-white artwork of Lyfe Bestla",
  "赫萝与麦穗的暖色主题插画": "Warm artwork of Holo with wheat",
  "当前主项目": "Current project",
  "项目状态与路线图": "Status & roadmap",
  "正在构建": "In progress",
  "先构建可信的数据层，再讨论检索与对话。": "Build a trustworthy data layer before discussing retrieval and conversation.",
  "现阶段聚焦原始资料采集、增量更新、规则分类和来源治理。RAG 服务会在数据链路足够可靠后独立部署，不在本站伪造在线对话。": "The current focus is source collection, incremental updates, rule-based classification, and provenance. A RAG service will be deployed independently only when the data pipeline is reliable enough—this site does not simulate an online chat experience.",
  "Project Snow 技术标签": "Project Snow technologies",
  "数据采集": "Data collection",
  "来源溯源": "Provenance",
  "查看源码 ↗": "View source ↗",
  "最近更新": "Recent updates",
  "查看全部": "View all",
  "第一篇开发日志正在整理中。": "The first development log is being prepared.",
  "继续探索": "Keep exploring",
  "更多功能与展示": "More features & showcases",
  "打开工具": "Open tools",
  "用于收纳自己拍摄的照片，以及每一张的简短上下文。": "A home for photographs I take, along with a small piece of context for each one.",
  "进入相册": "Open gallery",
  "数据开发方向、公开项目与后续协作入口。": "Data-development direction, public projects, and ways to collaborate.",
  "了解更多": "Learn more",
  "把偶然留住，也把拍摄时间与地点整理成能回看的小档案。": "Keep the accidental moments, and turn time and place into a small archive worth revisiting.",
  "当前归档作品": "Archived works",
  "内置的三张几何图仅用于演示布局。替换为自己的照片与对应的 Markdown 信息后，作品会自动出现在这里。": "The three geometric images are layout samples only. Replace them with your own photos and Markdown metadata, and the work will appear here automatically.",
  "小B的随拍记录": "Xiao B's casual photo notes",
  "组已归档套图": "archived photo sets",
  "摄影套图列表": "Photo-set list",
  "打开套图": "Open set",
  "图片按原始比例排列，点按任意画面即可放大查看。": "Images keep their original proportions; select any frame to view it large.",
  "点击标题图会在当前页面打开可下拉阅读的套图窗。现在放的是版式示例；换成自己的图片和说明后，新的套图会自动出现。": "Select a cover to open a scrollable photo-set window on this page. The current entry is a layout sample; replace it with your own images and notes, and new sets will appear automatically.",
  "返回摄影集": "Back to photography",
  "时间": "Date",
  "地点": "Place",
  "设备": "Equipment",
  "影像": "Images",
  "照片": "Photos",
  "套图标签": "Photo-set tags",
  "这一套图看到这里就先收好。下次想补一张照片或一句说明时，直接改对应的 Markdown 就行。": "That is this set for now. When you want to add another photo or a line of context, edit its Markdown file directly.",
  "回到全部套图": "Back to all sets",
  "这一套图先收到这里。下次想补一张照片或一句说明时，直接改对应的 Markdown 就行。": "That is this set for now. When you want to add another photo or a line of context, edit its Markdown file directly.",
  "晨光占位图": "Dawn placeholder",
  "冰窗占位图": "Ice-window placeholder",
  "夜行占位图": "Night-walk placeholder",
  "替换为拍摄地点": "Replace with location",
  "示例": "Sample",
  "套图": "Photo set",
  "横幅": "Landscape",
  "竖幅": "Portrait",
  "方形": "Square",
  "这是用于预览相册版式的原创几何占位图；上传自己的横幅照片后可直接替换此文件中的 image 路径与文字。": "An original geometric placeholder for previewing the gallery layout. Replace its image path and copy with your own landscape photo.",
  "这是用于预览竖幅作品卡片的原创几何占位图；可替换为人像、建筑或任何竖构图照片。": "An original geometric placeholder for a vertical work card. Replace it with a portrait, building, or any vertical composition.",
  "这是用于预览方形作品卡片的原创几何占位图；可替换为街景、静物或任意方形裁切照片。": "An original geometric placeholder for a square work card. Replace it with a street scene, still life, or any square crop.",
  "Build notes / 中文优先": "Build notes / Chinese first",
  "小B的项目开发路程": "Xiao B's project development journey",
  "阅读文章": "Read article",
  "返回开发日志": "Back to dev log",
  "Project Snow：为可追溯 RAG 构建数据底座": "Project Snow: building a traceable data foundation for RAG",
  "从 BWiki 采集和溯源，到本地检索、引用与角色对话 MVP，记录 Project Snow 的阶段性进展。": "From BWiki collection and provenance to local retrieval, citations, and a character-dialogue MVP: a record of Project Snow's current progress.",
  "数据工程": "Data engineering",
  "Project Snow 的目标并不是先做出一个会聊天的页面，而是把《尘白禁区》的公开资料整理成一条可验证、可恢复、可持续更新的数据链路，再让本地 MVP 在证据约束下尝试角色陪伴型对话。对于世界观问答来说，模型回答之前的数据质量决定了它是否值得相信。": "Project Snow is not about starting with a chat page. It organizes public Snowbreak material into a verifiable, recoverable, continuously updated data pipeline, then tests character-companion dialogue in a local MVP constrained by evidence. For world-building questions, data quality before a model responds determines whether the answer deserves trust.",
  "第一阶段：保留来源，而不是只保留结果": "Phase one: preserve sources, not only results",
  "当前阶段从《尘白禁区》BWiki 发现并采集剧情、角色资料、角色皮肤、语音、心意内容、家具与物品背景。采集器保存原始 HTML 或维基文本，同时记录页面地址、哈希、抓取状态和分类信息。": "The current phase discovers and collects story, character, skin, voice, affinity, furniture, and item-background data from the Snowbreak BWiki. The collector keeps original HTML or wiki text alongside page URLs, hashes, fetch state, and categories.",
  "这样做的意义是：后续无论是进行清洗、结构化还是检索，都可以回到来源页面复核，而不是把不可解释的文本直接送进模型。": "This means later cleaning, structuring, and retrieval can all be verified against source pages instead of sending unexplained text straight into a model.",
  "增量更新与可恢复运行": "Incremental updates and recoverable runs",
  "网站资料会变化，也会出现限流和临时失败。因此采集流程保留状态文件与运行报告，支持仅处理新增页面、分批恢复和目录校验。面对反爬响应时，流程会停止当前批次，而不是尝试绕过站点规则。": "Website material changes, and rate limits or temporary failures happen. The collection flow retains state files and run reports, supports new-page-only processing, batch recovery, and directory checks. When anti-bot responses appear, the current batch stops rather than attempting to bypass site rules.",
  "这类约束看似保守，但它让数据链路更适合长期维护：失败有记录、来源可追溯、每次运行都有边界。": "These constraints may look conservative, but they make the pipeline sustainable: failures are logged, sources are traceable, and each run has clear limits.",
  "从数据底座到本地 MVP": "From data foundation to local MVP",
  "采集链路现在已经接入 Project Snow 的 App 应用层。来源清单中的页面会被整理进 lakehouse，并生成词法索引、本地向量索引、角色证据画像和最新状态的对话表达档案。FastAPI 本地接口提供检索、证据检查、关系图谱查看和 MVP 对话入口；每条检索结果仍保留 document_id、页面地址、来源类型和许可信息，回答可以回到原始页面复核。": "The collection pipeline is now connected to Project Snow's App layer. Manifested source pages are organized into a lakehouse, with lexical and local vector indexes, character evidence profiles, and latest-state dialogue profiles. The local FastAPI API provides retrieval, evidence inspection, graph inspection, and an MVP dialogue entry point; every result keeps its document_id, page URL, source type, and license so answers can be checked against the source.",
  "检索不再只按字面匹配。偏好、关系、语音、经历和日常等问题会触发意图提示，角色直接绑定的邮件、语音、个人 / 好感故事和随机事件会优先于无角色绑定的主线片段；只有证据不足时才保留拒答。当前本地测试、架构校验和 MVP 视图重建已经通过，真实模型调用也完成了烟雾验证，但这仍是本地验证，不代表公网服务已经上线。": "Retrieval is no longer only literal matching. Preference, relationship, voice, experience, and daily questions trigger intent hints, so directly bound mail, voice, personal / affinity stories, and random events outrank unbound main-story fragments; refusal is kept only when evidence is insufficient. Local tests, architecture validation, and MVP view rebuilding have passed, and a real model smoke test has completed, but this remains local validation rather than a public service.",
  "MVP 现在有两种由服务端约束的模式：immersive 沉浸式陪伴和 assistant 角色助手。前者隐藏检索、模型和工具概念，后者只解释后端明确开放的证据能力；会话按角色与模式隔离，切换不会串入另一种上下文。消息中提到具体装甲或时装时，系统会自动识别并关联对应语境，语境会持续到用户说“换回本体”等重置表达；不指定时不会随机混入时装资料。": "The MVP now has two server-constrained modes: immersive companionship and a character assistant. The former hides retrieval, model, and tool concepts; the latter explains only explicitly exposed evidence capabilities. Sessions are isolated by character and mode, so switching cannot leak context. Naming an armor or costume activates its context automatically until a reset such as “return to default”; without an explicit name, costume material is not mixed in at random.",
  "对话背景默认投影角色最新可用的叙事状态，日期只用于还原事件顺序，不会把角色倒退到旧章节。正文明确写出的关系事实会作为高优先级背景，尚在审核队列的关系候选仍只是证据，不会自动改变角色设定。": "Dialogue context defaults to each character's latest available narrative state; dates reconstruct event order but do not rewind a character to an older chapter. Explicit relationship facts in source text become high-priority background, while relationship candidates awaiting review remain evidence and never change the character definition automatically.",
  "关系图谱与人工审核边界": "Relationship graph & human-review boundary",
  "应用层已经能够读取确定性关系并展示来源；模型抽取的关系候选会进入分批人工审核，独立二次模型只提供建议。任何候选都不会自动升级为正式图谱边，来自邮件、随机事件、活动或时装的关系也会保留情境范围，避免一次性内容污染角色本体设定。": "The application layer can read deterministic relationships and show their sources. Model-extracted candidates go through batched human review, while an independent second model only offers advice. No candidate is promoted to a canonical graph edge automatically; relationships from mail, random events, events, or costumes retain their situational scope so one-off material cannot pollute the core character definition.",
  "下一步：从本地验证到独立服务": "Next: from local validation to an independent service",
  "后续会继续完善人工审核、关系索引和角色一致性控制，再把本地 MVP 拆成独立的在线 RAG 服务。公网体验将采用匿名限额、Turnstile、服务端密钥保护和来源引用；长期使用则通过 GitHub 提供本地部署说明，不在本站分发原始采集数据。": "Next, human review, relationship indexes, and character-consistency controls will be refined before the local MVP is split into an independent online RAG service. The public experience will use anonymous quotas, Turnstile, server-side key protection, and source citations; long-term use will be supported by GitHub local-deployment notes, while this site will not distribute raw collected data.",
  "在那之前，Project Snow 会继续把重点放在数据治理和本地可复现的能力上。项目源码、运行说明和后续部署方式会持续在 GitHub 更新。": "Until then, Project Snow will keep its focus on data governance and locally reproducible workflows. Source code, operating notes, and deployment guidance will continue to be updated on GitHub.",
  "数据来源为尘白禁区 BWiki；默认许可证为 CC BY-NC-SA 4.0，页面特殊声明优先。游戏及原始内容版权归其权利人所有。本站不分发原始采集数据，也不伪造在线对话。": "Data is sourced from the Snowbreak BWiki; the default license is CC BY-NC-SA 4.0, subject to page-specific notices. Game and original-content rights remain with their respective owners. This site does not distribute raw collected data or simulate an online dialogue.",
  "讨论": "Discussion",
  "留下你的想法": "Leave your thoughts",
  "评论区将在站点部署配置完成后启用。": "Comments will be enabled after deployment configuration is complete.",
  "前往 GitHub Discussions 参与讨论 ↗": "Join the discussion on GitHub Discussions ↗",
  "基于 RAG 架构的《尘白禁区》世界观智能对话系统。项目先构建可持续更新的数据采集与治理链路，再逐步加入剧情结构化、检索、角色一致性与对话服务。": "A Snowbreak world-building dialogue system based on a RAG architecture. The project first builds a sustainable data collection and governance pipeline, then progressively adds story structuring, retrieval, character consistency, and conversation services.",
  "查看 GitHub 源码 ↗": "View GitHub source ↗",
  "阅读项目总览": "Read project overview",
  "第一阶段已实现": "Phase one complete",
  "原始数据采集与来源治理": "Original-data collection & provenance governance",
  "当前重点是可信数据层，而不是提前包装一个不可验证的聊天界面。": "The focus is a trustworthy data layer, not prematurely packaging an unverifiable chat interface.",
  "系统链路": "System pipeline",
  "先让每一段数据都能回到来源。": "Let every piece of data lead back to its source.",
  "已实现的阶段以原始资料与状态记录为边界；后续阶段会在不丢失溯源能力的前提下增加结构化和检索。": "Completed stages are bounded by original material and state records; the next stages add structure and retrieval without losing provenance.",
  "页面发现与采集": "Page discovery & collection",
  "从受控入口发现 Wiki 页面，保存原始 HTML 或维基文本，不下载媒体二进制。": "Discover Wiki pages through controlled entry points, save original HTML or wiki text, and do not download media binaries.",
  "状态与清单": "State & manifest",
  "以哈希、抓取状态、运行报告和索引文件支持增量更新与可恢复批次。": "Use hashes, fetch state, run reports, and index files to support incremental updates and recoverable batches.",
  "结构化与检索": "Structuring & retrieval",
  "将剧情、角色和关系整理为可查询的数据模型，并保留来源位置。": "Organize stories, characters, and relationships into queryable data models while preserving source locations.",
  "受控 RAG 服务": "Controlled RAG service",
  "独立部署在线体验，提供来源引用、限流与滥用防护；长期使用引导本地部署。": "Deploy the online experience independently, with source citations, rate limits, and abuse prevention; guide long-term use toward local deployment.",
  "路线图": "Roadmap",
  "从资料收集到可引用的回答。": "From collecting material to citable answers.",
  "已完成": "Completed",
  "已验证": "Validated",
  "原始数据采集层": "Original-data collection layer",
  "覆盖剧情、角色资料、皮肤、语音、心意内容、家具和物品背景；支持规则分类、增量更新与校验。": "Covers story, character material, skins, voices, affinity content, furniture, and item backgrounds; supports rule-based classification, incremental updates, and validation.",
  "进行中": "In progress",
  "数据治理与结构化": "Data governance & structuring",
  "整理稳定的阅读索引和关系数据，为后续 ETL 与知识库构建准备可验证输入。": "Prepare stable reading indexes and relationship data as verifiable inputs for later ETL and knowledge-base work.",
  "下一阶段": "Next phase",
  "检索、角色一致性与对话": "Retrieval, character consistency & dialogue",
  "建立带引用的检索结果，随后接入受控模型服务；公开体验不暴露密钥，也不绕过来源网站规则。": "Create retrieval results with citations, then connect a controlled model service; public use exposes no secrets and does not bypass source-site rules.",
  "来源与许可": "Sources & licensing",
  "项目当前数据来源为": "The project's current data source is",
  "。默认许可证为 CC BY-NC-SA 4.0，页面特殊说明优先；游戏及原始内容版权归其权利人所有。本站不分发原始采集数据。": ". The default license is CC BY-NC-SA 4.0, subject to page-specific notices; game and original-content rights remain with their respective owners. This site does not distribute original collected data.",
  "未来在线体验": "Future online experience",
  "RAG 试玩服务尚未上线。": "The RAG demo is not online yet.",
  "上线时将采用匿名限额、来源引用和服务端密钥保护。需要长期使用的用户将可从 GitHub 获取本地部署说明，并自行选择本地模型或自己的 API 凭据。": "When released, it will use anonymous quotas, source citations, and server-side key protection. Long-term users will be able to obtain local-deployment instructions from GitHub and choose a local model or their own API credentials.",
  "关注项目进展 ↗": "Follow project progress ↗",
  "v0.3 多模态 Agent 基线已完成；v0.5 双入口 UI 正在开发，月末争取开放受控试玩。": "The v0.3 multimodal Agent baseline is complete; the v0.5 dual-entry UI is in development, with a controlled preview targeted for the end of the month.",
  "本地 MVP 验证中": "Local MVP validation",
  "检索、引用与角色语境已跑通": "Retrieval, citations, and character context are working",
  "Project Snow/App 已提供 FastAPI 本地接口和静态预览；检索结果保留原始页面引用，关系候选仍需人工审核，不会自动写入正式图谱。": "Project Snow/App provides a local FastAPI API and static preview; retrieval results keep original page citations, and relationship candidates still require human review rather than being written to the canonical graph automatically.",
  "基于 RAG 架构的《尘白禁区》角色陪伴型对话系统。数据链路已经从采集进入本地 MVP：现在验证证据检索、角色专属资料优先级、对话模式和装甲 / 时装语境；在线服务仍未部署。": "A Snowbreak character-companion dialogue system based on RAG. Its data pipeline has moved from collection into a local MVP, validating evidence retrieval, character-specific priorities, dialogue modes, and armor / costume context; the online service is not deployed yet.",
  "从可追溯数据底座进入本地 RAG MVP：验证证据检索、角色专属资料优先级、对话模式和装甲 / 时装语境。": "A traceable data foundation now powers a local RAG MVP, validating evidence retrieval, character-specific priorities, dialogue modes, and armor / costume context.",
  "从可追溯资料到本地对话验证。": "From traceable material to local dialogue validation.",
  "采集和状态治理已经形成基础；应用层继续构建 lakehouse、索引、证据画像和关系审核，MVP 对话只读取本地运行时产物。": "Collection and state governance are in place; the application layer now builds a lakehouse, indexes, evidence profiles, and relationship review, while the MVP dialogue reads only local runtime artifacts.",
  "状态、清单与增量运行": "State, manifests & incremental runs",
  "以哈希、抓取状态、运行报告和索引文件支持增量更新、分批恢复与目录校验。": "Hashes, fetch state, run reports, and index files support incremental updates, batch recovery, and directory checks.",
  "证据检索与意图重排": "Evidence retrieval & intent reranking",
  "已生成 lakehouse、词法索引和本地向量索引；偏好、关系、语音、经历等问题会优先角色直接证据，并保留页面引用。": "A lakehouse, lexical index, and local vector index are in place; preference, relationship, voice, and experience questions prioritize direct character evidence while keeping page citations.",
  "对话模式与角色语境": "Dialogue modes & character context",
  "MVP 支持沉浸式陪伴与角色助手两种模式，会话隔离；消息可自动识别装甲 / 时装并关联对应证据。": "The MVP supports isolated immersive-companion and character-assistant modes; messages can identify armor / costumes and attach the matching evidence.",
  "独立受控 RAG 服务": "Independent controlled RAG service",
  "未来再独立部署在线体验，补齐匿名限额、来源引用、服务端密钥和滥用防护；长期使用引导本地部署。": "The online experience will be deployed independently later with anonymous quotas, source citations, server-side keys, and abuse protection; long-term use will be guided toward local deployment.",
  "从资料收集到可引用的角色回应。": "From collecting material to citable character responses.",
  "原始数据采集与溯源": "Original-data collection & provenance",
  "覆盖剧情、角色资料、皮肤、语音、心意内容、家具和物品背景；保留页面地址、哈希、分类和运行状态，支持增量更新。": "Covers story, character material, skins, voices, affinity content, furniture, and item backgrounds; keeps page URLs, hashes, categories, and run state for incremental updates.",
  "本地检索与 MVP 对话": "Local retrieval & MVP dialogue",
  "应用层已生成 lakehouse、词法 / 向量索引和角色证据画像；对话返回引用，并按问题意图优先角色专属邮件、语音、个人故事和随机事件等证据。": "The application layer has generated a lakehouse, lexical / vector indexes, and character evidence profiles; dialogue returns citations and prioritizes character mail, voices, personal stories, and random events by question intent.",
  "关系图谱人工审核": "Human review for the relationship graph",
  "确定性关系可供查询，模型抽取的关系候选进入分批审核；候选和二次模型意见都不会自动升级为正式图谱边。": "Deterministic relationships are queryable, while model-extracted candidates enter batched review; neither candidates nor second-model suggestions are promoted to canonical graph edges automatically.",
  "独立在线体验": "Independent online experience",
  "后续再接入受控模型服务和公网入口；每次回答保留可访问来源，并在服务端处理限流、Turnstile、密钥和成本控制。": "A controlled model service and public entry point will come later; every answer will keep accessible sources, with rate limits, Turnstile, keys, and cost handled server-side.",
  "本地验证 / 在线服务": "Local validation / online service",
  "本地 MVP 已可运行，公网 RAG 尚未上线。": "The local MVP runs; the public RAG service is not online yet.",
  "在 Project_Snow/App 中可以启动 FastAPI 与静态预览，使用本地运行时数据验证检索、引用和两种对话模式；公开服务后再补齐匿名限额、Turnstile、服务端密钥和滥用防护。长期使用仍以 GitHub 本地部署为主。": "Project_Snow/App can launch a FastAPI API and static preview for validating retrieval, citations, and both dialogue modes against local runtime data. Anonymous quotas, Turnstile, server-side keys, and abuse protection will be added for a public service; long-term use remains centered on local deployment from GitHub.",
  "查看项目运行说明 ↗": "View project run notes ↗",
  "采集、检索、引用与角色语境已经串起本地 MVP。": "Collection, retrieval, citations, and character context now form a local MVP.",
  "Project Snow / App 已形成可追溯的本地应用层：角色专属证据会按问题意图优先返回，沉浸式陪伴与角色助手彼此隔离，在线 RAG 服务仍未部署。": "Project Snow / App now has a traceable local application layer: character-specific evidence is prioritized by question intent, immersive companionship and the character assistant are isolated, and the online RAG service is not deployed yet.",
  "检索与引用": "Retrieval & citations",
  "角色语境": "Character context",
  "友情链接": "Friend links",
  "展开友情链接": "Expand friend links",
  "收起友情链接": "Collapse friend links",
  "Liups的小站": "Liups' site",
  "你好，我是小B。": "Hi, I'm Xiao B.",
  "个人信息模板 · 可直接替换方括号内容": "Profile template · replace the bracketed copy directly",
  "一句话介绍": "One-line introduction",
  "[例如：正在向数据开发方向发展的学生 / 开发者，喜欢把复杂问题整理成可验证的系统。]": "[For example: a student / developer moving toward data development, who likes turning complex problems into verifiable systems.]",
  "当前方向": "Current direction",
  "[例如：数据工程、Python、ETL、知识库与 RAG。]": "[For example: data engineering, Python, ETL, knowledge bases, and RAG.]",
  "这个站点": "This site",
  "[例如：记录项目进展、开发日志、摄影作品，以及一些真正有用的小工具。]": "[For example: project progress, dev logs, photography, and a few genuinely useful tools.]",
  "我的链接": "My links",
  "将能够公开访问、且愿意长期维护的入口集中放在这里。": "Keep public entry points that you are willing to maintain here.",
  "小B的链接": "Xiao B's links",
  "代码、项目与提交记录": "Code, projects, and commit history",
  "尘白禁区知识库项目源码": "Snowbreak knowledge-base project source",
  "本网站的源码与部署记录": "This site's source and deployment record",
  "联系邮箱": "Contact email",
  "[待填写：your-email@example.com]": "[To add: your-email@example.com]",
  "待补充": "To add",
  "正在做什么": "What I'm doing",
  "[在这里写目前投入的项目或学习目标。]": "[Write the project or learning goal you are currently investing in here.]",
  "例如：持续推进 Project Snow 的数据链路，同时补齐数据开发岗位需要的工程实践与作品集。": "For example: continue building Project Snow's data pipeline while developing the engineering practice and portfolio needed for data-development roles.",
  "合作与联系": "Collaboration & contact",
  "[在这里说明你愿意交流的话题。]": "[Describe the topics you are open to discussing here.]",
  "例如：欢迎围绕数据工程、知识库、个人工具或独立开发交流；正式联系请在上方补充邮箱或社交链接。": "For example: conversations about data engineering, knowledge bases, personal tools, or indie development are welcome; add your email or social links above for formal contact.",
  "页面未找到": "Page not found",
  "这条路径还没有被收录。回到首页，从开发日志、项目或数据工具重新进入。": "This path has not been archived. Return home and re-enter through the dev log, project, or data tools.",
  "返回首页": "Back home",
  "例如：{ \"project\": \"Project Snow\", \"phase\": 1 }": "Example: { \"project\": \"Project Snow\", \"phase\": 1 }",
  "关闭大图预览": "Close large preview",
  "查看上一张": "View previous",
  "查看下一张": "View next",
  "切换图片放大状态": "Toggle image zoom"
};

const titleTranslations: Record<string, string> = {
  "搜索 · Xiao B · Data & Systems": "Search · Xiao B · Data & Systems",
  "更新 · Xiao B · Data & Systems": "Updates · Xiao B · Data & Systems",
  "摄影集 · Xiao B · Data & Systems": "Photography · Xiao B · Data & Systems",
  "开发日志 · Xiao B · Data & Systems": "Dev Log · Xiao B · Data & Systems",
  "工具 · Xiao B · Data & Systems": "Tools · Xiao B · Data & Systems",
  "模型 IQ 雷达 · Xiao B · Data & Systems": "Model IQ radar · Xiao B · Data & Systems",
  "关于 · Xiao B · Data & Systems": "About · Xiao B · Data & Systems",
  "页面未找到 · Xiao B · Data & Systems": "Page not found · Xiao B · Data & Systems",
  "Project Snow：为可追溯 RAG 构建数据底座 · Xiao B · Data & Systems": "Project Snow: a traceable RAG data foundation · Xiao B · Data & Systems",
  "站点状态 · Xiao B · Data & Systems": "Site status · Xiao B · Data & Systems",
  "隐私与数据说明 · Xiao B · Data & Systems": "Privacy & data · Xiao B · Data & Systems"
};

const originalTexts = new WeakMap<Text, string>();
const originalAttributes = new WeakMap<Element, Map<string, string>>();

const getStoredPreference = <T extends string>(key: string, fallback: T, allowed: readonly T[]): T => {
  try {
    const value = window.localStorage.getItem(key);
    return value && allowed.includes(value as T) ? (value as T) : fallback;
  } catch {
    return fallback;
  }
};

const savePreference = (key: string, value: string) => {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // A private or restricted browser may deny persistence; the current page still works.
  }
};

const translateValue = (value: string, locale: Locale) => {
  if (locale === "zh") return value;
  const direct = translations[value];
  if (direct) return direct;

  const photoMatch = value.match(/^查看「(.+)」大图$/);
  if (photoMatch) return `View “${translations[photoMatch[1]] || photoMatch[1]}” full size`;

  const readMatch = value.match(/^阅读：(.+)$/);
  if (readMatch) return `Read: ${translations[readMatch[1]] || readMatch[1]}`;

  const countMatch = value.match(/^当前 (\d+) 张作品$/);
  if (countMatch) return `${countMatch[1]} archived works`;

  const setSummaryMatch = value.match(/^当前 (\d+) 组套图，共 (\d+) 个画面$/);
  if (setSummaryMatch) {
    const setLabel = setSummaryMatch[1] === "1" ? "photo set" : "photo sets";
    const frameLabel = setSummaryMatch[2] === "1" ? "image" : "images";
    return `${setSummaryMatch[1]} ${setLabel}, ${setSummaryMatch[2]} ${frameLabel}`;
  }

  const photoCountMatch = value.match(/^(\d+) 张照片$/);
  if (photoCountMatch) return `${photoCountMatch[1]} photos`;

  const frameCountMatch = value.match(/^(\d+) 张$/);
  if (frameCountMatch) return `${frameCountMatch[1]} photos`;

  const storyLabelMatch = value.match(/^(.+) 的照片与说明$/);
  if (storyLabelMatch) return `${translations[storyLabelMatch[1]] || storyLabelMatch[1]} — photos & notes`;

  const imageLabelMatch = value.match(/^(.+) 的影像$/);
  if (imageLabelMatch) return `${translations[imageLabelMatch[1]] || imageLabelMatch[1]} — images`;

  const openPhotoSetMatch = value.match(/^打开套图：(.+)$/);
  if (openPhotoSetMatch) return `Open photo set: ${translations[openPhotoSetMatch[1]] || openPhotoSetMatch[1]}`;

  const closePhotoSetMatch = value.match(/^关闭套图：(.+)$/);
  if (closePhotoSetMatch) return `Close photo set: ${translations[closePhotoSetMatch[1]] || closePhotoSetMatch[1]}`;

  return value;
};

const isTranslatableText = (node: Text) => {
  const parent = node.parentElement;
  if (!parent || parent.closest("[data-no-translate]")) return false;
  return !["SCRIPT", "STYLE", "TEXTAREA", "CODE", "PRE"].includes(parent.tagName);
};

const applyTextTranslations = (locale: Locale) => {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  let currentNode = walker.nextNode();

  while (currentNode) {
    if (currentNode instanceof Text && isTranslatableText(currentNode)) nodes.push(currentNode);
    currentNode = walker.nextNode();
  }

  nodes.forEach((node) => {
    const original = originalTexts.get(node) ?? node.nodeValue ?? "";
    if (!originalTexts.has(node)) originalTexts.set(node, original);
    const compact = original.trim();
    if (!compact) return;
    const translated = translateValue(compact, locale);
    node.nodeValue = original.replace(compact, translated);
  });
};

const applyLocalizedText = (locale: Locale) => {
  document.querySelectorAll<HTMLElement>("[data-localized-text]").forEach((element) => {
    const zh = element.dataset.zh ?? element.textContent ?? "";
    const en = element.dataset.en ?? zh;
    element.textContent = locale === "en" ? en : zh;
  });
};

const applyAttributeTranslations = (locale: Locale) => {
  document.querySelectorAll<HTMLElement>("[aria-label], [placeholder], [title], [alt]").forEach((element) => {
    const attributes = ["aria-label", "placeholder", "title", "alt"];
    let originals = originalAttributes.get(element);
    if (!originals) {
      originals = new Map<string, string>();
      originalAttributes.set(element, originals);
    }

    attributes.forEach((attribute) => {
      const current = element.getAttribute(attribute);
      if (current === null) return;
      const original = originals?.get(attribute) ?? current;
      if (!originals?.has(attribute)) originals?.set(attribute, original);
      element.setAttribute(attribute, translateValue(original, locale));
    });
  });
};

const applyDateLocale = (locale: Locale) => {
  document.querySelectorAll<HTMLTimeElement>("time[datetime]").forEach((time) => {
    const original = time.dataset.originalText ?? time.textContent ?? "";
    if (!time.dataset.originalText) time.dataset.originalText = original;
    if (locale === "zh") {
      time.textContent = original;
      return;
    }

    const date = new Date(time.dateTime);
    if (!Number.isNaN(date.valueOf())) {
      time.textContent = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      }).format(date);
    }
  });
};

const updateThemeControls = (theme: Theme) => {
  document.querySelectorAll<HTMLButtonElement>("[data-theme-choice]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.themeChoice === theme));
  });
};

const updateLocaleControls = (locale: Locale) => {
  document.querySelectorAll<HTMLButtonElement>("[data-locale-choice]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.localeChoice === locale));
  });
};

const loadThemeArtwork = (theme: Theme) => {
  document.querySelectorAll<HTMLImageElement>(`[data-theme-image="${theme}"]`).forEach((image) => {
    const source = image.dataset.src;
    if (source && image.getAttribute("src") !== source) image.setAttribute("src", source);
    const srcset = image.dataset.srcset;
    if (srcset && image.getAttribute("srcset") !== srcset) image.setAttribute("srcset", srcset);
    if (source) {
      image.loading = "eager";
      image.setAttribute("fetchpriority", "high");
    }
  });
};

const updateLocale = (locale: Locale) => {
  const root = document.documentElement;
  root.dataset.locale = locale;
  root.lang = locale === "en" ? "en" : "zh-CN";
  applyTextTranslations(locale);
  applyLocalizedText(locale);
  applyAttributeTranslations(locale);
  applyDateLocale(locale);
  updateLocaleControls(locale);

  const originalTitle = root.dataset.documentTitle || document.title;
  document.title = locale === "en" ? titleTranslations[originalTitle] || originalTitle : originalTitle;
  savePreference(localeStorageKey, locale);
  window.dispatchEvent(new CustomEvent("site-locale-change", { detail: { locale } }));
};

const updateTheme = (theme: Theme, origin?: HTMLElement) => {
  const root = document.documentElement;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const themeChanged = root.dataset.theme !== theme;
  loadThemeArtwork(theme);
  const applyTheme = () => {
    root.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "holo" ? "#f3d394" : "#eaf6ff");
  };

  updateThemeControls(theme);
  savePreference(themeStorageKey, theme);

  if (origin && themeChanged && !prefersReducedMotion) {
    const transitionSequence = ++themeTransitionSequence;
    const rect = origin.getBoundingClientRect();
    root.style.setProperty("--theme-origin-x", `${rect.left + rect.width / 2}px`);
    root.style.setProperty("--theme-origin-y", `${rect.top + rect.height / 2}px`);
    root.dataset.themeTarget = theme;
    root.classList.remove("is-theme-transitioning");
    if (themeTransitionTimer !== undefined) window.clearTimeout(themeTransitionTimer);

    requestAnimationFrame(() => {
      if (transitionSequence !== themeTransitionSequence) return;
      root.classList.add("is-theme-transitioning");
      requestAnimationFrame(() => {
        if (transitionSequence !== themeTransitionSequence) return;
        applyTheme();
      });
    });

    themeTransitionTimer = window.setTimeout(() => {
      if (transitionSequence !== themeTransitionSequence) return;
      root.classList.remove("is-theme-transitioning");
      delete root.dataset.themeTarget;
      root.style.removeProperty("--theme-origin-x");
      root.style.removeProperty("--theme-origin-y");
    }, 1080);
    return;
  }

  themeTransitionSequence += 1;
  if (themeTransitionTimer !== undefined) window.clearTimeout(themeTransitionTimer);
  root.classList.remove("is-theme-transitioning");
  delete root.dataset.themeTarget;
  applyTheme();
};

const initializePreferenceBar = () => {
  const root = document.documentElement;
  const bar = document.querySelector<HTMLElement>("[data-preference-bar]");
  const sidebar = document.querySelector<HTMLElement>("[data-site-header]");
  const accessTrigger = document.querySelector<HTMLButtonElement>("[data-preference-trigger]");
  if (!bar) return;

  let hideTimer: number | undefined;
  let lastScrollY = window.scrollY;
  let mobileDirection = 0;
  let mobileDirectionDistance = 0;
  const isAtTop = () => window.scrollY <= 2;
  const isMobileViewport = () => window.matchMedia("(max-width: 760px)").matches;
  const hasBarFocus = () => bar.matches(":focus-within");
  const setBarVisible = (visible: boolean) => {
    const mobile = isMobileViewport();
    const shouldShow = mobile ? visible : visible && isAtTop();
    root.classList.toggle("topbar-visible", shouldShow);
    if (mobile) {
      bar.inert = false;
      if (sidebar) sidebar.inert = !shouldShow;
      sidebar?.classList.toggle("mobile-bar-hidden", !shouldShow);
    } else {
      bar.inert = !shouldShow;
      if (sidebar) sidebar.inert = false;
      sidebar?.classList.remove("mobile-bar-hidden");
    }
  };
  const clearHideTimer = () => {
    if (hideTimer !== undefined) window.clearTimeout(hideTimer);
  };
  const hideSoon = () => {
    if (isMobileViewport()) return;
    clearHideTimer();
    hideTimer = window.setTimeout(() => {
      if (!bar.matches(":hover") && !hasBarFocus()) setBarVisible(false);
    }, 140);
  };

  window.addEventListener("pointermove", (event) => {
    if (isMobileViewport()) return;
    if (isAtTop() && event.clientY <= 18) {
      clearHideTimer();
      setBarVisible(true);
    } else if (event.clientY > 96 && !bar.matches(":hover") && !hasBarFocus()) {
      setBarVisible(false);
    }
  }, { passive: true });

  window.addEventListener("pointerdown", (event) => {
    if (!isMobileViewport() && isAtTop() && event.clientY <= 18) setBarVisible(true);
  }, { passive: true });

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;
    if (isMobileViewport()) {
      const delta = currentScrollY - lastScrollY;
      if (isAtTop()) {
        setBarVisible(true);
        mobileDirectionDistance = 0;
      } else if (Math.abs(delta) >= 1 && !hasBarFocus() && !bar.classList.contains("is-search-open")) {
        const nextDirection = delta > 0 ? 1 : -1;
        if (nextDirection !== mobileDirection) {
          mobileDirection = nextDirection;
          mobileDirectionDistance = 0;
        }
        mobileDirectionDistance += Math.abs(delta);

        // Require a deliberate direction change before moving the unified bar.
        if (mobileDirectionDistance >= 16) {
          setBarVisible(nextDirection < 0);
          mobileDirectionDistance = 0;
        }
      }
    } else if (!isAtTop()) {
      setBarVisible(false);
    }
    lastScrollY = currentScrollY;
  }, { passive: true });

  window.addEventListener("resize", () => {
    lastScrollY = window.scrollY;
    mobileDirection = 0;
    mobileDirectionDistance = 0;
    setBarVisible(isAtTop());
  }, { passive: true });

  bar.addEventListener("pointerenter", () => {
    if (isMobileViewport()) return;
    clearHideTimer();
    setBarVisible(true);
  });
  bar.addEventListener("pointerleave", (event) => {
    if (isMobileViewport()) return;
    if (isAtTop() && event.clientY <= 18) return;
    hideSoon();
  });
  bar.addEventListener("focusin", () => setBarVisible(true));
  bar.addEventListener("focusout", hideSoon);

  accessTrigger?.addEventListener("focus", () => setBarVisible(true));
  accessTrigger?.addEventListener("click", () => {
    setBarVisible(true);
    window.setTimeout(() => bar.querySelector<HTMLButtonElement>("[data-theme-choice]")?.focus(), 0);
  });

  setBarVisible(isAtTop());
};

export const initializeSitePreferences = () => {
  const theme = getStoredPreference<Theme>(themeStorageKey, "ice", ["ice", "holo"]);
  const locale = getStoredPreference<Locale>(localeStorageKey, "zh", ["zh", "en"]);

  updateTheme(theme);
  updateLocale(locale);

  document.querySelectorAll<HTMLButtonElement>("[data-theme-choice]").forEach((button) => {
    button.addEventListener("click", () => updateTheme(button.dataset.themeChoice as Theme, button));
  });

  document.querySelectorAll<HTMLButtonElement>("[data-locale-choice]").forEach((button) => {
    button.addEventListener("click", () => updateLocale(button.dataset.localeChoice as Locale));
  });

  initializePreferenceBar();
};
