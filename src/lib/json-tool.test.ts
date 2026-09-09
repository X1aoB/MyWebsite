import { describe, expect, it } from "vitest";
import { JSON_DEPTH_LIMIT, JSON_INPUT_LIMIT, processJson } from "./json-tool";

describe("本地 JSON 工作台", () => {
  it("格式化嵌套结构和空集合，支持两种缩进", () => {
    expect(processJson('{"a":[1,{"b":true}],"empty":{}}', "format", 2)).toMatchObject({
      ok: true, output: '{\n  "a": [\n    1,\n    {\n      "b": true\n    }\n  ],\n  "empty": {}\n}'
    });
    expect(processJson('{"a":[]}', "format", 4)).toMatchObject({ ok: true, output: '{\n    "a": []\n}' });
  });

  it("原样保留大整数、重复键、指数、小数精度和负零", () => {
    const compact = '{"id":900719925474099312345,"id":-0,"n":1.234567890123456789,"e":1e400}';
    const formatted = processJson(compact, "format");
    expect(formatted.ok).toBe(true);
    if (formatted.ok) expect(processJson(formatted.output!, "minify")).toMatchObject({ ok: true, output: compact });
  });

  it("压缩不会修改字符串中的空白、标点、转义和中文", () => {
    const source = ' { "text" : "中文 { [ , : } \\n \\" \\\\  ", "html": "</script>" } ';
    const result = processJson(source, "minify");
    expect(result.ok).toBe(true);
    if (result.ok) expect(JSON.parse(result.output!)).toEqual(JSON.parse(source));
  });

  it.each(["null", "true", "12345678901234567890", '"你好"', "[]", "{}"])("接受 JSON 顶层值 %s", (source) => {
    expect(processJson(source, "validate")).toMatchObject({ ok: true, output: null });
    expect(processJson(source, "minify")).toMatchObject({ ok: true, output: source });
  });

  it.each(['{"a":1,}', '{a:1}', '[1 2]', '"line\nbreak"', '{"a": undefined}', '{"a":NaN}', '\u00a0{}', '{"x":"\\x00"}'])('拒绝非法 JSON %s', (source) => {
    expect(processJson(source, "format")).toMatchObject({ ok: false, code: "syntax" });
  });

  it("拒绝空输入并按 UTF-8 字节限制输入", () => {
    expect(processJson(" \n ", "validate")).toEqual({ ok: false, code: "empty" });
    expect(processJson(`"${"a".repeat(JSON_INPUT_LIMIT - 2)}"`, "validate").ok).toBe(true);
    expect(processJson(`"${"a".repeat(JSON_INPUT_LIMIT)}"`, "validate")).toEqual({ ok: false, code: "input-limit" });
    expect(processJson(`"${"中".repeat(Math.ceil(JSON_INPUT_LIMIT / 3))}"`, "validate")).toEqual({ ok: false, code: "input-limit" });
  });

  it("限制嵌套深度而不误判字符串内容", () => {
    const source = `${"[".repeat(JSON_DEPTH_LIMIT)}0${"]".repeat(JSON_DEPTH_LIMIT)}`;
    expect(processJson(source, "validate").ok).toBe(true);
    expect(processJson(`[${source}]`, "validate")).toEqual({ ok: false, code: "depth-limit" });
    expect(processJson(JSON.stringify("[".repeat(100)), "validate").ok).toBe(true);
  });

  it("可以处理恰好达到上限的单个字符串，不会因分词而异常", () => {
    const source = `"${"a".repeat(JSON_INPUT_LIMIT - 2)}"`;
    expect(processJson(source, "format")).toMatchObject({ ok: true, output: source });
  });

  it("限制缩进展开后的结果大小，但同一数据仍可压缩", () => {
    const source = `${"[".repeat(40)}${Array(40000).fill("0").join(",")}${"]".repeat(40)}`;
    expect(processJson(source, "format", 4)).toEqual({ ok: false, code: "output-limit" });
    expect(processJson(source, "minify").ok).toBe(true);
  });
});
