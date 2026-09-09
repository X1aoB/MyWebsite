export type ReadingPost = {
  id: string;
  data: { pubDate: Date; project?: string };
};

/** Newest first; IDs make same-day entries deterministic across builds. */
export const compareReadingPosts = (a: ReadingPost, b: ReadingPost): number =>
  b.data.pubDate.valueOf() - a.data.pubDate.valueOf() || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);

export const readingNeighbors = <T extends ReadingPost>(posts: T[], current: T) => {
  const projectOf = (post: ReadingPost) => {
    const value = post.data.project?.trim();
    return value && value !== "未分类" ? value : null;
  };
  const project = projectOf(current);
  const ordered = posts.filter((post) => projectOf(post) === project).sort(compareReadingPosts);
  const index = ordered.findIndex((post) => post.id === current.id);
  return {
    previous: index >= 0 ? ordered[index + 1] ?? null : null,
    next: index > 0 ? ordered[index - 1] : null,
    project
  };
};

/** Approximation: 350 Chinese characters or 200 English words per minute. */
export const estimateReadingMinutes = (markdown: string): number => {
  const text = markdown
    .replace(/^---\s*\n[\s\S]*?\n---\s*\n/, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/https?:\/\/\S+/g, "");
  const chineseCharacters = text.match(/\p{Script=Han}/gu)?.length ?? 0;
  const englishWords = text.match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g)?.length ?? 0;
  return Math.max(1, Math.ceil(chineseCharacters / 350 + englishWords / 200));
};

export type ReadingHeading = { depth: number; slug: string; text: string };

export const readingHeadings = (headings: ReadingHeading[]) => {
  const sections = headings.filter((heading) => heading.depth === 2 || heading.depth === 3);
  return sections.length >= 2 ? sections : [];
};
