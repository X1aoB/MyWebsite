---
name: release-acceptance-and-rollback
description: Prepare a candidate release with CI checks, manual acceptance, promotion gates, rollback points, and post-release observation. Use when moving a website, service, or data job to production.
---
# Release acceptance and rollback

Make the release decision reviewable before promotion.

## Workflow

1. Define the change, affected surfaces, compatibility promise, and rollback target.
2. Run focused tests, build checks, security or privacy checks, and a clean diff review.
3. Verify key user paths on desktop and mobile when the change is visible.
4. Write acceptance evidence beside each requirement and list known limitations.
5. Promote only after the candidate has a named reviewer or explicit acceptance record.
6. Watch health, freshness, errors, and user-visible regressions after promotion.
7. If a gate fails, restore the last known good version and preserve the failure evidence.

## Output

Produce an acceptance matrix, release record, rollback command or pointer, and post-release watch list.
