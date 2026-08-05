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
    zh: "Project Snow 已进入 22 角色本地测试阶段：混合检索、证据与关系审核、双模式聊天客户端、会话持久化和反馈回归已经串成完整链路。",
    en: "Project Snow is now a 22-character local preview, connecting hybrid retrieval, evidence and relationship review, dual-mode chat, persistent sessions, and feedback regression."
  } satisfies LocalizedCopy,
  status: {
    zh: "本地测试版 0.2.3",
    en: "Local preview 0.2.3"
  } satisfies LocalizedCopy,
  updatedAt: "2026-08-05",
  tags: ["Project Snow", "数据工程", "RAG", "混合检索", "证据审核", "角色对话"],
  techStack: ["Python", "FastAPI", "SQLite FTS5", "Sentence Transformers", "DuckDB", "Electron"],
  repository: site.repositories.projectSnow,
  url: "/projects/project-snow/"
} as const;
