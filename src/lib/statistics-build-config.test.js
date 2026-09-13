import { describe, expect, it } from "vitest";
import { buildStatisticsConfig } from "../../scripts/statistics-build-config.mjs";

const source = 'export default Object.freeze({\n  enabled: false,\n  endpoint: "https://stats.xiaob.dev/analytics/v1/events",\n});\n';

describe("statistics release configuration", () => {
  it("stays disabled for unset and false release settings", () => {
    for (const setting of [undefined, "", "false"]) expect(buildStatisticsConfig(source, setting)).toBe(source);
  });
  it("enables only the explicit boolean without adding other environment data", () => {
    expect(buildStatisticsConfig(source, "true")).toBe(source.replace("enabled: false", "enabled: true"));
  });
  it("rejects ambiguous settings and unexpected source rather than silently enabling", () => {
    for (const setting of ["TRUE", "1", " true "]) expect(() => buildStatisticsConfig(source, setting)).toThrow();
    expect(() => buildStatisticsConfig(source.replace("false", "true"), "true")).toThrow();
    expect(() => buildStatisticsConfig(source + "  enabled: false,\n", "true")).toThrow();
  });
});
