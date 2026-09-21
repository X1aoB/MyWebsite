---
name: product-interface-qa-release
description: Validate product interface changes across responsive layouts, accessibility, empty and error states, visual regression, and manual release gates. Use when changing pages or interactive components.
---
# Product interface QA release

Test the decision paths a user can actually take.

## Workflow

1. List the changed surfaces and the primary, empty, loading, error, and recovery states.
2. Test keyboard focus, names, roles, labels, contrast, reduced motion, and screen-reader landmarks.
3. Check narrow mobile, tablet, and desktop widths with realistic content lengths.
4. Verify locale changes, refresh, back navigation, offline or failed requests, and stale data behavior.
5. Compare screenshots only after the behavior and copy are correct.
6. Record browser, viewport, test data, expected result, actual result, and any known limitation.
7. Require a clean build and an explicit manual acceptance before release.

## Output

Produce a responsive and accessibility checklist, key-path results, screenshot references, and release decision.
