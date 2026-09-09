import type { ModelIqRow } from "./model-iq";

export type ModelIqFamily = "all" | "astra" | "sol" | "terra" | "luna" | "gpt-5.5" | "other";
export type ModelIqSortMode = "score" | "pass-rate" | "name";

export const modelIqFamily = (row: ModelIqRow): ModelIqFamily => {
  const value = `${row.model} ${row.label}`.toLowerCase();
  if (value.includes("astra")) return "astra";
  if (value.includes("sol")) return "sol";
  if (value.includes("terra")) return "terra";
  if (value.includes("luna")) return "luna";
  if (value.includes("gpt-5.5")) return "gpt-5.5";
  return "other";
};

export const modelIqPassRate = (row: ModelIqRow) => row.tasks > 0 ? row.passed / row.tasks : 0;

export const selectModelIqRows = (rows: ModelIqRow[], family: ModelIqFamily, mode: ModelIqSortMode, locale: string) =>
  rows.filter((row) => family === "all" || modelIqFamily(row) === family).sort((a, b) => {
    const byName = () => a.label.localeCompare(b.label, locale) || (a.key < b.key ? -1 : a.key > b.key ? 1 : 0);
    if (mode === "pass-rate") return modelIqPassRate(b) - modelIqPassRate(a) || b.score - a.score || byName();
    if (mode === "name") return byName();
    return b.score - a.score || modelIqPassRate(b) - modelIqPassRate(a) || byName();
  });
