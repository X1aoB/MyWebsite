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

const japanTripNote: NowItem = {
  slug: "japan-trip-preparation",
  publishedAt: "2026-09-19T13:32:55+08:00",
  title: { zh: "日本旅游准备中", en: "Preparing for a trip to Japan" },
  description: {
    zh: "国庆和室友去日本玩一圈。闲鱼，中国黑市这一块，订巴士确实便宜。选了一些景点，打算随便逛逛；现在二次元浓度已经没有以前那么高了，也不玩什么圣地巡礼了，拍拍照就够了。后续也许会同步更新旅游攻略和相册。",
    en: "My roommate and I are planning a trip around Japan during the National Day holiday. Xianyu really lives up to its reputation as China's black market—booking buses there is genuinely cheaper. We picked a handful of places and will mostly wander around. My anime concentration is not what it used to be, so there will be no grand pilgrimage this time; taking photos is enough. I may publish a travel guide and photo album afterward."
  },
  tags: ["日本", "旅行准备", "摄影"]
};

const failedBeforeTheStartNote: NowItem = {
  slug: "failed-before-the-start",
  publishedAt: "2026-10-14T18:30:11+08:00",
  title: {
    zh: "出师未捷身先死这一块",
    en: "Dying before victory is kind of my thing"
  },
  description: {
    zh: "发现自己好像确实是不是编程脑子，一直刷力扣和SQL是不是路给走窄了...手撕撕不出来真的感觉不是这块料，该考虑换行了也许，数据开发也没有什么具体的经历看上去也是死路一条啊，感觉来个一年的耍起指不定真是最好的选择XDDDDDDDDD",
    en: "I am starting to wonder whether I genuinely just do not have the brain for programming. Have I boxed myself in by grinding LeetCode and SQL all the time...? When I cannot solve a live coding problem, it really feels like I am not cut out for this. Maybe it is time to switch lines. I do not have any concrete data engineering experience either, so that looks like a dead end too. Feels like taking a year off to mess around might genuinely be the best choice XDDDDDDDDD"
  },
  tags: []
};

const japanRouteGuide: NowItem = {
  slug: "japan-eleven-day-route-and-tips",
  publishedAt: "2026-10-14T18:30:12+08:00",
  title: {
    zh: "日本旅游路线总结与个人经验",
    en: "Japan itinerary summary and personal tips"
  },
  description: {
    zh: `1.路线总结：

①10月2日从香港飞往成田机场，落地后乘京成和JR前往东京站，当晚从东京站八重洲乘坐夜巴，第二天早上抵达神户三宫。

②10月3日在神户从三宫一路经过生田神社、Center Plaza、南京町、旧居留地、美利坚公园和Harborland，傍晚从神户站乘JR前往大阪入住。

③10月4日在大阪游览大阪城、黑门市场、日本桥电器街、新世界、法善寺横丁、道顿堀和心斋桥。

④10月5日从大阪前往奈良，游览兴福寺、猿泽池、奈良国立博物馆外观、奈良公园、南大门和东大寺，下午继续前往京都入住。

⑤10月6日在京都游览伏见稻荷、清水寺、二年坂、八坂塔、祇园、八坂神社、寺町和新京极，下午乘JR前往名古屋，晚上入住网咖。

⑥10月7日在名古屋游览热田神宫、大须、名古屋城外观、丸善、Oasis 21和MIRAI Tower，下午乘铁路前往御殿场并入住酒店。

⑦10月8日天气好的情况下，从御殿场乘巴士前往河口湖，租自行车或电助力车环湖，傍晚乘巴士前往东京；天气不好则放弃河口湖，改为御殿场Premium Outlets和横滨，之后前往东京。

⑧东京部分自行查找攻略，想怎么逛就怎么逛，交通吃饭都非常方便。朋友在10月11日晚前往羽田机场，乘坐10月12日凌晨的航班，路线总结到朋友起飞为止。

2.个人经验：

①各种地方都对外国人友好，无需担心交流问题，餐厅有点单机，一点英语+翻译器即可。

②可以搜一下自己想买的东西，无论是衣服还是电气或者周边之类的大多数都可以买到并且还能退税，个人买了鸟和巴塔的衣服，比国内还是便宜很多。

③如果有固定地点可以选择行李额+旅行箱（有的酒店可以提前/延后寄存行李），如果像我这样随时转移阵地，可以背徒步包。

④这次出行付款基本是BOCHK的万事达扣账卡+现金+微信/支付宝 现金需要准备一些不需要太多，支付宝和微信有汇率折扣可以领，还是能省一点钱。

⑤按照我们体验来看机票来回+托运行李额在2000以下就很划算了，酒店的话波动比较大并且远近也不同，这里给出150/人/晚的参考价，大床房两人分担最划算。

⑥如果有更多问题，可以通过网站邮箱联系我，乐意解答√`,
    en: `1. Route summary:

① On October 2, fly from Hong Kong to Narita Airport. After landing, take the Keisei line and JR to Tokyo Station, then board an overnight bus from Tokyo Station Yaesu and arrive at Kobe Sannomiya the next morning.

② On October 3, walk through Kobe from Sannomiya via Ikuta Shrine, Center Plaza, Nankinmachi, the Former Foreign Settlement, Meriken Park, and Harborland. In the evening, take JR from Kobe Station to Osaka and check in.

③ On October 4, visit Osaka Castle, Kuromon Market, Nipponbashi electronics district, Shinsekai, Hozenji Yokocho, Dotonbori, and Shinsaibashi.

④ On October 5, travel from Osaka to Nara and visit Kofukuji, Sarusawa Pond, the exterior of the Nara National Museum, Nara Park, Nandaimon, and Todaiji. Continue to Kyoto in the afternoon and check in.

⑤ On October 6, visit Fushimi Inari, Kiyomizudera, Ninenzaka, Yasaka Pagoda, Gion, Yasaka Shrine, Teramachi, and Shinkyogoku in Kyoto. Take JR to Nagoya in the afternoon and stay overnight at an internet cafe.

⑥ On October 7, visit Atsuta Shrine, Osu, the exterior of Nagoya Castle, Maruzen, Oasis 21, and MIRAI Tower in Nagoya. Travel by rail to Gotemba in the afternoon and check into the hotel.

⑦ On October 8, if the weather is good, take a bus from Gotemba to Lake Kawaguchi, rent a bicycle or e-bike to ride around the lake, and take an evening bus to Tokyo. If the weather is poor, skip Lake Kawaguchi and visit Gotemba Premium Outlets and Yokohama before heading to Tokyo.

⑧ Look up Tokyo guides yourself and wander however you like; getting around and finding food are both very convenient. My friend heads to Haneda Airport on the evening of October 11 for a flight in the early hours of October 12, and this route summary ends when that flight departs.

2. Personal experience:

① Everywhere is friendly to foreign visitors, so there is no need to worry much about communication. Restaurants often have ordering machines, and a little English plus a translation app is enough.

② Search for anything you want to buy in advance. Most clothes, electronics, and merchandise are available, often with tax refunds. I bought clothes from Arc'teryx and Patagonia, and they were still much cheaper than in China.

③ If you are staying in fixed locations, you can buy checked baggage and bring a suitcase; some hotels can store luggage before check-in or after check-out. If you keep moving around like I did, a hiking backpack works better.

④ I paid mainly with a BOCHK Mastercard debit card, cash, and WeChat Pay or Alipay. Bring some cash, but not too much. Alipay and WeChat sometimes offer exchange-rate discounts that can save a little money.

⑤ Based on our experience, a round-trip flight with checked baggage for under RMB 2,000 is a very good deal. Hotel prices vary greatly by date and distance, so RMB 150 per person per night is a useful reference. Splitting a double room between two people is usually the cheapest option.

⑥ If you have more questions, contact me through the website email. I am happy to help √`
  },
  tags: []
};

export const now = {
  updatedAt: "2026-10-14",
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
      items: [failedBeforeTheStartNote, japanTripNote, dailyNote]
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
      items: [japanRouteGuide]
    }
  ] satisfies readonly NowSection[]
} as const;
