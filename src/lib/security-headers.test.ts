import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const headers = readFileSync(new URL("../../public/_headers", import.meta.url), "utf8");
const csp = headers.match(/^\s+Content-Security-Policy: (.+)$/m)?.[1] ?? "";
const directive = (name: string) =>
  csp.split(";").map((part) => part.trim().split(/\s+/)).find(([key]) => key === name)?.slice(1) ?? [];

/** CSP source-expression path matching: a trailing "/" matches as a prefix, anything else must match exactly. */
const pathAllows = (source: string, url: string) => {
  const allowed = new URL(source);
  const target = new URL(url);
  if (allowed.origin !== target.origin) return false;
  return allowed.pathname.endsWith("/") ? target.pathname.startsWith(allowed.pathname) : target.pathname === allowed.pathname;
};

describe("Cloudflare Web Analytics in the CSP", () => {
  // Cloudflare injects a versioned path and rotates the version; the tag carries an integrity hash.
  const injected = "https://static.cloudflareinsights.com/beacon.min.js/vce701823e78c4301a35b7e07294d87301792088814092";

  it("allows the injected beacon script, including future versions", () => {
    const sources = directive("script-src").filter((source) => source.startsWith("https://static.cloudflareinsights.com"));
    expect(sources.some((source) => pathAllows(source, injected))).toBe(true);
    expect(sources.some((source) => pathAllows(source, "https://static.cloudflareinsights.com/beacon.min.js/v2026.12.0"))).toBe(true);
  });

  it("allows nothing else from that host", () => {
    const sources = directive("script-src").filter((source) => source.includes("cloudflareinsights"));
    expect(sources.every((source) => new URL(source).pathname.startsWith("/beacon.min.js"))).toBe(true);
    expect(sources.some((source) => pathAllows(source, "https://static.cloudflareinsights.com/other.js"))).toBe(false);
  });

  it("reports to this site's own /cdn-cgi/rum endpoint", () => {
    expect(directive("connect-src")).toContain("'self'");
  });
});
