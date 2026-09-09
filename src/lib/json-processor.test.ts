import { afterEach, describe, expect, it, vi } from "vitest";
import { createJsonProcessor, JSON_WORKER_THRESHOLD, type JsonWorkerRequest, type JsonWorkerResponse } from "./json-processor";
import { JSON_INPUT_LIMIT, processJson } from "./json-tool";

class TestWorker {
  onmessage: ((event: MessageEvent<JsonWorkerResponse>) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;
  onmessageerror: ((event: MessageEvent) => void) | null = null;
  postMessage = vi.fn<(request: JsonWorkerRequest) => void>();
  terminate = vi.fn();
  asWorker() { return this as unknown as Worker; }
  respond(result: JsonWorkerResponse) { this.onmessage?.({ data: result } as MessageEvent<JsonWorkerResponse>); }
}
const largeInput = `"${"a".repeat(JSON_WORKER_THRESHOLD)}"`;

describe("JSON 后台处理", () => {
  afterEach(() => vi.useRealTimers());
  it("64KiB内保留本地快速路径，超过1MiB直接拒绝且均不创建Worker", async () => {
    const factory = vi.fn<() => Worker>();
    const processor = createJsonProcessor(factory);
    await expect(processor.run(`"${"a".repeat(JSON_WORKER_THRESHOLD - 2)}"`, "validate")).resolves.toMatchObject({ ok: true });
    await expect(processor.run("a".repeat(JSON_INPUT_LIMIT + 1), "format")).resolves.toEqual({ ok: false, code: "input-limit" });
    expect(factory).not.toHaveBeenCalled();
  });
  it("按UTF-8字节分流，Worker结果保留原始数值并及时终止", async () => {
    const worker = new TestWorker();
    const processor = createJsonProcessor(() => worker.asWorker());
    const source = `{"id":900719925474099312345,"text":"${"中".repeat(22000)}"}`;
    const pending = processor.run(source, "minify", 4);
    const request = worker.postMessage.mock.calls[0][0];
    expect(request).toMatchObject({ source, mode: "minify", indent: 4 });
    worker.respond({ id: request.id, result: processJson(source, "minify", 4) });
    await expect(pending).resolves.toMatchObject({ ok: true, output: source });
    expect(worker.terminate).toHaveBeenCalledOnce();
  });
  it("新的输入会取消旧请求，过期Worker响应不能污染新结果", async () => {
    const worker = new TestWorker();
    const processor = createJsonProcessor(() => worker.asWorker());
    const first = processor.run(largeInput, "format");
    const oldCallback = worker.onmessage!;
    const rejection = expect(first).rejects.toMatchObject({ code: "cancelled" });
    const next = processor.run('{"new":true}', "minify");
    oldCallback({ data: { id: 1, result: processJson(largeInput, "format") } } as MessageEvent<JsonWorkerResponse>);
    await rejection;
    await expect(next).resolves.toMatchObject({ ok: true, output: '{"new":true}' });
    expect(worker.terminate).toHaveBeenCalledOnce();
  });
  it("显式取消会终止任务，不留下pending", async () => {
    const worker = new TestWorker();
    const processor = createJsonProcessor(() => worker.asWorker());
    const pending = processor.run(largeInput, "validate");
    const rejection = expect(pending).rejects.toMatchObject({ code: "cancelled" });
    processor.cancel();
    await rejection;
    expect(worker.terminate).toHaveBeenCalledOnce();
  });
  it("无响应时超时释放Worker，之后可重新处理", async () => {
    vi.useFakeTimers();
    const first = new TestWorker();
    const second = new TestWorker();
    const factory = vi.fn<() => Worker>().mockReturnValueOnce(first.asWorker()).mockReturnValueOnce(second.asWorker());
    const processor = createJsonProcessor(factory, 100);
    const rejection = expect(processor.run(largeInput, "validate")).rejects.toMatchObject({ code: "timeout" });
    await vi.advanceTimersByTimeAsync(100);
    await rejection;
    expect(first.terminate).toHaveBeenCalledOnce();
    const retry = processor.run(largeInput, "validate");
    second.respond({ id: second.postMessage.mock.calls[0][0].id, result: processJson(largeInput, "validate") });
    await expect(retry).resolves.toMatchObject({ ok: true });
  });
  it("启动失败和执行失败可以重试，不退回主线程处理大输入", async () => {
    const worker = new TestWorker();
    const factory = vi.fn<() => Worker>().mockImplementationOnce(() => { throw new Error("blocked"); }).mockReturnValueOnce(worker.asWorker());
    const processor = createJsonProcessor(factory);
    await expect(processor.run(largeInput, "format")).rejects.toMatchObject({ code: "worker-failed" });
    const retry = processor.run(largeInput, "format");
    const rejection = expect(retry).rejects.toMatchObject({ code: "worker-failed" });
    worker.onerror?.({ preventDefault: vi.fn() } as unknown as ErrorEvent);
    await rejection;
    expect(worker.terminate).toHaveBeenCalledOnce();
  });
});
