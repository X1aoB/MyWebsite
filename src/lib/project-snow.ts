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
    zh: "Project Snow 0.9.2 小规模测试版已上线：22 名角色可以在文字通讯、表情互动与 Galgame 式面对面场景之间保持连续对话。",
    en: "Project Snow 0.9.2 is live as a small-scale test, with 22 characters sharing continuous dialogue across text communication, stickers, and visual-novel-style face-to-face scenes."
  } satisfies LocalizedCopy,
  status: {
    zh: "v0.9.2 · 小规模测试已上线",
    en: "v0.9.2 · small-scale test live"
  } satisfies LocalizedCopy,
  updatedAt: "2026-08-23",
  tags: ["Project Snow", "RAG", "Galgame 式交互", "SSE", "BYOK", "蓝绿部署", "隐私与许可"],
  techStack: ["HTML/CSS/JavaScript", "IndexedDB", "Python", "FastAPI", "PostgreSQL", "Qdrant", "Neo4j", "Docker", "Caddy"],
  repository: site.repositories.projectSnow,
  url: "/projects/project-snow/"
} as const;
