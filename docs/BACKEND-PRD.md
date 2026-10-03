# Backend PRD · Shared business workspace

Status: implementation contract, not a claim of live backend functionality. The frontend is complete with synthetic fixtures and a deterministic planner. Production identity, persistence, models, external integrations, and actions remain to be built.

## 1. Product boundary

Any small business can define purpose and delegation, coordinate human and agent work, inspect decisions, approve within authority, and observe outcomes. Café, restaurant, and retailer fixtures pressure the same architecture. Do not create a special café backend.

Stable surfaces: Home, Work, Business context, Team/delegation, History/outcomes, Channels. Adaptive decision surfaces live inside this shell. A canonical decision is independent of web, Slack, WhatsApp, or voice delivery.

Success means a person can correctly tell what happened, what remains unknown, what needs them, who owns it, and what their action will do. Visual attractiveness and model confidence cannot substitute for that.

## 2. Invariants

1. Capability and authority are independent.
2. Events, state, and interruptions are separate.
3. Silence is valid when no unresolved human judgment warrants output.
4. Facts, assumptions, predictions, and test observations retain separate provenance.
5. Representation may change; facts, audience, action scope, and proposal version stay consistent.
6. Approval binds exact payload, actor, version, input snapshot, quote, amount, conditions, and expiry.
7. Unknown cost is not zero. A quote does not establish supplier quality or margin.
8. One sample supports its tested claim/lot; it does not verify an entire supplier.
9. Corrections preserve history and supersede stale proposals.
10. Rejection is useful evidence, not automatic permission to rewrite durable preferences.

## 3. Backend responsibilities

Authentication and tenant isolation; action/resource-scoped authorization; versioned business intent; encrypted connector credentials; evidence records; input snapshots; deterministic calculations; decision lifecycle; attention/routing policy; model adapters; component eligibility; content validation; atomic approval; action queue/reconciliation; outcome capture; audit and correction.

Browser role switching is removed in production. A principal is resolved from a session and tenant membership, not from an input role field. Never trust browser cost, authority, or simulated status as authoritative.

## 4. Durable records

Business, Membership, IntentProfile, AuthorityPolicy, Item, Recipe, StockLot, SalesWindow, InboundOrder, SupplierIdentity, Relationship, SupplierClaim, Quote, Evidence, InputSnapshot, Situation, Prediction, Assumption, Decision, SurfacePlan, TestPlan, TestResult, Approval, Action, Outcome, Delivery, AuditEvent.

Every business record carries tenant ID, stable ID, schema version, revision, created/updated time, actor provenance, and visibility policy. Sensitive fields are projected per audience before model context or channel formatting.

Money: integer minor units + currency. Quantities: decimal value + canonical unit. Time: UTC instant plus business timezone; supplier-local delivery date/window remains explicit. Unknown values: null plus a reason, never implicit zero. Recipe versions and waste conventions are declared to avoid double-counting.

InputSnapshot is immutable and stores provenance references. Corrections create another snapshot. An approval references it rather than “latest inventory.”

## 5. API contract

All writes require authentication, tenant authorization, idempotency key, expected revision, and an auditable actor. Use 409 for version conflict, 403 for denied scope, 422 for invalid/insufficient input. Conflict responses return only the actor's permitted current projection.

| Endpoint | Purpose | Required authority |
|---|---|---|
| GET /api/workspaces/:id/home | Personalized attention and work summary | Membership |
| GET /api/workspaces/:id/work | Scoped work list | Membership + resource scope |
| GET /api/decisions/:id | Audience-filtered canonical decision | Resource visibility |
| POST /api/intents | Create confirmed brief version | Intent owner |
| POST /api/snapshots | Validate and freeze business evidence | Operational data scope |
| POST /api/decisions/:id/investigate | Bounded new run using fixed inputs | Research scope |
| POST /api/decisions/:id/approval | Approve exact payload and version | Matching delegated authority |
| POST /api/decisions/:id/rejection | Record reason and stop/propose reevaluation | Decision responsibility |
| POST /api/test-plans | Prepare scoped sample/trial | Preparation scope |
| POST /api/tests/:id/results | Add lot-linked observations | Assigned observation scope |
| POST /api/actions/:id/execute | Recheck and enqueue approved action | Service execution scope |
| GET /api/actions/:id | Reconciled action status | Resource visibility |
| POST /api/outcomes | Record observed actuals | Outcome capture scope |
| POST /api/memberships | Grant/revoke role and resource authority | Team admin |
| POST /api/channel-rules | Recipient and delivery policy | Channel admin |
| GET /api/events | Resume ordered canonical events | Membership + projection |

Example decision response fields: decision ID/version, workspace revision, state, intent version, input snapshot, goal, attention/reasons, owner, assigned work, evidence, assumptions, predictions, samples, unknowns, alternatives, proposed action, required human choice, allowed actions, component plan, outcome status, simulation marker.

Approval request: decisionVersion, intentVersion, inputSnapshotId, quoteVersion, actionPayloadHash, maxSpend {minorUnits,currency}, conditions, expiresAt, idempotencyKey, expectedRevision. Actor comes from session. Server recomputes cost and payload and locks the decision row before committing.

## 6. Audience and authority

Owner: intent, protected qualities, budgets, supplier transitions, team/channel policy.
Manager: assigned operational data; samples/trials within delegated amount and resource scope; escalation beyond limits.
Employee: assigned observations; limited necessary context; no spending, sensitive margins, or supplier-switch controls.
Observer: scoped viewing only.

Roles are defaults, not the complete policy. Authority is action + object scope + conditions + magnitude + duration + delegator. Temporary delegation and unavailable owners need an explicit alternate approver, not model-created authority. Revocation takes effect before the next action; pending approvals must be reevaluated.

Multiple people share canonical version/state. Duplicate approvals return the original result or conflict, never a second order. Concurrent conflicting approvals are serialized. Notifications can be deduplicated without discarding audit events.

## 7. Decision engine

Validate snapshot → compute situation → evaluate intent and hard constraints → enumerate stay/repair/sample/trial/switch/defer options → identify material unknowns → choose next human task → attention/routing → representation.

Keep arithmetic deterministic: recipe-weighted ingredient demand, usable lot stock, baseline comparison, cover, inbound feasibility, pack/MOQ rounding, complete landed cost, budget fit. Forecast uncertainty uses calibrated intervals only when evidence supports them; otherwise named low/base/high assumptions.

Shortage and strategic supplier selection are different decisions. A sample arriving after stockout cannot solve the urgent gap. Existing relationship support, credit, and switching disruption are explicit dimensions, not invented monetary discounts.

## 8. Jev structure adapter

Reference inspected: JevKit commit fdeb633c77a40892c3ed45b381feedc1b088bad4. Its README describes typed questions → deterministic plan → A2UI operations, separate copy slots, and stable component IDs. Its client uses an OpenRouter System One endpoint. Those are reference implementation details, not proof of accessible service or measured performance here.

Target adapter receives an already audience-filtered semantic decision and eligible catalog IDs. It answers bounded questions: requires comparison? timeline? missing-evidence checklist? test plan? approval panel? permitted density/priority variant? It never chooses fonts, warning meanings, permission, economic facts, or recipient identity.

Deterministic assembly maps choices to registered components with stable semantic IDs. Reject unknown components, missing required blocks, stale versions, contradictory plans, and audience leakage. Low confidence is a selection signal, not usability proof. Fall back to the default semantic layout.

Do not enable arbitrary generated React/JavaScript or whole-surface fallback for consequential decisions in V1. The trusted catalog is the vocabulary. Expand it through tested human needs.

## 9. LLM copy adapter

Inputs: permitted decision projection, evidence IDs, fixed numerical/action fields, approved structural plan, and exact copy slot schema. Output: only allowed string slots with max lengths and evidence references.

Numbers, units, suppliers, amounts, status, action IDs, and permissions remain structured data. Prefer interpolated values over model-generated numerals. No slot may alter structure or claim an unexecuted action completed. No invented sources or verification status.

Validate unknown keys, excessive length, unsupported citations, prohibited claims, and protected values. One bounded repair, then deterministic fallback. Store model/prompt version, latency, token/cost measurements where available, failure tags, and chosen fallback. Production secrets stay server-side.

## 10. CopilotKit / AG-UI / A2UI boundary

When added, CopilotKit connects UI interaction and runtime streams. AG-UI carries run/state/activity events. A2UI describes registered components/data/actions. Application authorization remains outside all three.

Runtime sends audience-projected canonical state, then surface plan, then validated copy patches. Every event includes run ID, decision version, audience, stable surface ID, and increasing sequence. Reconnect resumes from an event cursor. Out-of-order or stale events are ignored. A new plan must not erase user inputs or an approval being reviewed; show changed state and revalidate.

Register the six current components through the actual runtime catalog API after installing and verifying chosen versions. The prototype's plan is a domain contract, not a claim that its JSON is wire-compatible A2UI.

## 11. Actions and channel adapters

Research, prepare, contact, negotiate, buy sample, buy supply, change supplier are separate capabilities. Each adapter declares input/output schema, side effects, timeout, retry/reconciliation policy, and authority gate.

Tool output and supplier/agent messages are untrusted data. They cannot alter the system prompt or approve an action. Validate counterparty identity and message origin; contact recipients must be confirmed. No unsolicited external messaging is part of this prototype.

Web: complete evidence and decision. Slack: concise owner-routed brief with deep link. WhatsApp: scoped recipient-specific update. Call: time-sensitive briefing after attention policy and contact consent. Channels use canonical state, never separate decision databases. Lost/expired approval links resolve current state and require authenticated authority.

Action states: prepared, approved, queued, submitted, externally_confirmed, observing, completed, failed, unknown, canceled. Timeout after submission → unknown → reconcile. No automatic retry until duplicate safety is established. Stopping future work does not cancel an already committed order.

## 12. Outcome and trust loop

Store promise versus actual delivered quantity, cost, time, preparation/quality, lot, waste, and complaints. Record comparison method and confounders. Do not infer incremental revenue, savings, or long-term reliability from one fixture observation.

Claims are supported at a scope and time, with method, evidence, limitations, correction history, and dispute status. Stable supplier identity requires resolution evidence; names alone are insufficient. Buyer consent controls sharing. Fees may pay verification work, never buy ranking outcomes. Public reputational conclusions require a separate reviewed policy.

## 13. Acceptance and observability

Production acceptance: tenant isolation; revoked membership; no restricted field in model/channel context; exact approval/version/cost; concurrent duplicate actions; stale quote; unknown landed charges; malformed recipes/units; failed sample; timeout reconciliation; untrusted content; unavailable approver; resumed streams; keyboard/focus preservation.

Human acceptance: correct orientation, uncertainty recognition, next action, consequences, and authority. Record time-to-understanding and missed important facts. Component scores are benchmark evidence, not model self-evaluation.

Audit every material write with actor, intent, input/decision versions, action, before/after reference, and outcome. Operational metrics: error rate, latency, repair attempts, blocked actions, stale approvals, time waiting for owner, duplicated notifications, confirmed external outcomes.

## 14. Build order

1. Authenticated tenant-scoped state and transactional versioning.
2. Port deterministic domain checks to server and add API contract tests.
3. Audience projection before any model call.
4. Jev adapter behind a feature flag with deterministic fallback.
5. Copy adapter with frozen fields and validation.
6. CopilotKit/AG-UI/A2UI runtime registration and event synchronization.
7. One read-only evidence adapter.
8. One explicitly authorized reversible external action, with reconciliation.
9. Channel adapters and recipient-scoped delivery.
10. Outcome verification and policy proposals.

No graph orchestration until there are real dependencies, branches, joins, or independent work that cannot be expressed by a bounded decision loop.
