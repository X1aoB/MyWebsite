---
name: privacy-safe-analytics-integration
description: Design opt-in analytics and public aggregate reporting with consent, data minimization, retention, CORS, CSP, and revocation boundaries. Use when adding anonymous statistics to a site or product.
---
# Privacy-safe analytics integration

Start from the data that can be omitted.

## Workflow

1. List the product purpose and the smallest aggregate needed to answer it.
2. Keep collection off until an explicit user choice and honor GPC or DNT where required.
3. Exclude raw text, secrets, contact details, query strings, precise identifiers, and unnecessary IP data.
4. Separate products and scopes so identifiers are not silently merged.
5. Define retention, deletion, delayed publication, sample thresholds, and unavailable states.
6. Allowlist exact origins in CORS and CSP. Test disabled, accepted, declined, revoked, timeout, and 503 paths.
7. Publish only validated aggregates and explain what missing data does and does not mean.

## Output

Produce a consent flow, collection allowlist, public schema, retention table, CSP/CORS changes, and rollback plan.
