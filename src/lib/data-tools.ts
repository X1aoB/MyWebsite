export type CsvRow = Record<string, string>;

export function parseJsonInput(raw: string): unknown {
  const value = raw.trim();
  if (!value) throw new Error("请先输入 JSON 内容。");
  return JSON.parse(value);
}

export function formatJsonInput(raw: string): string {
  return JSON.stringify(parseJsonInput(raw), null, 2);
}

export function minifyJsonInput(raw: string): string {
  return JSON.stringify(parseJsonInput(raw));
}

export function isMeaningfulRow(row: CsvRow): boolean {
  return Object.values(row).some((value) => String(value ?? "").trim() !== "");
}

export function inferColumnType(values: string[]): "空" | "数字" | "日期" | "文本" {
  const populated = values.map((value) => String(value ?? "").trim()).filter(Boolean);
  if (!populated.length) return "空";

  const isNumber = (value: string) => /^[-+]?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?$/i.test(value);
  const isDate = (value: string) =>
    /^\d{4}[-/]\d{1,2}[-/]\d{1,2}(?:[tT\s].*)?$/.test(value) && !Number.isNaN(Date.parse(value));

  if (populated.every(isNumber)) return "数字";
  if (populated.every(isDate)) return "日期";
  return "文本";
}
