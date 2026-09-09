import { processJson } from "../lib/json-tool";
import type { JsonWorkerRequest, JsonWorkerResponse } from "../lib/json-processor";

self.addEventListener("message", (event: MessageEvent<JsonWorkerRequest>) => {
  const { id, source, mode, indent } = event.data;
  try {
    self.postMessage({ id, result: processJson(source, mode, indent) } satisfies JsonWorkerResponse);
  } catch {
    self.postMessage({ id, failed: true } satisfies JsonWorkerResponse);
  }
});
