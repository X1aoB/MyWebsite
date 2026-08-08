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
    zh: "Project Snow 的 v0.3.0 多模态 Agent 基线已经完成，v0.5.0 正在重构沉浸式与助手双入口、共享世界状态和工作台体验。",
    en: "Project Snow has completed its v0.3.0 multimodal Agent baseline. v0.5.0 is rebuilding the immersive and assistant entry points, shared world state, and workspace experience."
  } satisfies LocalizedCopy,
  status: {
    zh: "v0.5.0 开发中",
    en: "v0.5.0 in development"
  } satisfies LocalizedCopy,
  updatedAt: "2026-08-08",
  tags: ["Project Snow", "数据工程", "RAG", "多模态 Agent", "双入口 UI", "角色对话"],
  techStack: ["Python", "FastAPI", "SQLite FTS5", "Sentence Transformers", "DuckDB", "Electron"],
  repository: site.repositories.projectSnow,
  url: "/projects/project-snow/"
} as const;
