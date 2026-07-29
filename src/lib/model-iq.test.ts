import { describe, expect, it } from "vitest";
import { classifyModelIq, iqHueForScore, parseModelIqSummary } from "./model-iq";

describe("模型 IQ 公开摘要解析", () => {
  it("按 IQ 分数映射四档展示标签", () => {
    expect([100, 123.4].map(classifyModelIq)).toEqual(["xhigh", "xhigh"]);
    expect([90, 99.9].map(classifyModelIq)).toEqual(["high", "high"]);
    expect([80, 89.9].map(classifyModelIq)).toEqual(["medium", "medium"]);
    expect([79.9, 0].map(classifyModelIq)).toEqual(["low", "low"]);
  });

  it("按分数将卡片色相从红色渐变到绿色", () => {
    expect(iqHueForScore(70, 70, 110)).toBe(0);
    expect(iqHueForScore(90, 70, 110)).toBe(60);
    expect(iqHueForScore(110, 70, 110)).toBe(120);
    expect(iqHueForScore(90, 90, 90)).toBe(80);
  });

  it("提取并按分数从高到低排序公开模型比较结果", () => {
    const result = parseModelIqSummary({
      model_iq: {
        updated_at: "2026-07-29T15:31:33+08:00",
        comparisons: {
          low: {
            label: "GPT low",
            model: "gpt-test",
            reasoning_effort: "low",
            latest: { date: "2026-07-29T15:31:33+08:00", score: 84.7, status: "yellow", passed: 63, tasks: 112 }
          },
          high: {
            label: "GPT high",
            model: "gpt-test",
            reasoning_effort: "high",
            latest: { date: "2026-07-29T15:31:33+08:00", score: 106.3, status: "green", passed: 79, tasks: 112 }
          }
        }
      }
    });

    expect(result?.updatedAt).toBe("2026-07-29T15:31:33+08:00");
    expect(result?.rows.map((row) => row.key)).toEqual(["high", "low"]);
    expect(result?.rows[0]).toMatchObject({ score: 106.3, passed: 79, tasks: 112 });
  });

  it("拒绝没有可显示分数的响应，并支持 latest 回退", () => {
    expect(parseModelIqSummary({ model_iq: { comparisons: { broken: { latest: {} } } } })).toBeNull();
    expect(parseModelIqSummary({
      model_iq: {
        latest: {
          date: "2026-07-29T00:00:00Z",
          score: 100,
          model: "gpt-test",
          reasoning_effort: "max",
          passed: 10,
          tasks: 12
        }
      }
    })?.rows[0]).toMatchObject({ label: "gpt-test", score: 100, passed: 10, tasks: 12 });
  });
});
