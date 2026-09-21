---
name: benchmark-data-curation
description: Turn external leaderboard or public API data into a normalized, attributed, deduplicated snapshot with source timestamps and fallback behavior. Use when displaying model or product benchmarks.
---
# Benchmark data curation

Keep source meaning visible in every derived number.

## Workflow

1. Identify the public source, endpoint, terms, update time, and fields that are actually needed.
2. Prefer a small build-time snapshot when a browser cannot safely call the source.
3. Normalize model or entity names, effort or configuration labels, scores, counts, and timestamps.
4. Deduplicate by a stable entity and configuration key. Define source priority for conflicts.
5. Preserve source URL, source update time, snapshot time, and partial or unavailable status.
6. Add a bounded fallback and make source failure non-fatal to the rest of the site.
7. Test malformed payloads, missing fields, duplicate rows, stale snapshots, and both-source failure.

## Output

Produce a versioned snapshot contract, normalization rules, source attribution, fallback policy, and fixture-based tests.
