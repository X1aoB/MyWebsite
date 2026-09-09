import { JSON_INPUT_LIMIT, processJson, type JsonMode, type JsonResult } from "./json-tool";

export const JSON_WORKER_THRESHOLD = 64 * 1024;
export type JsonWorkerRequest = { id: number; source: string; mode: JsonMode; indent: 2 | 4 };
export type JsonWorkerResponse = { id: number; result: JsonResult } | { id: number; failed: true };

export class JsonProcessingError extends Error {
  constructor(public code: "cancelled" | "worker-failed" | "timeout") {
    super(code);
    this.name = "JsonProcessingError";
  }
}

/** One bounded job at a time; workers retain no input after settling. */
export const createJsonProcessor = (createWorker: () => Worker, timeoutMs = 10000) => {
  let sequence = 0;
  let cancelPending: (() => void) | undefined;
  const cancel = () => { cancelPending?.(); };

  const run = (source: string, mode: JsonMode, indent: 2 | 4 = 2): Promise<JsonResult> => {
    cancel();
    const inputBytes = source.length > JSON_INPUT_LIMIT ? JSON_INPUT_LIMIT + 1 : new TextEncoder().encode(source).byteLength;
    if (inputBytes > JSON_INPUT_LIMIT) return Promise.resolve({ ok: false, code: "input-limit" });
    if (inputBytes <= JSON_WORKER_THRESHOLD) return Promise.resolve(processJson(source, mode, indent));

    const id = ++sequence;
    return new Promise((resolve, reject) => {
      let worker: Worker;
      try { worker = createWorker(); }
      catch { reject(new JsonProcessingError("worker-failed")); return; }
      let settled = false;
      let timer: ReturnType<typeof setTimeout>;
      const finish = (result?: JsonResult, error?: JsonProcessingError) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        worker.onmessage = null;
        worker.onerror = null;
        worker.onmessageerror = null;
        worker.terminate();
        cancelPending = undefined;
        if (error) reject(error);
        else resolve(result!);
      };
      cancelPending = () => finish(undefined, new JsonProcessingError("cancelled"));
      timer = setTimeout(() => finish(undefined, new JsonProcessingError("timeout")), timeoutMs);
      worker.onmessage = (event: MessageEvent<JsonWorkerResponse>) => {
        const message = event.data;
        if (!message || message.id !== id) return;
        if ("result" in message && message.result && typeof message.result.ok === "boolean") finish(message.result);
        else finish(undefined, new JsonProcessingError("worker-failed"));
      };
      worker.onerror = (event) => {
        event.preventDefault();
        finish(undefined, new JsonProcessingError("worker-failed"));
      };
      worker.onmessageerror = () => finish(undefined, new JsonProcessingError("worker-failed"));
      try { worker.postMessage({ id, source, mode, indent } satisfies JsonWorkerRequest); }
      catch { finish(undefined, new JsonProcessingError("worker-failed")); }
    });
  };
  return { run, cancel };
};
