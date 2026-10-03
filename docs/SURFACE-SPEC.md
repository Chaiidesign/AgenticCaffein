# Surface and component specification

## Stable shell

Business identity, navigation, viewer identity/scope, agent status, goal/context, authority, and explicit data freshness. Home is personalized to responsibility, not a universal KPI wall. Empty/quiet Home is valid.

| Surface | Human question | First information | Adaptive interior |
|---|---|---|---|
| Home | What needs me? | Scoped unresolved judgment and work | Decision summaries and quiet progress |
| Work | What is being handled? | Owner, state, next step | Investigation, comparison, tests |
| Decision | What choice am I making? | Recommendation, consequence, authority | Six registered components |
| Context | What should work preserve? | Goal, protected qualities, relationships | Material missing-context questions |
| Team | Who sees and may do what? | People, scope, limits | Escalation and assignment proposals |
| History | What actually happened? | Proposed/approved/observed distinction | Outcome comparisons, corrections |
| Channels | Where should work reach me? | Recipient and routing rules | Channel-appropriate representation |

## Design vocabulary

Fixed ink, neutral surfaces, pink emphasis, amber unresolved risk, green confirmed positive state. Typography: 32px page title, 25px decision title, 16–19px section, 14–16px body/controls, 12–13px metadata. No generated brand typography, random warning color, glow, or gradient. Spacing rhythm 4/8/12/16/24/32. Radius 7 for controls, 11–12 for surfaces. Density is a bounded variant, not unrestricted style generation.

## Component contracts

| Component | Purpose | Typed content | Model-editable slots | Mandatory constraints |
|---|---|---|---|---|
| SituationSummary | Orient to situation | Decision/version/goal/state | Headline, explanation | No invented facts or action completion |
| SupplyTimeline | Compare timing | Units, cover, arrival window, method | Concise uncertainty note | Calculated values fixed; unknown distinct |
| SupplierComparison | Inspect tradeoffs | Option dimensions, evidence, hard constraints | Dimension explanations | Include incumbent and infeasible labels |
| EvidenceChecklist | Distinguish known/unknown | Source/time/status/claim scope | Plain explanation | Seller claims separate from verified evidence |
| TestPlan | Reduce uncertainty reversibly | Method, control, lot, threshold, cost, scope | Test question/instructions | Criteria fixed before results |
| ApprovalPanel | Understand exact commitment | Payload, cost, version, actor, expiry | Consequence explanation | Permission and action IDs server-controlled |

Each component supports loading, empty, partial, stale, error, and completed variants in production. Prototype components expose partial evidence, stale decisions, missing observations, no authority, and outcomes; async loading/error adapters are backend work.

## Adaptation boundaries

Jev selects eligible structural choices. Code assembles and validates. LLM fills only copy slots. Trusted renderer owns interaction and design system. Component IDs follow semantic subjects; preserve drafts, focus, and selection across rerenders. Avoid replanning mid-approval without a changed-state notice.

The prototype uses a deterministic catalog plan with the same split. Inspect surface shows this explicitly. It is not a live Jev call and is not wire-compatible A2UI until a transport adapter is added.

## Teams and channels

Owner, manager, and employee see different projections. Restrict information before models and channel delivery, not merely by CSS or hidden controls. Multiple viewers share canonical decision state/version. Each channel provides a deep link and exact proposal reference; it does not create another approval.

## Benchmark

Disqualify leakage, invented figures, omitted authority, missing material uncertainty, inaccessible actions, and state loss. Among eligible surfaces compare correct understanding, correct action, time to orientation, error rate, retained inputs, rendering reliability, and latency/cost. Score typography and component variants by actual task performance and accessibility—not isolated appearance or Jev confidence.
