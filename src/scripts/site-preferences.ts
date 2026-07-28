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
  "本地数据工具": "Local data tools",
  "关于与作品集": "About & portfolio",
  "工具与照片均以静态文件发布；数据工具只在浏览器内处理输入内容。": "Tools and photos are published as static files; data-tool inputs stay in your browser.",
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
  "JSON 与 CSV 在浏览器内处理，数据不上传。": "JSON and CSV are processed in the browser; no data is uploaded.",
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
  "点击标题图会在当前页面打开可下拉阅读的套图窗。现在放的是版式示例；换成自己的图片和说明后，新的套图会自动出现。": "Select a cover to open a scrollable photo-set window on this page. The current entry is a layout sample; replace it with your own images and notes, and new sets will appear automatically.",
  "返回摄影集": "Back to photography",
  "时间": "Date",
  "地点": "Place",
  "照片": "Photos",
  "套图标签": "Photo-set tags",
  "这一套图看到这里就先收好。下次想补一张照片或一句说明时，直接改对应的 Markdown 就行。": "That is this set for now. When you want to add another photo or a line of context, edit its Markdown file directly.",
  "回到全部套图": "Back to all sets",
  "这一套图先收到这里。下次想补一张照片或一句说明时，直接改对应的 Markdown 就行。": "That is this set for now. When you want to add another photo or a line of context, edit its Markdown file directly.",
  "三段光": "Three passes of light",
  "替换为城市或区域": "Replace with city or area",
  "这是用于预览套图阅读方式的原创几何示例。之后可以把它替换成一次散步、一段旅程，或一组想留住的日常片段。": "An original geometric example for previewing photo-set reading. Replace it later with a walk, a trip, or a group of everyday moments you want to keep.",
  "第一张：晨光先落在画面中央。": "First: morning light lands in the middle of the frame.",
  "这里可以写下当时的天气、走到这里的原因，或只是一个很短的念头。": "This can hold the weather, why you came here, or simply a short thought.",
  "第二张：光从窗边慢慢拉长。": "Second: light slowly lengthens from the window.",
  "竖幅图片会保留自己的比例，不需要为了网格裁成同一种尺寸。": "Portrait photos keep their own proportions; they do not need to be cropped into one grid size.",
  "第三张：夜色把前面的片段收起来。": "Third: night gathers the earlier frames back in.",
  "一套图中的照片和说明会依次向下展开，适合把画面当成小故事来整理。": "Photos and notes unfold one after another, making it easy to arrange a set as a small story.",
  "蓝白渐变与圆形光晕组成的横向几何封面图": "A landscape geometric cover of blue-white gradients and circular glow",
  "蓝白渐变与圆形光晕组成的横向几何图": "A landscape geometric image of blue-white gradients and circular glow",
  "带有冰晶线条和光斑的竖向几何图": "A portrait geometric image with icy lines and light spots",
  "深蓝与冰蓝色块组成的方形几何图": "A square geometric image of deep and ice-blue blocks",
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
  "为日常开发和资料检查准备的轻量工具。所有解析发生在当前浏览器，内容不会发送到本站或第三方服务。": "Lightweight tools for everyday development and data checks. All parsing happens in this browser; nothing is sent to this site or a third party.",
  "JSON 格式化与校验": "JSON formatting & validation",
  "将格式杂乱的 JSON 变为可读结构，或压缩为单行，并在输入无效时给出浏览器原生解析错误。": "Turn untidy JSON into readable structure, minify it to one line, and get native browser parsing errors for invalid input.",
  "CSV 本地预览": "Local CSV preview",
  "快速确认表头、行列数量、自动识别分隔符，并查看字段的数字、日期或文本类型。": "Quickly check headers and dimensions, detect separators, and inspect number, date, or text field types.",
  "Build notes / 中文优先": "Build notes / Chinese first",
  "小B的项目开发路程": "Xiao B's project development journey",
  "阅读文章": "Read article",
  "返回开发日志": "Back to dev log",
  "Project Snow：为可追溯 RAG 构建数据底座": "Project Snow: building a traceable data foundation for RAG",
  "从原始 Wiki 页面采集、增量更新到来源溯源，记录 Project Snow 的第一阶段。": "From original Wiki-page collection and incremental updates to provenance: documenting Project Snow's first phase.",
  "数据工程": "Data engineering",
  "Project Snow 的目标并不是直接做出一个会聊天的页面，而是先建立一条可验证、可恢复、可持续更新的数据链路。对于世界观问答来说，模型回答之前的数据质量决定了它是否值得相信。": "Project Snow is not about immediately making a chat page. It starts by building a verifiable, recoverable, continuously updated data pipeline. For world-building questions, data quality before a model responds determines whether the answer deserves trust.",
  "第一阶段：保留来源，而不是只保留结果": "Phase one: preserve sources, not only results",
  "当前阶段从《尘白禁区》BWiki 发现并采集剧情、角色资料、角色皮肤、语音、心意内容、家具与物品背景。采集器保存原始 HTML 或维基文本，同时记录页面地址、哈希、抓取状态和分类信息。": "The current phase discovers and collects story, character, skin, voice, affinity, furniture, and item-background data from the Snowbreak BWiki. The collector keeps original HTML or wiki text alongside page URLs, hashes, fetch state, and categories.",
  "这样做的意义是：后续无论是进行清洗、结构化还是检索，都可以回到来源页面复核，而不是把不可解释的文本直接送进模型。": "This means later cleaning, structuring, and retrieval can all be verified against source pages instead of sending unexplained text straight into a model.",
  "增量更新与可恢复运行": "Incremental updates and recoverable runs",
  "网站资料会变化，也会出现限流和临时失败。因此采集流程保留状态文件与运行报告，支持仅处理新增页面、分批恢复和目录校验。面对反爬响应时，流程会停止当前批次，而不是尝试绕过站点规则。": "Website material changes, and rate limits or temporary failures happen. The collection flow retains state files and run reports, supports new-page-only processing, batch recovery, and directory checks. When anti-bot responses appear, the current batch stops rather than attempting to bypass site rules.",
  "这类约束看似保守，但它让数据链路更适合长期维护：失败有记录、来源可追溯、每次运行都有边界。": "These constraints may look conservative, but they make the pipeline sustainable: failures are logged, sources are traceable, and each run has clear limits.",
  "下一步：从资料到可引用的回答": "Next: from material to citable answers",
  "后续路线包括剧情结构化、关系索引、向量检索与角色一致性控制。在线 RAG 服务会独立部署，并在每次回答中提供可访问的来源引用；公开体验还需要限流、滥用防护和成本控制。": "The roadmap includes story structuring, relationship indexes, vector retrieval, and character-consistency control. The online RAG service will be deployed independently and attach accessible sources to each answer; a public experience also needs rate limiting, abuse prevention, and cost control.",
  "在那之前，Project Snow 会继续把重点放在数据治理和本地可复现的能力上。项目源码、运行说明和后续部署方式会持续在 GitHub 更新。": "Until then, Project Snow will keep its focus on data governance and locally reproducible workflows. Source code, operating notes, and deployment guidance will continue to be updated on GitHub.",
  "数据来源为尘白禁区 BWiki；默认许可证为 CC BY-NC-SA 4.0，页面特殊声明优先。游戏及原始内容版权归其权利人所有。": "Data is sourced from the Snowbreak BWiki; the default license is CC BY-NC-SA 4.0, subject to page-specific notices. Game and original-content rights remain with their respective owners.",
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
  "粘贴 JSON 后在本地完成格式化、压缩和语法检查。内容不会离开当前浏览器。": "Paste JSON to format, minify, and check syntax locally. Content never leaves this browser.",
  "输入": "Input",
  "仅本地处理": "Local only",
  "JSON 操作": "JSON actions",
  "格式化": "Format",
  "压缩": "Minify",
  "校验": "Validate",
  "清空": "Clear",
  "输出": "Output",
  "2 空格缩进": "2-space indent",
  "处理后的内容会显示在这里": "Processed content will appear here",
  "输出操作": "Output actions",
  "复制输出": "Copy output",
  "等待输入 JSON。": "Waiting for JSON input.",
  "CSV 本地预览与字段统计": "Local CSV preview & field statistics",
  "选择 CSV 或 TSV 文件后，在浏览器内识别分隔符、预览前 50 行，并推断每一列的基础类型。文件不会上传。": "Choose a CSV or TSV file to detect its delimiter, preview the first 50 rows, and infer basic column types in the browser. The file is not uploaded.",
  "选择一个 CSV / TSV 文件": "Choose a CSV / TSV file",
  "支持带引号字段和 UTF-8 文本；仅在本地浏览器内解析。": "Quoted fields and UTF-8 text are supported; parsing happens only in the local browser.",
  "选择文件": "Choose file",
  "清空结果": "Clear results",
  "等待选择文件。": "Waiting for a file.",
  "字段类型统计": "Field type statistics",
  "CSV 数据预览": "CSV data preview",
  "例如：{ \"project\": \"Project Snow\", \"phase\": 1 }": "Example: { \"project\": \"Project Snow\", \"phase\": 1 }",
  "关闭大图预览": "Close large preview",
  "查看上一张": "View previous",
  "查看下一张": "View next"
};

const titleTranslations: Record<string, string> = {
  "搜索 · Xiao B · Data & Systems": "Search · Xiao B · Data & Systems",
  "更新 · Xiao B · Data & Systems": "Updates · Xiao B · Data & Systems",
  "摄影集 · Xiao B · Data & Systems": "Photography · Xiao B · Data & Systems",
  "三段光 · Xiao B · Data & Systems": "Three passes of light · Xiao B · Data & Systems",
  "开发日志 · Xiao B · Data & Systems": "Dev Log · Xiao B · Data & Systems",
  "数据工具 · Xiao B · Data & Systems": "Data Tools · Xiao B · Data & Systems",
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

  const setSummaryMatch = value.match(/^当前 (\d+) 组套图，共 (\d+) 张照片$/);
  if (setSummaryMatch) {
    const setLabel = setSummaryMatch[1] === "1" ? "photo set" : "photo sets";
    const photoLabel = setSummaryMatch[2] === "1" ? "photo" : "photos";
    return `${setSummaryMatch[1]} ${setLabel}, ${setSummaryMatch[2]} ${photoLabel}`;
  }

  const photoCountMatch = value.match(/^(\d+) 张照片$/);
  if (photoCountMatch) return `${photoCountMatch[1]} photos`;

  const frameCountMatch = value.match(/^(\d+) 张$/);
  if (frameCountMatch) return `${frameCountMatch[1]} photos`;

  const storyLabelMatch = value.match(/^(.+) 的照片与说明$/);
  if (storyLabelMatch) return `${translations[storyLabelMatch[1]] || storyLabelMatch[1]} — photos & notes`;

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
  const accessTrigger = document.querySelector<HTMLButtonElement>("[data-preference-trigger]");
  if (!bar) return;

  let hideTimer: number | undefined;
  const isAtTop = () => window.scrollY <= 2;
  const hasBarFocus = () => bar.matches(":focus-within");
  const setBarVisible = (visible: boolean) => {
    const shouldShow = visible && isAtTop();
    root.classList.toggle("topbar-visible", shouldShow);
    bar.inert = !shouldShow;
  };
  const clearHideTimer = () => {
    if (hideTimer !== undefined) window.clearTimeout(hideTimer);
  };
  const hideSoon = () => {
    clearHideTimer();
    hideTimer = window.setTimeout(() => {
      if (!bar.matches(":hover") && !hasBarFocus()) setBarVisible(false);
    }, 140);
  };

  window.addEventListener("pointermove", (event) => {
    if (isAtTop() && event.clientY <= 18) {
      clearHideTimer();
      setBarVisible(true);
    } else if (event.clientY > 96 && !bar.matches(":hover") && !hasBarFocus()) {
      setBarVisible(false);
    }
  }, { passive: true });

  window.addEventListener("pointerdown", (event) => {
    if (isAtTop() && event.clientY <= 18) setBarVisible(true);
  }, { passive: true });

  window.addEventListener("scroll", () => {
    if (!isAtTop()) setBarVisible(false);
  }, { passive: true });

  bar.addEventListener("pointerenter", () => {
    clearHideTimer();
    setBarVisible(true);
  });
  bar.addEventListener("pointerleave", (event) => {
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
