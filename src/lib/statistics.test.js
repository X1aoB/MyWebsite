import { describe, expect, it } from "vitest";
import config from "../../public/statistics/config.mjs";
import { createAnalytics } from "../../public/statistics/analytics.mjs";

describe("independent statistics adapter", () => {
  it("defaults off without touching browser capabilities", () => {
    expect(config.enabled).toBe(false);
    const environment = new Proxy({}, { get() { throw new Error("unexpected side effect"); } });
    const adapter = createAnalytics(config, environment);
    expect(adapter.active).toBe(false);
    expect(() => adapter.track("page_view")).not.toThrow();
    expect(adapter.jump("https://snow.xiaob.dev/")).toBe("https://snow.xiaob.dev/");
  });
});
