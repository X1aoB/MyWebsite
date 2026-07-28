import type { SearchLocalizedValue } from "./search";

export const updateSources = ["journal", "gallery", "project"] as const;
export type UpdateSource = (typeof updateSources)[number];

export type UpdateItem = {
  id: string;
  source: UpdateSource;
  sourceLabel: SearchLocalizedValue;
  title: SearchLocalizedValue;
  description: SearchLocalizedValue;
  location: SearchLocalizedValue;
  tags: string[];
  date: Date;
  url: string;
};

export const sortUpdates = (updates: readonly UpdateItem[]) =>
  [...updates].sort((a, b) => b.date.valueOf() - a.date.valueOf() || a.id.localeCompare(b.id));

