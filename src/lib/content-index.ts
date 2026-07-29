import { getCollection } from "astro:content";
import { now } from "../config/now";
import { projectSnowRecord } from "./project-snow";
import {
  isPublicContent,
  toGalleryHashUrl,
  type SearchIndexEntry,
  type SearchLocalizedValue
} from "./search";

const localized = (zh: string, en = zh): SearchLocalizedValue => ({ zh, en });

const stripMarkdown = (value: string) =>
  value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!?(?:\[[^\]]*\])?\([^)]*\)/g, " ")
    .replace(/[#>*_`~\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const asDate = (value: Date | string) => new Date(value).toISOString();

/** Builds the public-only, static index consumed by the header and /search/. */
export const buildContentIndex = async (): Promise<SearchIndexEntry[]> => {
  const [posts, photoSets, projects] = await Promise.all([
    getCollection("blog", isPublicContent),
    getCollection("gallery", isPublicContent),
    getCollection("projects", isPublicContent)
  ]);

  const journalEntries: SearchIndexEntry[] = posts.map((post) => ({
    id: `journal:${post.id}`,
    source: "journal",
    title: localized(post.data.title),
    description: localized(post.data.description),
    location: localized(post.data.tags.join(" · ")),
    tags: [...post.data.tags],
    url: `/journal/${post.id}/`,
    date: asDate(post.data.pubDate),
    searchText: stripMarkdown(`${post.data.title}\n${post.data.description}\n${post.body}`)
  }));

  const galleryEntries: SearchIndexEntry[] = photoSets.map((photoSet) => {
    const photoCopy = photoSet.data.photos
      .map((photo) => `${photo.caption}\n${photo.note ?? ""}\n${photo.alt}`)
      .join("\n");

    return {
      id: `gallery:${photoSet.id}`,
      source: "gallery",
      title: localized(photoSet.data.title),
      description: localized(photoSet.data.description),
      location: localized(photoSet.data.location),
      tags: [...photoSet.data.tags],
      url: toGalleryHashUrl(photoSet.id),
      date: asDate(photoSet.data.date),
      searchText: stripMarkdown(
        `${photoSet.data.title}\n${photoSet.data.description}\n${photoSet.data.location}\n${photoSet.data.equipment}\n${photoCopy}`
      )
    };
  });

  const projectEntries: SearchIndexEntry[] = [
    {
      id: `project:${projectSnowRecord.id}`,
      source: "project",
      title: projectSnowRecord.title,
      description: projectSnowRecord.description,
      location: projectSnowRecord.status,
      tags: [...projectSnowRecord.tags],
      url: projectSnowRecord.url,
      date: asDate(projectSnowRecord.updatedAt),
      searchText: `${projectSnowRecord.title.zh}\n${projectSnowRecord.title.en}\n${projectSnowRecord.description.zh}\n${projectSnowRecord.description.en}\n${projectSnowRecord.status.zh}\n${projectSnowRecord.status.en}\n${projectSnowRecord.techStack.join(" ")}`
    },
    ...projects.map((project) => ({
      id: `project:${project.id}`,
      source: "project" as const,
      title: localized(project.data.title),
      description: localized(project.data.description),
      location: localized(`${project.data.status} · ${project.data.period}`),
      tags: [...project.data.tags],
      url: `/projects/${project.id}/`,
      date: asDate(project.data.updatedAt),
      searchText: stripMarkdown(
        `${project.data.title}\n${project.data.description}\n${project.data.status}\n${project.data.period}\n${project.data.role}\n${project.data.techStack.join(" ")}\n${project.body}`
      )
    }))
  ];

  const nowEntries: SearchIndexEntry[] = now.sections.map((section) => ({
    id: `now:${section.id}`,
    source: "now",
    title: localized(section.title.zh, section.title.en),
    description: localized(
      section.items.map((item) => `${item.title.zh}：${item.description.zh}`).join(" "),
      section.items.map((item) => `${item.title.en}: ${item.description.en}`).join(" ")
    ),
    location: localized(section.label.zh, section.label.en),
    tags: [...new Set(section.items.flatMap((item) => item.tags ?? []))],
    url: `/now/#${section.id}`,
    date: asDate(now.updatedAt),
    searchText: section.items
      .flatMap((item) => [item.title.zh, item.title.en, item.description.zh, item.description.en, ...(item.tags ?? [])])
      .join(" ")
  }));

  return [...journalEntries, ...galleryEntries, ...projectEntries, ...nowEntries].sort(
    (a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id)
  );
};
