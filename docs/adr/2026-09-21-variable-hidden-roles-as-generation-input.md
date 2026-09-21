# Variable hidden roles as a generation input

## Status

Accepted

## Context and problem statement

Through Milestone 11 the hidden quantity of every problem was implicitly `unitValue` (the `per-item` role). Tests, session planners, themes and UI helpers quietly hardcoded that fact: answers selected `unitValue` as the unknown, question fragments were written for a missing per-item value, and the session fixture asserted `known = base, count, total`.

Milestone 12 makes the unknown quantity a real dimension of the learning task: any role the family declares may be the hidden one, and the same mathematics should be exercisable with different unknowns — finding the count, the base, or the total instead of always the unit value.

## Decision drivers

- The hidden role is mathematics, not presentation: it changes which quantities are given, so it belongs to generation, not to Themes, Modes or the UI.
- Values must be independent of the hidden role: the same seed must produce the same numbers so that `count = ?` is guaranteed integer-clean (no fractional counts from dividing) and theme invariance stays provable.
- Deterministic replay must survive: the resolved hidden role must be recorded in the replay contract and the canonical puzzle hash, and the previous default behavior must remain bit-identical.
- No Mode may learn about hidden roles: M11's visibility-driven abstractions (checking against `given.kind`, deriving substitutions from visibility, role-keyed theme fragments) must absorb the change without production Mode edits.
- Family capability must be operational: an unsupported hidden role must be rejected, not silently coerced to another role.

## Decision outcome

1. **Declaration.** Each family in the registry (`problem-families.ts`) declares `hiddenRoles`: `total-from-parts` supports `per-item`, `base`, `count`, `total`; `groups-total` supports `per-item`, `count`, `total` (it has no base role to hide). `generateFamilyCase(familyId, { seed, hiddenRole })` validates the resolved role against the family declaration and throws for unsupported roles.

2. **Generation input, not presentation.** The generator draws identical values for a seed regardless of `hiddenRole`; the role only decides which quantity is `{ kind: 'hidden' }` versus `{ kind: 'known', value }`. Default `'per-item'` reproduces every pre-M12 seed exactly.

3. **Replay.** `Problem.replay.hiddenRole` and the canonical DSL `replay { ... hidden-role <role> }` record the choice; grammar, serializer and parser round-trip it (property-tested). The puzzle route carries `hidden-role` (kebab-case) in the canonical hash, validated at the route boundary against the family registry. Session snapshots do not carry a hidden role: the session planner assigns one per item.

4. **Themes are visibility-driven.** Story sentences are built from known facts only; the question fragment is selected by the hidden fact's role through role-keyed fragment maps in the theme language resources. No theme branches on concrete quantity IDs.

5. **Modes unchanged.** All four Modes already read `given.kind` visibility and canonical structure, so no production Mode changes were needed; a source-scan test forbids `hiddenRole === 'unitValue'`-style branches, and the family x hidden-role x theme x mode x locale cross-product composition test (112 combinations) is the source of truth.

6. **Session planner v2.** `session-plan-v2` shuffles the default family's hidden roles across items and rotates them like modes. The planner-version bump intentionally invalidates persisted snapshots per `docs/11-session-persistence.md`; a snapshot from an older planner is reported `incompatible` and re-planned from its seed, never silently resumed with different mathematics.

## Consequences

- Any consumer that needs the known/unknown split must derive it from quantity visibility (or the declared role), not from a hardcoded quantity ID; the session fixtures and browser helpers were rewritten to do so.
- Answer difficulty now varies within a session (finding a factor vs. a product vs. a sum term), which is the pedagogical point of the milestone.
- Adding a hidden role for a future family means declaring it in the registry and adding the matching theme question fragments; Modes and composition need no changes.
- Fractional answers (e.g. a non-integer per-item value when it must be hidden) are deliberately out of scope; generation ranges currently guarantee integer-friendly values for every supported role. Genuine fraction support is deferred with M13+ work on numeric domains.

## Supersedes

Nothing. It extends the family registry of `2026-09-21-introduce-problem-family-registry.md`, which explicitly deferred variable unknown roles to M12.
