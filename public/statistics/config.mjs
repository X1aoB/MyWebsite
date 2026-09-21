// Independent deployment configuration. No Snow_Statistics checkout is required.
import paths from "./paths.mjs";
export default Object.freeze({
  enabled: false,
  app: "mywebsite",
  endpoint: "https://stats.xiaob.dev/analytics/v1/events",
  summaryEndpoint: "https://stats.xiaob.dev/analytics/public/v2/summary.json",
  summarySnapshotEndpoint: "/statistics-summary.json",
  paths,
});
