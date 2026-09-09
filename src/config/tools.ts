import type { SearchLocalizedValue } from "../lib/search";

type Tool = {
  id: string;
  url: string;
  category: "ai" | "data";
  icon: string;
  title: SearchLocalizedValue;
  description: SearchLocalizedValue;
  status: SearchLocalizedValue;
  tags: string[];
};

/** Published utilities only. Tools are searchable, but are not editorial updates. */
export const tools: Tool[] = [
  {
    id: "model-iq", url: "/tools/model-iq/", category: "ai", icon: "IQ",
    title: { zh: "模型 IQ 雷达", en: "Model IQ radar" },
    description: { zh: "查看模型分数、任务通过率、排名和更新时间。", en: "Explore model scores, pass rates, rankings, and update times." },
    status: { zh: "公开数据", en: "Public data" },
    tags: ["AI", "模型", "Codex Radar", "benchmark"]
  },
  {
    id: "json", url: "/tools/json/", category: "data", icon: "{ }",
    title: { zh: "JSON 工作台", en: "JSON workbench" },
    description: { zh: "在浏览器中格式化、压缩、校验 JSON，保留大整数精度，一键复制或下载。", en: "Format, minify, and validate JSON locally while preserving large numbers. Copy or download the result." },
    status: { zh: "本地处理", en: "Local processing" },
    tags: ["JSON", "格式化", "校验", "数据工具", "formatter", "validator"]
  }
];
