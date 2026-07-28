import Papa from "papaparse";
import { describe, expect, it } from "vitest";
import { formatJsonInput, inferColumnType, isMeaningfulRow, minifyJsonInput, parseJsonInput } from "./data-tools";

describe("JSON 工具", () => {
  it("格式化有效 JSON", () => {
    expect(formatJsonInput('{"project":"Snow","phase":1}')).toBe('{\n  "project": "Snow",\n  "phase": 1\n}');
    expect(minifyJsonInput('{ "project": "Snow", "phase": 1 }')).toBe('{"project":"Snow","phase":1}');
  });

  it("拒绝空输入和无效 JSON", () => {
    expect(() => parseJsonInput("")).toThrow("请先输入 JSON 内容。");
    expect(() => parseJsonInput('{"project":}')).toThrow();
  });
});

describe("CSV 工具", () => {
  it("保留带引号字段中的逗号", () => {
    const parsed = Papa.parse<Record<string, string>>('name,remark\nSnow,"a, b"', { header: true });
    expect(parsed.meta.fields).toEqual(["name", "remark"]);
    expect(parsed.data[0]?.remark).toBe("a, b");
  });

  it("过滤空行并推断基础字段类型", () => {
    expect(isMeaningfulRow({ name: "", score: "" })).toBe(false);
    expect(isMeaningfulRow({ name: "Snow", score: "" })).toBe(true);
    expect(inferColumnType(["1", "2.5", "-3"])).toBe("数字");
    expect(inferColumnType(["2026-07-23", "2026-07-24"])).toBe("日期");
    expect(inferColumnType(["Project Snow", "RAG"])).toBe("文本");
    expect(inferColumnType(["", " "])).toBe("空");
  });
});
