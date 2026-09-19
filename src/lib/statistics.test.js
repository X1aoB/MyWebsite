import { describe, expect, it } from "vitest";
import config from "../../public/statistics/config.mjs";
import { createAnalytics } from "../../public/statistics/analytics.mjs";
import paths from "../../public/statistics/paths.mjs";

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
});
