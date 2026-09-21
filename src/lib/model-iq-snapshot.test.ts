import { describe, expect, it } from "vitest";
import {
  buildModelIqSnapshot,
  mergeModelIqSummaries,
  parseModelIqSnapshot,
  parseModelIqSummary,
  parseRadarEfficiency
} from "./model-iq";

describe("Model IQ snapshot normalization", () => {
  it("normalizes Radar points and keeps model metrics", () => {
    const summary = parseRadarEfficiency({
      source_updated_at: "2026-09-21T08:17:05Z",
      points: [
        { model: "gpt-6-astra", effort: "high", iq: 109.6, passed: 120, total: 150, average_price_usd: 0.12, runs_total: 220 }
      ]
    });
    expect(summary?.rows[0]).toMatchObject({ label: "GPT-6-Astra", model: "gpt-6-astra", score: 109.6, passRate: 0.8, source: "radar" });
  });

  it("prefers Radar when the legacy feed has the same model and effort", () => {
    const radar = parseRadarEfficiency({ source_updated_at: "2026-09-21T00:00:00Z", points: [{ model: "gpt-5.6-sol", effort: "max", iq: 111, passed: 9, total: 10 }] });
    const current = parseModelIqSummary({ model_iq: { updated_at: "2026-09-20T00:00:00Z", comparisons: { sol: { label: "Sol", model: "gpt-5.6-sol", reasoning_effort: "max", latest: { date: "2026-09-20T00:00:00Z", score: 101, passed: 8, tasks: 10 } } } } });
    const merged = mergeModelIqSummaries(radar, current);
    expect(merged?.rows).toHaveLength(1);
    expect(merged?.rows[0]).toMatchObject({ score: 111, source: "radar" });
  });

  it("keeps an unavailable snapshot valid when both sources fail", () => {
    const snapshot = buildModelIqSnapshot(null, null, [
      { name: "Radar", url: "https://example.test/radar", status: "timeout" },
      { name: "Current", url: "https://example.test/current", status: "error" }
    ], "2026-09-21T09:00:00Z");
    expect(snapshot.status).toBe("unavailable");
    expect(parseModelIqSnapshot(snapshot)).toMatchObject({ status: "unavailable", rows: [] });
  });
});
