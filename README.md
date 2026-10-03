# AgenticCaffein · Souvenir Workspace

A working frontend for a business to delegate work while keeping intent, evidence, authority, and accountability visible.

## Run

Requires Node 22 or later. No dependency installation or API key is needed.

```bash
npm run dev
```

Open http://localhost:3000. Run `npm test` for domain checks and `npm run check` for syntax checks.

## What works

- Home, Work, Decision detail, Business context, Team & delegation, History & outcomes, Channels.
- Three business fixtures: café, restaurant, retail.
- Owner / manager / team member views, scoped controls, and local access revocation.
- Business brief and inventory editing, deterministic risk calculations, and changed-input approval invalidation.
- Sample approval → employee observation → pass/fail → next decision → separate trial approval.
- Version-bound simulated approvals, duplicate protection, rejection reasons, and outcome records.
- Registered components with a validated structure plan and separate text slots.
- Local channel previews and guided fixture responses.
- Responsive layout, keyboard navigation, modal confirmations, and local state persistence.

## Demo in three minutes

1. Open Home as Maya, the owner. Review the supply gap.
2. Open supplier evaluation; inspect the structure plan and evidence.
3. Switch to Alex, manager; approve a sample within the limit.
4. Switch to Sam, team member; record a passing or failing observation.
5. Return to owner or manager; see how the proposed next step changes.
6. Change the brief or inventory after approving: the approval becomes stale.
7. Preview Slack/WhatsApp/call representations of the same decision.

## Honest boundaries

This is a fixture-based prototype. Role switching is not authentication. All fixture data ships to the browser; UI filtering is not a security boundary. State persists in localStorage and synchronizes only among tabs in the same browser origin. There is no multi-user backend yet.

No live Jev, LLM, CopilotKit, AG-UI, A2UI, Slack, WhatsApp, calls, supplier contact, or purchasing integration is connected. The surface-planning pattern is implemented with a deterministic planner; live integration contracts are documented. Approval and completion are explicitly simulated.

## Architecture

`fixtures → domain calculations and authority → OutputDecision → eligible component plan → trusted renderers → versioned local state`

`src/domain.js` owns arithmetic, state transitions, permission checks, and plan validation. `src/catalog.js` owns six trusted components. `app.js` owns the stable shell and views. `src/contracts.ts` describes target backend types.

## Next backend work

See [Backend PRD](docs/BACKEND-PRD.md), [surface specification](docs/SURFACE-SPEC.md), [state machine](docs/STATE-MACHINE.md), and [loop record](LOOP.md). Build authenticated server state before connecting any real-world action. Replace deterministic presentation choices through a server adapter; preserve the catalog, facts, and authority contracts.

## Reference

JevKit was inspected at `fdeb633c77a40892c3ed45b381feedc1b088bad4`: https://github.com/tylerslaton/jevkit. Its typed structural choices, deterministic planning, stable component IDs, and separate copy slots informed the contracts. No source code or brand assets were copied from it.
