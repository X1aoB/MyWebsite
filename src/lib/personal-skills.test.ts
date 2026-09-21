import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { personalSkills } from "../config/personal-skills";

describe("personal Skills catalog", () => {
  it("contains ten downloadable, generic skill documents", () => {
    expect(personalSkills).toHaveLength(10);
    expect(new Set(personalSkills.map((skill) => skill.slug)).size).toBe(10);
    personalSkills.forEach((skill) => {
      const source = readFileSync(`skills/${skill.slug}/SKILL.md`, "utf8");
      expect(source).toContain(`name: ${skill.slug}`);
      expect(source).toMatch(/^description: .+/m);
      expect(source).not.toMatch(/[A-Z]:\\Users\\|api[_-]?key\s*[:=]|snow_statistics|project_snow\/.+private/i);
    });
  });
});
