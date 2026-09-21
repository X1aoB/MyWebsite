import { describe, expect, it } from "vitest";
import config from "../../public/statistics/config.mjs";
import { createAnalytics } from "../../public/statistics/analytics.mjs";
import paths from "../../public/statistics/paths.mjs";
import { summarizeCompact } from "../../public/statistics/public-summary.mjs";

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
});
