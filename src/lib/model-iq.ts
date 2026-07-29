export const modelIqEndpoint = "https://codexradar.com/current.json";

export type ModelIqRow = {
  key: string;
  label: string;
  model: string;
  reasoningEffort: string;
  score: number;
  status: string;
  passed: number;
  tasks: number;
  date: string;
};

export type ModelIqSummary = {
  updatedAt: string;
  rows: ModelIqRow[];
};

export type ModelIqTier = "xhigh" | "high" | "medium" | "low";

/** Maps the public IQ score to the four display bands used by the dashboard. */
export const classifyModelIq = (score: number): ModelIqTier => {
  if (score >= 100) return "xhigh";
  if (score >= 90) return "high";
  if (score >= 80) return "medium";
  return "low";
};

/** Maps the current score range to a red (low) → green (high) hue. */
export const iqHueForScore = (score: number, minScore: number, maxScore: number): number => {
  if (!Number.isFinite(score) || !Number.isFinite(minScore) || !Number.isFinite(maxScore) || maxScore <= minScore) {
    return 80;
  }
  const normalized = (score - minScore) / (maxScore - minScore);
  return Math.round(Math.max(0, Math.min(120, normalized * 120)));
};

const asRecord = (value: unknown): Record<string, unknown> | null =>
  typeof value === "object" && value !== null ? value as Record<string, unknown> : null;

const asString = (value: unknown) => typeof value === "string" && value.trim() ? value : "";

const asFiniteNumber = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) ? value : null;

/** Extracts only the small public comparison subset needed by the viewer. */
export const parseModelIqSummary = (value: unknown): ModelIqSummary | null => {
  const root = asRecord(value);
  const modelIq = asRecord(root?.model_iq);
  if (!modelIq) return null;

  const comparisons = asRecord(modelIq.comparisons);
  const rows = comparisons
    ? Object.entries(comparisons).flatMap(([key, rawComparison]) => {
        const comparison = asRecord(rawComparison);
        const latest = asRecord(comparison?.latest);
        const score = asFiniteNumber(latest?.score);
        const date = asString(latest?.date);
        if (!comparison || !latest || score === null || !date) return [];

        return [{
          key,
          label: asString(comparison.label) || key,
          model: asString(latest.model) || asString(comparison.model),
          reasoningEffort: asString(latest.reasoning_effort) || asString(comparison.reasoning_effort),
          score,
          status: asString(latest.status) || "unknown",
          passed: asFiniteNumber(latest.passed) ?? 0,
          tasks: asFiniteNumber(latest.tasks) ?? 0,
          date
        } satisfies ModelIqRow];
      })
    : [];

  const fallbackLatest = asRecord(modelIq.latest);
  if (!rows.length && fallbackLatest) {
    const score = asFiniteNumber(fallbackLatest.score);
    const date = asString(fallbackLatest.date);
    if (score !== null && date) {
      rows.push({
        key: "latest",
        label: asString(fallbackLatest.model) || "Latest model",
        model: asString(fallbackLatest.model),
        reasoningEffort: asString(fallbackLatest.reasoning_effort),
        score,
        status: asString(fallbackLatest.status) || "unknown",
        passed: asFiniteNumber(fallbackLatest.passed) ?? 0,
        tasks: asFiniteNumber(fallbackLatest.tasks) ?? 0,
        date
      });
    }
  }

  if (!rows.length) return null;

  rows.sort((a, b) => b.score - a.score || a.label.localeCompare(b.label));
  return {
    updatedAt: asString(modelIq.updated_at) || rows[0].date,
    rows
  };
};
