---
name: architecture-guardian
description: Guard the repository's Problem × Skin × Mode architecture. Use before changing Problem/domain types, mathematical generation, DSL, skins/scenarios, puzzle modes/tasks, PuzzleScreen, or application composition; also use when adding a second implementation on any architecture axis.
---

# Architecture guardian

1. Read `docs/architecture-contract.md` and the newest relevant ADR under `docs/adr/` before editing production code.
2. Classify the requested change as **Problem**, **Skin**, **Mode**, **Composition/UI**, or a deliberate combination.
3. List every public type/field/API you plan to add or change and name its owning axis.
4. Identify the invariant that proves axes remain independent. Prefer exact canonical-identity and cross-product checks over arithmetic-equivalence-only tests.
5. Check dependency direction before implementation:
   - Problem/generation/DSL must not depend on Skin, Mode or UI.
   - Skin must not import/select concrete Modes.
   - Mode must not import/select concrete Skins.
   - Only composition/application code may select both.
6. Stop and redesign if a Skin would mutate/return a `Problem`, if mathematical generation needs a skin/scenario, or if task-specific factories would live under a concrete skin.
7. When adding the second implementation of an axis, search for branches or duplicated code tied to the first implementation and extract the independent abstraction before merge.
8. Start the implementation with the smallest architecture-level red test that demonstrates the required independence, then follow the normal red -> green -> refactor loop in `src/AGENTS.md`.
9. Before completion, verify the supported Problem × Skin × Mode × Locale cross-product and ensure hidden `AnswerKey` data is absent from learner-visible state.
10. In the final report, call out any new cross-axis dependency explicitly. Do not describe a rename/wrapper as architectural separation unless independent variation is demonstrated.

Use the repository contract as the source of truth rather than copying its rules into new local abstractions.
