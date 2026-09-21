---
name: observability-lineage-and-evidence
description: Build an evidence-backed view of data freshness, lineage, quality, logs, and verification receipts. Use when explaining where a result came from or whether it can be trusted.
---
# Observability, lineage, and evidence

Separate measured facts, derived values, and assumptions.

## Workflow

1. Draw the source-to-result path, including transformations, storage, and publication boundaries.
2. Attach an owner, timestamp, freshness rule, and expected volume to each important stage.
3. Check logs, counters, error rates, lag, schema drift, and missing partitions.
4. Reproduce one representative result from the recorded inputs or fixture.
5. Store links or identifiers for commands, reports, screenshots, and validation outputs.
6. Mark stale, partial, synthetic, estimated, and unavailable states explicitly.

## Output

Produce a lineage map, freshness table, anomaly explanation, evidence receipt list, and confidence statement.
