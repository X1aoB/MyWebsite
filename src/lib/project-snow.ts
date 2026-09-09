import { site } from "../config/site";
import type { LocalizedCopy } from "../config/profile";
import { projectSnow } from "../config/project-snow";

/**
 * 小吉终端 intentionally remains a bespoke page. This compact record lets
 * static discovery surfaces reference it without moving or duplicating that
 * page's content into the future project-case collection.
 */
export const projectSnowRecord = {
  id: "project-snow",
  title: {
    zh: "小吉终端",
    en: "Xiaoji Terminal"
  } satisfies LocalizedCopy,
  description: {
    zh: "小吉终端：与《尘白禁区》的角色文字通讯或面对面互动。0.10.0-rc.3 带来全新界面、22 位角色立绘与表情、体验设置和公告提醒。",
    en: "Xiaoji Terminal: message Snowbreak characters or meet face to face. Version 0.10.0-rc.3 brings a new interface, artwork and expressions for 22 characters, experience settings, and announcements."
  } satisfies LocalizedCopy,
  status: projectSnow.status,
  updatedAt: projectSnow.updatedAt,
  tags: ["小吉终端", "RAG", "Galgame 式交互", "角色立绘", "SSE", "BYOK", "隐私与许可"],
  techStack: ["HTML/CSS/JavaScript", "IndexedDB", "Python", "FastAPI", "PostgreSQL", "Qdrant", "Neo4j", "Docker", "Caddy"],
  repository: site.repositories.projectSnow,
  url: "/projects/project-snow/"
} as const;
