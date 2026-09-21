---
name: production-data-pipeline-runbook
description: Plan and operate repeatable batch or VM data pipelines with preflight checks, resource gates, safe stop, recovery, and evidence. Use when starting, pausing, resuming, or troubleshooting a data pipeline.
---
# Production data pipeline runbook

Use this skill to turn an operational request into a bounded run sheet.

## Workflow

1. State the objective, data window, owner, environment, and acceptable completion signal.
2. Check dependencies, input freshness, disk space, memory, compute slots, credentials, and rollback point.
3. Record the exact command or job identifier before starting.
4. Run one stage at a time. Capture start time, end time, row counts, warnings, and resource observations.
5. Stop when a gate fails. Preserve the failed evidence and do not silently retry destructive work.
6. Verify outputs, downstream availability, and cleanup before declaring completion.
7. Write a short handoff with current state, next safe action, and recovery path.

## Output

Produce a run sheet with preflight, execution, stop conditions, recovery steps, evidence links, and an honest status.
