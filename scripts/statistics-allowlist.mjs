import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve, sep } from "node:path";

// Run after this repository's own build. Never fetch a service or sibling checkout.
const root = fileURLToPath(new URL("../", import.meta.url)), dist = resolve(root, "dist");
const sitemap = readFileSync(resolve(dist, "sitemap.xml"), "utf8");
const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => {
  const url = new URL(match[1]);
  if (url.origin !== "https://xiaob.dev" || url.search || url.hash) throw Error("noncanonical sitemap entry");
  return url.pathname;
});
// These intentionally unindexed public pages are explicitly reviewed here.
paths.push("/statistics/", "/status/");
const allowed = [...new Set(paths)].sort();
for (const path of allowed) {
  const page = resolve(dist, decodeURIComponent(path).replace(/^\//, ""), "index.html");
  if (!page.startsWith(dist + sep) || !existsSync(page)) throw Error(`missing built public page: ${path}`);
}
const output = "// Generated from this repository's built sitemap and reviewed public pages.\nexport default Object.freeze(" + JSON.stringify(allowed, null, 2) + ");\n";
const target = resolve(root, "public/statistics/paths.mjs");
if (process.argv.includes("--check")) {
  if (readFileSync(target, "utf8") !== output) throw Error("Statistics allowlist changed; review the rebuilt public sitemap and regenerate.");
} else writeFileSync(target, output);
console.log(`Verified ${allowed.length} built public page paths.`);
