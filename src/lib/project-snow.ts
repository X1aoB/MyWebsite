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
    zh: "小吉终端 1.0.0 正式上线：与《尘白禁区》的角色文字通讯或面对面相处。22 位角色、九个地点场景与白雪转场、基地地图、记忆档案和约定提醒，电脑和手机浏览器都能用。",
    en: "Xiaoji Terminal 1.0.0 is live: message Snowbreak characters or meet them face to face. 22 characters, nine location scenes with a snow transition, a base map, a memory archive, and reminders, in desktop and mobile browsers."
  } satisfies LocalizedCopy,
  status: projectSnow.status,
  updatedAt: projectSnow.updatedAt,
  tags: ["小吉终端", "宣传片", "Galgame 式交互", "角色立绘", "RAG", "SSE", "BYOK", "隐私与许可"],
  techStack: ["HTML/CSS/JavaScript", "IndexedDB", "Python", "FastAPI", "PostgreSQL", "Qdrant", "Neo4j", "Docker", "Caddy"],
  repository: site.repositories.projectSnow,
  url: "/projects/project-snow/"
} as const;
