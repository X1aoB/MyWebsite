import { getCollection } from "astro:content";
import { projectSnowRecord } from "./project-snow";
import { isPublicContent, toGalleryHashUrl, type SearchLocalizedValue } from "./search";
import { sortUpdates, type UpdateItem, type UpdateSource } from "./update-types";

export { sortUpdates, type UpdateItem, type UpdateSource, updateSources } from "./update-types";

const localized = (zh: string, en = zh): SearchLocalizedValue => ({ zh, en });

const sourceLabels: Record<UpdateSource, SearchLocalizedValue> = {
  journal: { zh: "开发日志", en: "Dev log" },
  gallery: { zh: "摄影集", en: "Photography" },
  project: { zh: "项目", en: "Project" }
};

export const getUpdates = async (): Promise<UpdateItem[]> => {
  const [posts, photoSets, projects] = await Promise.all([
    getCollection("blog", isPublicContent),
    getCollection("gallery", isPublicContent),
    getCollection("projects", isPublicContent)
  ]);

  const updates: UpdateItem[] = [
    ...posts.map((post) => ({
      id: `journal:${post.id}`,
      source: "journal" as const,
      sourceLabel: sourceLabels.journal,
      title: localized(post.data.title),
      description: localized(post.data.description),
      location: localized(post.data.tags.join(" · ")),
      tags: [...post.data.tags],
      date: post.data.pubDate,
      url: `/journal/${post.id}/`
    })),
    ...photoSets.map((photoSet) => ({
      id: `gallery:${photoSet.id}`,
      source: "gallery" as const,
      sourceLabel: sourceLabels.gallery,
      title: localized(photoSet.data.title),
      description: localized(photoSet.data.description),
      location: localized(photoSet.data.location),
      tags: [...photoSet.data.tags],
      date: photoSet.data.date,
      url: toGalleryHashUrl(photoSet.id)
    })),
    {
      id: `project:${projectSnowRecord.id}`,
      source: "project",
      sourceLabel: sourceLabels.project,
      title: projectSnowRecord.title,
      description: projectSnowRecord.description,
      location: projectSnowRecord.status,
      tags: [...projectSnowRecord.tags],
      date: new Date(projectSnowRecord.updatedAt),
      url: projectSnowRecord.url
    },
    ...projects.map((project) => ({
      id: `project:${project.id}`,
      source: "project" as const,
      sourceLabel: sourceLabels.project,
      title: localized(project.data.title),
      description: localized(project.data.description),
      location: localized(`${project.data.status} · ${project.data.period}`),
      tags: [...project.data.tags],
      date: project.data.updatedAt,
      url: `/projects/${project.id}/`
    }))
  ];

  return sortUpdates(updates);
};
