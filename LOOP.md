# Loop H0 · Complete fixture workspace

Goal: build the complete general-purpose frontend and one end-to-end decision journey, with backend contracts ready for real integrations.

## Frozen feature checks

- Seven product surfaces: Home, Work, Decision detail, Context, Team/delegation, History/outcomes, Channels.
- Three business fixtures use the same schema and catalog.
- Stable shell; deterministic structure plan; separate content slots; inspectable component selection.
- Version-bound simulated approvals; bounded manager authority; restricted employee task view.
- Sample approval → recorded pass/fail → next decision; no automatic supplier switch.
- Changed intent or input invalidates prior approvals.
- Explicit fixture/preview labels; no real messages, purchases, or model calls.
- Backend PRD, target types, state graph, and loop rules.

## Verification evidence

- `npm run check`: passed, syntax checks for all runtime modules.
- `npm test`: 13 domain tests passed. Arithmetic, invalid data, zero cases, immutable state, role boundaries, duplicate/stale approvals, sample gates, budgets, catalog validity, and all fixtures.
- DOM smoke with an isolated happy-dom harness: nine views rendered; manager sample approval, employee result recording, separate trial approval, inventory correction/stale approval, three business fixtures, and revoked membership passed.
- Browser visual QA unavailable: agent-browser daemon could not start and Playwright browser download returned invalid archive data. No screenshot or cross-browser visual claim is made. Responsive layouts are implemented but still need visual assessment on real devices.

## Known limitations

Local state only; no production authentication or server ACL; all fixtures present in browser source; channels and actions simulated; no live Jev/LLM/CopilotKit/AG-UI/A2UI connection. Asynchronous model loading/recovery and multi-user server state are next loops. Source and a private deployment are prepared for review.

## Next bounded loop

Implement authenticated server-owned decision state and audience projections before enabling live models or real-world actions. Preserve all current frontend contracts and version semantics.

TERMINAL STATE: VERIFIED

Scope of VERIFIED: fixture/frontend and specified automated/DOM checks, not production service or visual QA.
