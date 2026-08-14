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
    zh: "Project Snow 的 v0.5.0 人格与沉浸式基线已经完成；独立公网体验正在进行全量验证与私有部署验收，尚未开放试玩。",
    en: "Project Snow's v0.5.0 persona and immersive baseline is complete. The isolated public experience is undergoing full validation and private deployment acceptance and is not open yet."
  } satisfies LocalizedCopy,
  status: {
    zh: "v0.5.0 基线完成 · 部署验证中",
    en: "v0.5.0 baseline complete · deployment validation"
  } satisfies LocalizedCopy,
  updatedAt: "2026-08-14",
  tags: ["Project Snow", "数据工程", "RAG", "多模态 Agent", "沉浸式 UI", "公网部署", "BYOK 安全"],
  techStack: ["Python", "FastAPI", "PostgreSQL", "Qdrant", "Neo4j", "Docker", "Electron"],
  repository: site.repositories.projectSnow,
  url: "/projects/project-snow/"
} as const;
