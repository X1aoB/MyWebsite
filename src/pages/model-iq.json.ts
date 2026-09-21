import {
  buildModelIqSnapshot,
  modelIqFallbackEndpoint,
  parseModelIqSummary,
  parseRadarEfficiency,
  radarEfficiencyEndpoint
} from "../lib/model-iq";

const fetchJson = async (url: string, timeoutMs = 9000): Promise<{ value: unknown | null; status: string }> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { headers: { Accept: "application/json" }, signal: controller.signal });
    if (!response.ok) return { value: null, status: `http-${response.status}` };
    return { value: await response.json(), status: "ok" };
  } catch (error) {
    return { value: null, status: error instanceof DOMException && error.name === "AbortError" ? "timeout" : "error" };
  } finally {
    clearTimeout(timer);
  }
};

export async function GET() {
  const [radarResult, currentResult] = await Promise.all([
    fetchJson(radarEfficiencyEndpoint),
    fetchJson(modelIqFallbackEndpoint)
  ]);
  const radar = radarResult.value ? parseRadarEfficiency(radarResult.value) : null;
  const current = currentResult.value ? parseModelIqSummary(currentResult.value) : null;
  const snapshot = buildModelIqSnapshot(
    radar,
    current,
    [
      { name: "Codex Radar intelligence efficiency", url: radarEfficiencyEndpoint, status: radar ? "ok" : `invalid-${radarResult.status}` },
      { name: "Codex Radar current summary", url: modelIqFallbackEndpoint, status: current ? "ok" : `invalid-${currentResult.status}` }
    ]
  );
  return new Response(JSON.stringify(snapshot), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=300, stale-while-revalidate=3600"
    }
  });
}
