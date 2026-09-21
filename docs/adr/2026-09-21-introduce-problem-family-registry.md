# Introduce a problem-family registry with mode-level capability declarations

## Status

Accepted

## Context and problem statement

Phase 1 shipped exactly one mathematical family, `total = base + count * unitValue`. Several pieces of the codebase quietly assumed that shape: themes mapped a fixed `Record<QuantityRole, ...>` of exactly four roles, story plans required a `base` fact, the named-equation multiple-choice distractor assumed the relation's right side is an addition, and the session and application composed problems by calling the total-from-parts generator directly.

Milestone 11 adds a second family, `total = count * unitValue`, with no grammar extension. The Phase 2 plan's rule of two requires the second family to be an architecture test, not a special case: no fake `base = 0`, no per-family copies of Themes or Modes, and no `if (familyId === ...)` branches scattered through generic code.

## Decision drivers

- Family selection and generation must stay mathematical: theme-free, mode-free, locale-free and UI-free.
- Dependency direction must not invert: Modes depend on shared domain contracts, so the domain family registry must not depend on Modes.
- Themes must declare which role structures they can present instead of assuming every problem has a base role.
- Capability must be explicit: an unsupported family x mode combination must be a declared fact, not a silent fallback to another family or an invalid projection.
- Distractor semantics must remain genuinely incorrect for every family; a regrouping that is a no-op for a family must not be presented as a different choice.
- Deterministic replay must survive: adding a family must not change any existing seed's output.

## Decision outcome

1. `features/problem-generation/problem-families.ts` is an explicit family registry. Each entry declares a `ProblemFamilyId`, the required canonical roles and a deterministic seeded generator; `generateFamilyCase` validates every generated `Problem` against the declared roles so the declaration is operational, not decorative. It contains no Theme, Mode, locale or UI knowledge. The registry is proven by two real implementations: `total-from-parts` and `groups-total`. Shared seed/random helpers live in `random-source.ts` so generators share one deterministic source.
2. Themes declare `supportedRoleStructures`. A Theme lists the exact role sets it can present and throws an explicit error for anything else. Story plans select their sentence structure from the roles actually present, so a `groups-total` problem gets a mathematically honest story ("the drones draw 63 MW in total") rather than a fact about a base quantity that does not exist.
3. Family x mode capability is proven by composition, not by a speculative declaration table. Both current families support all four modes, so the family x theme x mode x locale cross-product composition test is the source of truth: it fails the moment a family x mode pair genuinely cannot compose. A per-mode support registry will be introduced only when a real unsupported combination exists, at which point composition will consult it explicitly and reject unsupported pairs rather than silently falling back.
4. Distractors are equivalence-checked. `createNamedEquationChoiceSeeds` derives distractors semantically from the canonical relation and filters out any candidate that is structurally equivalent to the answer or another choice under the accepted named-equation structure policy, plus an `add-instead-of-multiply` distractor that covers pure-product structures genuinely.
5. Replay contract. Family selection is part of the canonical puzzle hash (`#puzzle?...&family=groups-total`), defaults to `total-from-parts` when absent, and is validated at the route boundary. Session snapshots do not carry a family: the M10 session planner still selects the default family, so existing persisted sessions resume with exactly the same mathematics. Mixed-family session planning remains M15.

## Consequences

- Adding a third family means adding a registry entry, a generator with a property test, and a role structure per Theme; no Mode implementation changes unless the family genuinely cannot support one.
- Architecture boundary tests enforce that generation never depends on Modes, Themes or UI; the rule was verified red against a deliberate violation before going green.
- The unknown role of both families remains `unitValue`; variable unknown roles are deliberately deferred to M12.
- The existing seed-17 approvals are unchanged, proving deterministic replay was preserved for Phase 1 behavior.

## Supersedes

Nothing. This decision generalizes the Phase 1 single-family behavior documented in `2026-09-19-compose-problem-theme-mode-independently.md` without changing that ADR's boundaries.
