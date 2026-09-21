export const modelIqEndpoint = "/model-iq.json";
export const modelIqFallbackEndpoint = "https://codexradar.com/current.json";
export const radarEfficiencyEndpoint = "https://api.codexradar.com/api/v1/intelligence-efficiency?v=20260823-trend-cohort-v1";

export type ModelIqSource = "radar" | "current-json";

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
  passRate?: number;
  averagePriceUsd?: number;
  averageMinutes?: number;
  runs?: number;
  source?: ModelIqSource;
};

export type ModelIqSummary = {
  updatedAt: string;
  rows: ModelIqRow[];
  status?: "ok" | "partial" | "unavailable";
  sourceUpdatedAt?: string;
  sources?: Array<{ name: string; url: string; status: string }>;
};

export type ModelIqSnapshot = {
  schemaVersion: 1;
  status: "ok" | "partial" | "unavailable";
  generatedAt: string;
  sourceUpdatedAt?: string;
  rows: ModelIqRow[];
  sources: Array<{ name: string; url: string; status: string }>;
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
  if (!Number.isFinite(score) || !Number.isFinite(minScore) || !Number.isFinite(maxScore) || maxScore <= minScore) return 80;
  const normalized = (score - minScore) / (maxScore - minScore);
  return Math.round(Math.max(0, Math.min(120, normalized * 120)));
};

const asRecord = (value: unknown): Record<string, unknown> | null =>
  typeof value === "object" && value !== null ? value as Record<string, unknown> : null;
const asString = (value: unknown) => typeof value === "string" && value.trim() ? value.trim() : "";
const asFiniteNumber = (value: unknown) => typeof value === "number" && Number.isFinite(value) ? value : null;
const asNonNegativeInteger = (value: unknown) => {
  const number = asFiniteNumber(value);
  return number !== null && number >= 0 ? Math.round(number) : 0;
};

const modelLabel = (model: string) => {
  const key = model.toLowerCase().replace(/[_ ]/g, "-");
  if (key.includes("gpt-6-astra")) return "GPT-6-Astra";
  if (key.includes("gpt-5.6-sol") || key.includes("gpt-56-sol")) return "GPT-5.6 Sol";
  if (key.includes("gpt-5.6-terra") || key.includes("gpt-56-terra")) return "GPT-5.6 Terra";
  if (key.includes("gpt-5.6-luna") || key.includes("gpt-56-luna")) return "GPT-5.6 Luna";
  if (key.includes("gpt-5.5") || key.includes("gpt-55")) return "GPT-5.5";
  return model;
};

const normaliseModelKey = (row: Pick<ModelIqRow, "model" | "label">) => {
  const value = `${row.model || row.label}`.toLowerCase().replace(/[_.]/g, "-").replace(/\s+/g, "-");
  return value
    .replace(/gpt-?6-?astra/g, "gpt-6-astra")
    .replace(/gpt-?5-?6-?(sol|terra|luna)/g, "gpt-5.6-$1")
    .replace(/gpt-?5-?5/g, "gpt-5.5");
};

const rowKey = (row: Pick<ModelIqRow, "model" | "label" | "reasoningEffort">) =>
  `${normaliseModelKey(row)}::${(row.reasoningEffort || "default").toLowerCase()}`;

const withPassRate = (row: ModelIqRow): ModelIqRow => ({
  ...row,
  passRate: row.tasks > 0 ? row.passed / row.tasks : undefined
});

/** Extracts the small public comparison subset needed by the viewer. */
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
        const model = asString(latest.model) || asString(comparison.model) || asString(comparison.label) || key;
        return [withPassRate({
          key,
          label: asString(comparison.label) || modelLabel(model) || key,
          model,
          reasoningEffort: asString(latest.reasoning_effort) || asString(comparison.reasoning_effort),
          score,
          status: asString(latest.status) || "unknown",
          passed: asNonNegativeInteger(latest.passed),
          tasks: asNonNegativeInteger(latest.tasks),
          date,
          averagePriceUsd: asFiniteNumber(latest.average_price_usd) ?? undefined,
          averageMinutes: asFiniteNumber(latest.average_minutes) ?? undefined,
          runs: asNonNegativeInteger(latest.runs_total) || undefined,
          source: "current-json"
        }) satisfies ModelIqRow];
      })
    : [];

  const fallbackLatest = asRecord(modelIq.latest);
  if (!rows.length && fallbackLatest) {
    const score = asFiniteNumber(fallbackLatest.score);
    const date = asString(fallbackLatest.date);
    if (score !== null && date) {
      const model = asString(fallbackLatest.model) || "latest-model";
      rows.push(withPassRate({
        key: "latest",
        label: modelLabel(model) || "Latest model",
        model,
        reasoningEffort: asString(fallbackLatest.reasoning_effort),
        score,
        status: asString(fallbackLatest.status) || "unknown",
        passed: asNonNegativeInteger(fallbackLatest.passed),
        tasks: asNonNegativeInteger(fallbackLatest.tasks),
        date,
        source: "current-json"
      }));
    }
  }

  if (!rows.length) return null;
  rows.sort((a, b) => b.score - a.score || a.label.localeCompare(b.label));
  return { updatedAt: asString(modelIq.updated_at) || rows[0].date, rows };
};

/** Normalizes the compact intelligence-efficiency payload served by Radar. */
export const parseRadarEfficiency = (value: unknown): ModelIqSummary | null => {
  const root = asRecord(value);
  const points = Array.isArray(root?.points) ? root.points : [];
  const rootUpdated = asString(root?.source_updated_at) || asString(root?.updated_at);
  const rows = points.flatMap((rawPoint, index) => {
    const point = asRecord(rawPoint);
    const score = asFiniteNumber(point?.iq);
    const model = asString(point?.model);
    if (!point || score === null || !model) return [];
    const effort = asString(point.effort) || asString(point.reasoning_effort) || "default";
    const date = asString(point.source_updated_at) || rootUpdated || new Date(0).toISOString();
    const passed = asNonNegativeInteger(point.passed);
    const tasks = asNonNegativeInteger(point.total ?? point.tasks);
    return [withPassRate({
      key: `radar:${model}:${effort}:${index}`,
      label: modelLabel(model),
      model,
      reasoningEffort: effort,
      score,
      status: "public",
      passed,
      tasks,
      date,
      averagePriceUsd: asFiniteNumber(point.average_price_usd) ?? undefined,
      averageMinutes: asFiniteNumber(point.average_minutes) ?? undefined,
      runs: asNonNegativeInteger(point.runs_total) || undefined,
      source: "radar"
    }) satisfies ModelIqRow];
  });
  if (!rows.length) return null;
  const unique = new Map<string, ModelIqRow>();
  rows.forEach((row) => {
    const key = rowKey(row);
    const previous = unique.get(key);
    if (!previous || row.date > previous.date) unique.set(key, row);
  });
  const normalizedRows = [...unique.values()].sort((a, b) => b.score - a.score || a.label.localeCompare(b.label));
  return { updatedAt: rootUpdated || normalizedRows[0].date, rows: normalizedRows };
};

/** Merges Radar with the legacy comparison feed, preferring Radar on duplicates. */
export const mergeModelIqSummaries = (radar: ModelIqSummary | null, current: ModelIqSummary | null): ModelIqSummary | null => {
  if (!radar && !current) return null;
  const merged = new Map<string, ModelIqRow>();
  current?.rows.forEach((row) => merged.set(rowKey(row), row));
  radar?.rows.forEach((row) => merged.set(rowKey(row), row));
  const rows = [...merged.values()].sort((a, b) => b.score - a.score || a.label.localeCompare(b.label));
  return {
    updatedAt: [radar?.updatedAt, current?.updatedAt].filter(Boolean).sort().at(-1) || rows[0].date,
    rows
  };
};

export const parseModelIqSnapshot = (value: unknown): ModelIqSnapshot | null => {
  const root = asRecord(value);
  if (!root || root.schemaVersion !== 1 || !["ok", "partial", "unavailable"].includes(String(root.status)) || !Array.isArray(root.rows)) return null;
  const rows = root.rows.flatMap((raw, index) => {
    const row = asRecord(raw);
    const score = asFiniteNumber(row?.score);
    const label = asString(row?.label);
    const model = asString(row?.model) || label;
    const date = asString(row?.date);
    if (score === null || !label || !date) return [];
    return [withPassRate({
      key: asString(row?.key) || `snapshot:${index}`,
      label,
      model,
      reasoningEffort: asString(row?.reasoningEffort),
      score,
      status: asString(row?.status) || "unknown",
      passed: asNonNegativeInteger(row?.passed),
      tasks: asNonNegativeInteger(row?.tasks),
      date,
      passRate: asFiniteNumber(row?.passRate) ?? undefined,
      averagePriceUsd: asFiniteNumber(row?.averagePriceUsd) ?? undefined,
      averageMinutes: asFiniteNumber(row?.averageMinutes) ?? undefined,
      runs: asNonNegativeInteger(row?.runs) || undefined,
      source: row?.source === "radar" ? "radar" : "current-json"
    }) satisfies ModelIqRow];
  });
  if (!rows.length && root.status !== "unavailable") return null;
  const generatedAt = asString(root.generatedAt);
  if (!generatedAt) return null;
  return {
    schemaVersion: 1,
    status: root.status as ModelIqSnapshot["status"],
    generatedAt,
    sourceUpdatedAt: asString(root.sourceUpdatedAt) || undefined,
    rows,
    sources: Array.isArray(root.sources) ? root.sources.flatMap((source) => {
      const entry = asRecord(source);
      return entry && asString(entry.name) && asString(entry.url) ? [{ name: asString(entry.name), url: asString(entry.url), status: asString(entry.status) || "unknown" }] : [];
    }) : []
  };
};

export const buildModelIqSnapshot = (
  radar: ModelIqSummary | null,
  current: ModelIqSummary | null,
  sourceStatuses: Array<{ name: string; url: string; status: string }>,
  generatedAt = new Date().toISOString()
): ModelIqSnapshot => {
  const merged = mergeModelIqSummaries(radar, current);
  return {
    schemaVersion: 1,
    status: merged ? (radar && current ? "ok" : "partial") : "unavailable",
    generatedAt,
    sourceUpdatedAt: merged?.updatedAt,
    rows: merged?.rows || [],
    sources: sourceStatuses
  };
};
