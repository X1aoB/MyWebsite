/**
 * The site-wide Now page is maintained here instead of in a page component.
 * Edit this one file for routine updates; the page and the search index will
 * pick up the changes during the next static build.
 */
export type LocalizedNowCopy = {
  zh: string;
  en: string;
};

export type NowItem = {
  slug: string;
  publishedAt: string;
  title: LocalizedNowCopy;
  description: LocalizedNowCopy;
  tags?: string[];
};

export type NowSection = {
  id: string;
  slug: string;
  label: LocalizedNowCopy;
  title: LocalizedNowCopy;
  items: readonly NowItem[];
  journalIds?: readonly string[];
};

const dailyNote: NowItem = {
  slug: "typhoon-autumn-recruiting",
  publishedAt: "2026-08-11T16:26:41+08:00",
  title: { zh: "台风&秋招", en: "Typhoon & autumn recruiting" },
  description: {
    zh: "白海豚真把松江变成江了，上海外国语大学退化成下河中国语小学有没有懂的。秋招都要来了感觉自己什么都还在干还在学，俨然一具尸体。",
    en: "The typhoon really turned Songjiang into a river. Shanghai International Studies University has devolved into a riverside language primary school—if you know, you know. Autumn recruiting is almost here, yet I feel like I’m still doing and learning everything, practically a corpse."
  },
  tags: []
};

export const now = {
  updatedAt: "2026-09-03",
  intro: {
    zh: "小B的龙门阵和随想",
    en: "Xiao B's ramblings and thoughts"
  },
  sections: [
    {
      id: "now-daily",
      slug: "daily",
      label: { zh: "Daily sharing", en: "Daily sharing" },
      title: { zh: "日常分享", en: "Daily sharing" },
      items: [dailyNote]
    },
    {
      id: "now-interviews",
      slug: "interviews",
      label: { zh: "Interview notes", en: "Interview notes" },
      title: { zh: "面试经历", en: "Interview experiences" },
      items: [
        {
          slug: "xiaohongshu-ai-data-interview",
          publishedAt: "2026-09-03T14:23:32+08:00",
          title: {
            zh: "面试分享:小红书AI数据开发一面凉经",
            en: "Interview notes: Xiaohongshu AI data engineering first-round rejection"
          },
          description: {
            zh: `这次一面的问题主要分为五块：

1. 自我介绍：回答得比较散，没有把实习、RAG / Agent 项目和数仓项目串成一条清晰主线。之后会固定为“身份与方向 → 数据处理与质量校验实践 → 两个代表项目 → 求职方向”的结构。

2. SQL：题目给出 user_id 和 online_date，要求统计一年内连续登录 7 天的用户总数，现场没有写出来。这里既暴露了窗口函数与连续区间题型不熟，也暴露了临场拆题能力不足。

3. 项目深挖：先讲 RAG 项目，再讲电商数仓项目。RAG 部分提到了数据来源、文档切分和检索，但没有把存储、召回、验证与结果串完整；数仓部分只抛了几个关键词。后续又被追问项目难点、材料来源、实现方式，以及 Spark Shuffle 的完整过程，回答的细度都不够。

4. AI 工程与工具：被问到是否写过 Skill、Skill 与 MCP 的区别、使用过哪些 Agent，以及 Claude 和 Codex 的差异。也聊到了团队可用模型和大模型在实际业务中的使用情况。

5. 职业与业务：被问是否打算读研；反问环节了解到岗位会接触广告投放、推荐和数据供给，也确认了大模型已经在业务中深度使用并产生实际产出。

面试官给的建议很直接：专业知识要掌握得更细，自己做过的项目更要经得起连续追问；除了“做过什么”，还要讲清楚因为兴趣主动学了什么、为什么做，以及最终验证出了什么。

复盘下来，这次最大的问题不是完全没做过，而是有经历却讲不成结构，同时 SQL、Spark 和数仓基础也不够扎实。接下来会固定自我介绍和行为面试回答，持续练 SQL 与 Python / Java 代码和调试，彻底梳理 RAG 与数仓项目，再做追问式模拟面试并录音复盘。`,
            en: `The interview covered five main areas:

1. Introduction: my answer was scattered and failed to connect my internship, RAG / Agent work, and data-warehouse project into one clear story. I will standardize it as “identity and direction → data processing and quality work → two representative projects → target role.”

2. SQL: given user_id and online_date, count the users who logged in for seven consecutive days within a year. I could not finish it, exposing gaps in window functions, consecutive-range problems, and real-time problem decomposition.

3. Project deep dive: I discussed a RAG project and an e-commerce warehouse project. The RAG explanation mentioned sources, chunking, and retrieval but did not connect storage, recall, validation, and outcomes. The warehouse answer was mostly keywords. Follow-ups on project difficulties, source material, implementation details, and the full Spark Shuffle process all needed much greater depth.

4. AI engineering and tools: questions covered whether I had written a Skill, the difference between a Skill and MCP, which coding agents I had used, and how Claude and Codex differ. We also discussed the models available to the team and how LLMs are used in real production work.

5. Career and business: I was asked whether I planned to pursue graduate school. In my questions, I learned that the role supports advertising, recommendations, and data supply, and that LLMs are already used deeply enough to produce real business output.

The interviewer's advice was direct: professional fundamentals must be precise, and personal projects must withstand sustained follow-up questions. It is not enough to say what I built; I need to explain what I learned out of genuine interest, why I built it, and how I validated the result.

My main problem was not a total lack of experience, but an inability to present it coherently, combined with weak SQL, Spark, and warehouse fundamentals. Next I will standardize my introduction and behavioral answers, keep practicing SQL plus Python / Java coding and debugging, fully map out the RAG and warehouse projects, and run recorded follow-up-style mock interviews.`
          },
          tags: ["面试复盘", "秋招", "数据开发", "AI"]
        }
      ]
    },
    {
      id: "now-technical",
      slug: "technical",
      label: { zh: "Technical writing", en: "Technical writing" },
      title: { zh: "技术文章", en: "Technical articles" },
      items: [],
      journalIds: ["project-snow-data-foundation"]
    },
    {
      id: "now-guides",
      slug: "guides",
      label: { zh: "Odds & guides", en: "Odds & guides" },
      title: { zh: "随机攻略", en: "Random guides" },
      items: []
    }
  ] satisfies readonly NowSection[]
} as const;
