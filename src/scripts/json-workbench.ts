import type { JsonErrorCode, JsonMode, JsonResult } from "../lib/json-tool";
import { createJsonProcessor, JsonProcessingError } from "../lib/json-processor";

const example = '{"name":"小B","project":"小吉终端","tags":["数据","摄影"],"active":true,"sampleId":900719925474099312345,"note":"大整数会保留原来的精度。"}';
const errors: Record<JsonErrorCode, [string, string]> = {
  empty: ["请先输入一段 JSON，或载入示例。", "Enter JSON first, or load the example."],
  "input-limit": ["输入超过 1 MiB，请缩小数据后重试。", "Input exceeds 1 MiB. Reduce its size and try again."],
  "depth-limit": ["嵌套超过 64 层，请简化结构后重试。", "Nesting exceeds 64 levels. Simplify the structure and try again."],
  "output-limit": ["格式化结果超过 4 MiB，可尝试压缩或减少数据。", "The formatted result exceeds 4 MiB. Try minifying or reducing the data."],
  syntax: ["JSON 语法有误，请检查引号、逗号和括号。", "Invalid JSON. Check quotes, commas, and brackets."]
};

export const initializeJsonWorkbench = () => {
  const root = document.querySelector<HTMLElement>("[data-json-workbench]");
  if (!root || root.dataset.initialized) return;
  root.dataset.initialized = "true";
  const input = root.querySelector<HTMLTextAreaElement>("[data-json-input]")!;
  const output = root.querySelector<HTMLTextAreaElement>("[data-json-output]")!;
  const indent = root.querySelector<HTMLSelectElement>("[data-json-indent]")!;
  const status = root.querySelector<HTMLElement>("[data-json-status]")!;
  const size = root.querySelector<HTMLElement>("[data-json-output-size]")!;
  const copy = root.querySelector<HTMLButtonElement>("[data-json-copy]")!;
  const download = root.querySelector<HTMLButtonElement>("[data-json-download]")!;
  let outputMode: JsonMode = "format";
  let revision = 0;
  const processor = createJsonProcessor(() => new Worker(new URL("../workers/json-worker.ts", import.meta.url), { type: "module" }));
  let message: [string, string] = ["粘贴 JSON，或先试试示例。", "Paste JSON, or try the example."];
  const isEnglish = () => document.documentElement.dataset.locale === "en";
  const showStatus = (zh: string, en: string, state: "idle" | "loading" | "success" | "error" = "idle") => {
    message = [zh, en];
    status.textContent = message[isEnglish() ? 1 : 0];
    status.dataset.state = state;
  };
  const clearOutput = () => {
    output.value = "";
    size.textContent = "—";
    copy.disabled = true;
    download.disabled = true;
  };
  const setBusy = (busy: boolean) => {
    root.dataset.busy = String(busy);
    output.setAttribute("aria-busy", String(busy));
    root.querySelectorAll<HTMLButtonElement>("[data-json-action], [data-json-example]").forEach((button) => { button.disabled = busy; });
    indent.disabled = busy;
    copy.disabled = busy || !output.value;
    download.disabled = busy || !output.value;
  };
  const run = async (mode: JsonMode) => {
    const currentRevision = ++revision;
    processor.cancel();
    clearOutput();
    input.removeAttribute("aria-invalid");
    setBusy(true);
    showStatus("正在处理 JSON…", "Processing JSON…", "loading");
    let result: JsonResult;
    try {
      result = await processor.run(input.value, mode, indent.value === "4" ? 4 : 2);
    } catch (error) {
      if (currentRevision !== revision || (error instanceof JsonProcessingError && error.code === "cancelled")) return;
      if (error instanceof JsonProcessingError && error.code === "timeout") {
        showStatus("处理超时，请重试或缩小输入后再试。", "Processing timed out. Retry, or reduce the input size.", "error");
      } else {
        showStatus("处理未能完成，请重试。也可以将输入缩小到 64 KiB 以下。", "Processing failed. Try again, or reduce the input below 64 KiB.", "error");
      }
      return;
    } finally {
      if (currentRevision === revision) setBusy(false);
    }
    if (currentRevision !== revision) return;
    if (!result.ok) {
      input.setAttribute("aria-invalid", "true");
      const [zh, en] = errors[result.code];
      showStatus(result.line ? `${zh} 第 ${result.line} 行${result.column ? `，第 ${result.column} 列` : ""}。` : zh,
        result.line ? `${en} Line ${result.line}${result.column ? `, column ${result.column}` : ""}.` : en, "error");
      return;
    }
    input.removeAttribute("aria-invalid");
    if (result.output !== null) {
      output.value = result.output;
      output.style.tabSize = indent.value;
      size.textContent = `${(result.outputBytes / 1024).toFixed(1)} KiB`;
      outputMode = mode;
      copy.disabled = false;
      download.disabled = false;
    }
    if (mode === "validate") showStatus("✓ JSON 校验通过。数值和字符串保持原样。", "✓ Valid JSON. Numbers and strings are unchanged.", "success");
    else if (mode === "format") showStatus("✓ 格式化完成。大整数、键顺序与字符串均已保留。", "✓ Formatted. Large numbers, key order, and strings are preserved.", "success");
    else showStatus("✓ 压缩完成。仅移除了字符串外的空白。", "✓ Minified. Only whitespace outside strings was removed.", "success");
  };
  root.querySelectorAll<HTMLButtonElement>("[data-json-action]").forEach((button) => button.addEventListener("click", () => void run(button.dataset.jsonAction as JsonMode)));
  root.querySelector("[data-json-example]")?.addEventListener("click", () => { input.value = example; void run("format"); });
  root.querySelector("[data-json-clear]")?.addEventListener("click", () => {
    revision += 1;
    processor.cancel();
    input.value = "";
    input.removeAttribute("aria-invalid");
    clearOutput();
    setBusy(false);
    showStatus("已清空，可以开始下一段数据。", "Cleared. Ready for your next input.");
    input.focus();
  });
  input.addEventListener("input", () => {
    revision += 1;
    processor.cancel();
    setBusy(false);
    input.removeAttribute("aria-invalid");
    if (output.value || status.dataset.state !== "idle") {
      clearOutput();
      showStatus("输入已更改，选择操作以更新结果。", "Input changed. Choose an action to update the result.");
    }
  });
  copy.addEventListener("click", async () => {
    if (!output.value) return;
    const currentRevision = revision;
    try {
      await navigator.clipboard.writeText(output.value);
      if (currentRevision === revision) showStatus("✓ 结果已复制。", "✓ Result copied.", "success");
    } catch {
      if (currentRevision !== revision) return;
      output.focus();
      output.select();
      showStatus("自动复制不可用，结果已选中。请按 Ctrl/Cmd+C 复制。", "Automatic copy is unavailable. The result is selected; press Ctrl/Cmd+C to copy.");
    }
  });
  download.addEventListener("click", () => {
    if (!output.value) return;
    const url = URL.createObjectURL(new Blob([output.value], { type: "application/json;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = outputMode === "minify" ? "minified.json" : "formatted.json";
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    showStatus("✓ JSON 下载已开始。", "✓ JSON download started.", "success");
  });
  window.addEventListener("site-locale-change", () => { status.textContent = message[isEnglish() ? 1 : 0]; });
  // A history-cache restore should not bring a previous visitor input back.
  window.addEventListener("pagehide", () => {
    revision += 1;
    processor.cancel();
    input.value = "";
    input.removeAttribute("aria-invalid");
    clearOutput();
    setBusy(false);
    showStatus("粘贴 JSON，或先试试示例。", "Paste JSON, or try the example.");
  });
};
