import type { ModelIqRow } from "./model-iq";

export type ModelIqFamily = "all" | "gpt-6" | "gpt-5.6" | "gpt-5.5" | "other";
export type ModelIqSortMode = "score" | "pass-rate" | "name";

export const modelIqFamily = (row: ModelIqRow): ModelIqFamily => {
  const value = `${row.model} ${row.label}`.toLowerCase();
  if (value.includes("gpt-6") || value.includes("astra")) return "gpt-6";
  if (value.includes("gpt-5.6") || value.includes("gpt-56") || value.includes("sol") || value.includes("terra") || value.includes("luna")) return "gpt-5.6";
  if (value.includes("gpt-5.5") || value.includes("gpt-55")) return "gpt-5.5";
  return "other";
};

export const modelIqPassRate = (row: ModelIqRow) => row.tasks > 0 ? row.passed / row.tasks : 0;

export const selectModelIqRows = (rows: ModelIqRow[], family: ModelIqFamily, mode: ModelIqSortMode, locale: string, effort = "all") =>
  rows.filter((row) => (family === "all" || modelIqFamily(row) === family) && (effort === "all" || row.reasoningEffort === effort)).sort((a, b) => {
    const byName = () => a.label.localeCompare(b.label, locale) || (a.key < b.key ? -1 : a.key > b.key ? 1 : 0);
    if (mode === "pass-rate") return modelIqPassRate(b) - modelIqPassRate(a) || b.score - a.score || byName();
    if (mode === "name") return byName();
    return b.score - a.score || modelIqPassRate(b) - modelIqPassRate(a) || byName();
  });
