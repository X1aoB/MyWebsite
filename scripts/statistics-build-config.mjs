import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

// The checked-in module stays disabled. The release environment controls only
// this public boolean; builds never contact the collector or a sibling checkout.
export function buildStatisticsConfig(source, setting) {
  if (![undefined, "", "false", "true"].includes(setting)) {
    throw new Error("PUBLIC_STATISTICS_ENABLED must be true, false, or unset");
  }
  const marker = /^  enabled: false,$/gm;
  if ([...source.matchAll(marker)].length !== 1) {
    throw new Error("Expected exactly one disabled statistics configuration flag");
  }
  return source.replace(marker, `  enabled: ${setting === "true"},`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = fileURLToPath(new URL("../", import.meta.url));
  const original = readFileSync(resolve(root, "public/statistics/config.mjs"), "utf8");
  const output = buildStatisticsConfig(original, process.env.PUBLIC_STATISTICS_ENABLED);
  writeFileSync(resolve(root, "dist/statistics/config.mjs"), output);
  console.log(`Visit analytics release switch: ${process.env.PUBLIC_STATISTICS_ENABLED === "true" ? "on (consent required)" : "off"}`);
}
