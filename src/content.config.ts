import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/blog"
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).min(1),
    project: z.string().default("未分类"),
    accent: z.enum(["ice", "mint", "violet"]),
    draft: z.boolean().default(false)
  })
});

const gallery = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/gallery"
  }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    location: z.string(),
    equipment: z.string().default("待补充"),
    description: z.string(),
    cover: z.object({
      image: z.string(),
      alt: z.string(),
      aspect: z.enum(["landscape", "portrait", "square"]).default("landscape")
    }),
    photos: z.array(
      z.object({
        image: z.string(),
        alt: z.string(),
        caption: z.string(),
        note: z.string().optional(),
        aspect: z.enum(["landscape", "portrait", "square"]).default("landscape")
      })
    ).min(1),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false)
  })
});

/**
 * Future portfolio cases are kept separate from the hand-built 小吉终端
 * page. Adding a Markdown file is enough to publish a new public case.
 */
const projects = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/projects"
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    status: z.string(),
    period: z.string(),
    role: z.string(),
    tags: z.array(z.string()).min(1),
    techStack: z.array(z.string()).min(1),
    repository: z.url(),
    updatedAt: z.coerce.date(),
    draft: z.boolean().default(false)
  })
});

export const collections = { blog, gallery, projects };
