import { describe, expect, it, vi } from "vitest";
import config from "../../public/statistics/config.mjs";
import { createAnalytics } from "../../public/statistics/analytics.mjs";
import paths from "../../public/statistics/paths.mjs";
import { renderCompactSummary, summarizeCompact } from "../../public/statistics/public-summary.mjs";

describe("independent statistics adapter", () => {
  it("defaults off without touching browser capabilities", () => {
    expect(config.enabled).toBe(false);
    const environment = new Proxy({}, { get() { throw new Error("unexpected side effect"); } });
    const adapter = createAnalytics(config, environment);
    expect(adapter.active).toBe(false);
    expect(() => adapter.track("page_view")).not.toThrow();
    expect(adapter.jump("https://snow.xiaob.dev/")).toBe("https://snow.xiaob.dev/");
  });
  it("uses explicit canonical public paths and the separate collector origin", () => {
    expect(config.paths).toEqual(paths);
    expect(paths).toContain("/projects/project-snow/");
    expect(paths).toContain("/statistics/");
    expect(new Set(paths).size).toBe(paths.length);
    expect(paths.every(path => path.startsWith("/") && path.endsWith("/") && !/[?#]/.test(path))).toBe(true);
    expect(new URL(config.endpoint).origin).toBe("https://stats.xiaob.dev");
  });

  it("selects the latest row for a product scope without turning suppressed values into zero", () => {
    const summary = summarizeCompact({
      schema_version: 2,
      status: "ok",
      generated_at: "2026-09-21T00:15:00Z",
      cutoff_at: "2026-09-21T00:00:00Z",
      policy: { threshold: 10, stale_after_seconds: 93600 },
      daily: [
        { app: "mywebsite", date: "2026-09-20", cutoff_at: "2026-09-23T00:00:00Z", access: { state: "published", value: { pv: 21, uv: 10 } }, quality: { state: "suppressed", value: null }, popularity: { state: "empty", value: null } },
        { app: "project_snow", date: "2026-09-20", cutoff_at: "2026-09-23T00:00:00Z", access: { state: "empty", value: null }, quality: { state: "pending", value: null }, popularity: { state: "empty", value: null } }
      ]
    }, "project_snow");
    expect(summary.row.app).toBe("project_snow");
    expect(summary.row.groups.quality).toMatchObject({ state: "pending", value: null });
    expect(summary.row.groups.access.value).toBeNull();
  });

  it("refreshes compact cards after five minutes and bypasses cached responses", async () => {
    const nodes = new Map([
      ["[data-statistics-status]", { textContent: "" }],
      ["[data-statistics-generated]", { textContent: "" }],
      ["[data-statistics-date]", { textContent: "" }],
      ["[data-statistics-pv]", { textContent: "" }],
      ["[data-statistics-uv]", { textContent: "" }],
      ["[data-statistics-requests]", { textContent: "" }],
      ["[data-statistics-success]", { textContent: "" }],
      ["[data-statistics-retry]", { addEventListener: vi.fn() }]
    ]);
    const root = { dataset: { statisticsScope: "mywebsite" }, querySelector: selector => nodes.get(selector) };
    const payload = {
      schema_version: 2,
      status: "ok",
      generated_at: "2026-09-21T00:15:00Z",
      cutoff_at: "2026-09-21T00:00:00Z",
      policy: { threshold: 10, stale_after_seconds: 93600 },
      daily: [{
        app: "mywebsite", date: "2026-09-20", cutoff_at: "2026-09-23T00:00:00Z",
        access: { state: "published", value: { pv: 21, uv: 10 } },
        quality: { state: "published", value: { requests: 10, successes: 10, success_rate: 1 } },
        popularity: { state: "empty", value: null }
      }]
    };
    let clock = 0;
    let timer;
    const env = {
      Date: { now: () => clock },
      document: {
        documentElement: { lang: "zh" },
        visibilityState: "visible",
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      },
      fetch: vi.fn(async () => ({ ok: true, json: async () => payload })),
      setTimeout: vi.fn(() => 1),
      clearTimeout: vi.fn(),
      setInterval: vi.fn(callback => { timer = callback; return 2; }),
      clearInterval: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    };

    const stop = await renderCompactSummary(root, "https://stats.example/summary.json", "mywebsite", env);
    expect(env.fetch).toHaveBeenCalledTimes(1);
    expect(env.fetch.mock.calls[0][0]).toMatch(/[?&]__statistics_refresh=/);
    clock = 5 * 60 * 1000;
    timer();
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(env.fetch).toHaveBeenCalledTimes(2);
    stop();
    expect(env.clearInterval).toHaveBeenCalledWith(2);
  });
});
