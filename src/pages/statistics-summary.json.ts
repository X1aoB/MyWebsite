const sourceEndpoint = "https://stats.xiaob.dev/analytics/public/v2/summary.json";
const unavailable = {
  schema_version: 2,
  status: "unavailable",
  generated_at: null,
  cutoff_at: null,
  policy: { threshold: 10, stale_after_seconds: 93600 },
  daily: []
};

async function readSummary() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 9000);
  try {
    const response = await fetch(sourceEndpoint, { headers: { Accept: "application/json" }, signal: controller.signal });
    if (!response.ok) return unavailable;
    const data = await response.json();
    return data && Array.isArray(data.daily) ? data : unavailable;
  } catch {
    return unavailable;
  } finally {
    clearTimeout(timer);
  }
}

export async function GET() {
  return new Response(JSON.stringify(await readSummary()), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store, max-age=0"
    }
  });
}
