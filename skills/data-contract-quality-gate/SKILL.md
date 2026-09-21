---
name: data-contract-quality-gate
description: Review event, table, or API contract changes for schema compatibility, versioning, deduplication, quarantine, and quality thresholds. Use when adding fields, changing payloads, or onboarding a source.
---
# Data contract quality gate

Treat a contract as a public interface with a version and an owner.

## Workflow

1. Compare the proposed shape with the current schema and list additions, removals, and type changes.
2. Decide whether the change is additive, breaking, or an expand and contract migration.
3. Define required fields, null behavior, identifiers, timestamps, units, and allowed values.
4. Check duplicates, late data, malformed records, outliers, and quarantine behavior.
5. Run fixture, golden metric, backward compatibility, and representative volume checks.
6. Record the release decision, unresolved risks, and the first metric to watch after deployment.

## Output

Produce a contract diff, validation matrix, sample results, and an explicit pass, conditional pass, or block decision.
