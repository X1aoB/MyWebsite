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
    zh: "为可追溯 RAG 构建数据底座：先做好采集、增量更新与来源治理，再进入检索和对话阶段。",
    en: "A traceable RAG data foundation: collection, incremental updates, and provenance first; retrieval and dialogue later."
  } satisfies LocalizedCopy,
  status: {
    zh: "正在构建",
    en: "In progress"
  } satisfies LocalizedCopy,
  updatedAt: "2026-07-23",
  tags: ["Project Snow", "数据工程", "RAG", "来源溯源"],
  techStack: ["Python", "Crawler", "Manifest", "Provenance"],
  repository: site.repositories.projectSnow,
  url: "/projects/project-snow/"
} as const;

