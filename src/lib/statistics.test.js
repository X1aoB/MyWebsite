import { describe, expect, it, vi } from "vitest";
import config from "../../public/statistics/config.mjs";
import { createAnalytics } from "../../public/statistics/analytics.mjs";
import paths from "../../public/statistics/paths.mjs";
import { renderCompactSummary, summarizeCompact } from "../../public/statistics/public-summary.mjs";

const hidden = state => ({ state, value: null });
const day = (app, date, groups = {}) => ({
  app, date, cutoff_at: "2026-10-13T00:15:00Z",
  access: hidden("pending"), quality: hidden("pending"), popularity: hidden("pending"),
  ...groups
});
const publicSummary = daily => ({
  schema_version: 2, status: "ok", generated_at: "2026-10-12T16:15:00Z",
  cutoff_at: "2026-10-12T16:15:00Z", policy: { threshold: 10, stale_after_seconds: 93600 }, daily
});
const publishedAccess = { state: "published", value: { pv: 21, uv: 10 } };
const publishedQuality = { state: "published", value: { requests: 20, successes: 10, success_rate: 0.5 } };

describe("compact public date selection", () => {
  it("shows the most recent published day instead of today pending, without mixing other dates", () => {
    const data = publicSummary([
      day("project_snow", "2026-10-08", { access: publishedAccess }),
      day("project_snow", "2026-10-13"),
      day("project_snow", "2026-10-09", { access: hidden("suppressed"), quality: publishedQuality, popularity: hidden("empty") }),
      day("project_snow", "2026-10-10", { access: hidden("suppressed"), quality: hidden("empty"), popularity: hidden("empty") })
    ]);
    const summary = summarizeCompact(data, "project_snow");
    expect(summary.row.date).toBe("2026-10-09");
    expect(summary.row.groups).toEqual({ access: hidden("suppressed"), quality: publishedQuality, popularity: hidden("empty") });
    expect(data.daily.map(row => row.date)).toEqual(["2026-10-08", "2026-10-13", "2026-10-09", "2026-10-10"]);
  });

  it("preserves the latest original states when every day is hidden", () => {
    const summary = summarizeCompact(publicSummary([
      day("mywebsite", "2026-10-10", { access: hidden("suppressed"), quality: hidden("empty") }),
      day("mywebsite", "2026-10-13", { quality: hidden("empty"), popularity: hidden("suppressed") })
    ]), "mywebsite");
    expect(summary.row.date).toBe("2026-10-13");
    expect(summary.row.groups).toEqual({ access: hidden("pending"), quality: hidden("empty"), popularity: hidden("suppressed") });
  });

  it.each([{ rows: [] }, { rows: [day("project_snow", "2026-10-13", { quality: publishedQuality })] }])(
    "returns no row when this app has no data: %j", ({ rows }) => {
      expect(summarizeCompact(publicSummary(rows), "mywebsite").row).toBeNull();
    }
  );

  it("selects each app independently", () => {
    const data = publicSummary([
      day("mywebsite", "2026-10-13"), day("project_snow", "2026-10-13"),
      day("mywebsite", "2026-10-07", { access: publishedAccess }),
      day("project_snow", "2026-10-09", { quality: publishedQuality })
    ]);
    expect(summarizeCompact(data, "mywebsite").row).toMatchObject({ app: "mywebsite", date: "2026-10-07" });
    expect(summarizeCompact(data, "project_snow").row).toMatchObject({ app: "project_snow", date: "2026-10-09" });
  });

  it("retains the latest-date behavior for protected v1 rows", () => {
    const data = { schema_version: 1, status: "ok", generated_at: "2026-10-12T16:15:00Z", daily: [
      { app: "mywebsite", date: "2026-10-08", pv: 50, uv: 12, requests: 20, successes: 10 },
      { app: "mywebsite", date: "2026-10-09", pv: 21, uv: 10, requests: 10, successes: 10 }
    ] };
    const summary = summarizeCompact(data, "mywebsite");
    expect(summary.row.date).toBe("2026-10-09");
    expect(summary.row.groups.access.value).toEqual({ pv: 21, uv: 10 });
  });
});

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
      }, day("mywebsite", "2026-09-21")]
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
    expect(nodes.get("[data-statistics-date]").textContent).toBe("2026年9月20日");
    expect(nodes.get("[data-statistics-pv]").textContent).toBe("21");
    expect(nodes.get("[data-statistics-requests]").textContent).toBe("10");
    expect(nodes.get("[data-statistics-success]").textContent).toBe("100.0%");
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
