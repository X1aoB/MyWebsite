import { describe, expect, it } from "vitest";
import type { ModelIqRow } from "./model-iq";
import { modelIqFamily, modelIqPassRate, selectModelIqRows } from "./model-iq-view";

const row = (key: string, label: string, score: number, passed: number, tasks = 10): ModelIqRow => ({
  key, label, model: label.toLowerCase(), score, passed, tasks, date: "2026-09-09", status: "ok", reasoningEffort: "high"
});

describe("Model IQ filtering and sorting", () => {
  const rows = [row("a", "Sol A", 110, 5), row("b", "Astra B", 100, 9), row("c", "Luna C", 100, 8)];

  it("sorts on the selected metric and preserves the original snapshot", () => {
    expect(selectModelIqRows(rows, "all", "score", "en").map(({ key }) => key)).toEqual(["a", "b", "c"]);
    expect(selectModelIqRows(rows, "all", "pass-rate", "en").map(({ key }) => key)).toEqual(["b", "c", "a"]);
    expect(selectModelIqRows(rows, "all", "name", "en").map(({ key }) => key)).toEqual(["b", "c", "a"]);
    expect(rows.map(({ key }) => key)).toEqual(["a", "b", "c"]);
  });

  it("recognizes Astra, filters by family, and keeps unknown models in Other", () => {
    expect(modelIqFamily(rows[1])).toBe("astra");
    expect(selectModelIqRows(rows, "luna", "score", "en")).toEqual([rows[2]]);
    expect(modelIqFamily(row("unknown", "Future model", 0, 0))).toBe("other");
  });

  it("handles missing tasks and resolves metric ties deterministically", () => {
    expect(modelIqPassRate(row("zero", "Zero", 90, 0, 0))).toBe(0);
    const tied = [row("b", "Same", 100, 8), row("a", "Same", 100, 8)];
    expect(selectModelIqRows(tied, "all", "score", "en").map(({ key }) => key)).toEqual(["a", "b"]);
  });
});
