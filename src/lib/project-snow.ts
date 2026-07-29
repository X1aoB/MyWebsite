import { site } from "../config/site";
import type { LocalizedCopy } from "../config/profile";

/**
 * Project Snow intentionally remains a bespoke page. This compact record lets
 * static discovery surfaces reference it without moving or duplicating that
 * page's content into the future project-case collection.
 */
export const projectSnowRecord = {
  id: "project-snow",
  title: {
    zh: "Project Snow",
    en: "Project Snow"
  } satisfies LocalizedCopy,
  description: {
    zh: "从可追溯数据底座进入本地 RAG MVP：验证证据检索、角色专属资料优先级、对话模式和装甲 / 时装语境。",
    en: "A traceable data foundation now powers a local RAG MVP, validating evidence retrieval, character-specific priorities, dialogue modes, and armor / costume context."
  } satisfies LocalizedCopy,
  status: {
    zh: "本地 MVP 验证中",
    en: "Local MVP validation"
  } satisfies LocalizedCopy,
  updatedAt: "2026-07-29",
  tags: ["Project Snow", "数据工程", "RAG", "检索", "证据引用", "角色语境"],
  techStack: ["Python", "FastAPI", "Retrieval", "DuckDB", "Evidence citations", "Graph review"],
  repository: site.repositories.projectSnow,
  url: "/projects/project-snow/"
} as const;
