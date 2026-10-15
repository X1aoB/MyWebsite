import { describe, expect, it } from "vitest";
import { navigation } from "../config/site";
import { tools } from "../config/tools";
import { icons, isIconName } from "./icons";

describe("shared icon set", () => {
  it("resolves every navigation and tool icon", () => {
    for (const name of [...navigation.map((item) => item.icon), ...tools.map((tool) => tool.icon)]) {
      expect(isIconName(name), name).toBe(true);
    }
  });

  it("contains only static SVG geometry", () => {
    for (const [name, icon] of Object.entries(icons)) {
      expect(icon.body, name).toMatch(/^<(path|circle|rect|polyline|line|ellipse|polygon)\b/);
      expect(icon.body, name).not.toMatch(/<script|<foreignObject|\son\w+=|javascript:|href=/i);
    }
  });

  it("rejects unknown names", () => {
    expect(isIconName("toString")).toBe(false);
    expect(isIconName("not-an-icon")).toBe(false);
  });
});
