# Compose canonical Problem, Theme and Mode independently

## Status

Accepted

## Context and problem statement

The Phase 1 specification intended mathematical generation and story/theme generation to be independent, but early examples also put `scenarioId`, theme-shaped quantity IDs/dimensions and academic presentation metadata into canonical `Problem`/DSL. Milestones 6 and 7 then let scenario binders rewrite `Problem` and let scenario folders manufacture task-specific definitions. Milestone 7.5 separated task selection only after those concerns had already been bundled together.

This produced a `ModelingCase` that still owned optional Story->Quantities and NamedEquation factories, and a generic-looking `PuzzleScreen` that actually represented one concrete edge. A second theme copied the same coupling instead of proving arbitrary composition.

We need one mathematical problem to support independent theme and task choices: two learners can receive identical mathematics while seeing different stories, and either story must support every puzzle mode.

## Decision drivers

- Canonical mathematics, DSL and answer identity must not depend on theme or task.
- A new Theme must work with existing Modes without adding task-specific code inside the Theme.
- A new Mode must work with existing Themes without importing concrete themes.
- Locale and input-provider choices are presentation/interaction choices rather than mathematical generation inputs.
- Architecture tests must be able to prove independence mechanically rather than relying on prose or normalized arithmetic equivalence.

## Decision outcome

Use four explicit boundaries: **Problem**, **Theme**, **Mode**, and **Composer/PuzzleScreen**.

1. The mathematical generator produces a theme-free, mode-free canonical `Problem` plus a separate private `AnswerKey`.
2. A Theme projects that Problem into contextual story, names, labels, units and localized presentation. A Theme never mutates or returns a rewritten `Problem`.
3. A Mode defines the representation edge, interaction/checking semantics and generic semantic distractors. A Mode never imports a concrete Theme.
4. Composition/application code selects both axes and combines their generic outputs into a `PuzzleScreen` whose task-specific state is a discriminated union and whose localized story/context is shared.

`Problem -> Theme -> Mode -> PuzzleScreen` is conceptual composition, not mandatory execution order. Theme and Mode are independent peers over the same Problem; composing them in either order must produce equivalent learner-facing semantics.

The canonical Problem DSL contains canonical mathematical identifiers/roles, relation structure, givens/concepts and mathematical replay only. Scenario/theme IDs, localized/contextual quantity names, story text and academic display selections live outside the canonical DSL. Exact replay of a learner-facing puzzle may record those selections in separate puzzle/session replay metadata.

Changing Theme, Mode, locale or input provider keeps the canonical Problem and AnswerKey unchanged. Changing the mathematical seed is what generates a new Problem.

## Consequences

- Scenario-specific IDs such as `dronePower` and `followersPerPost` become learner-facing Theme names mapped to canonical IDs such as `unitValue`, rather than AST identity.
- Existing scenario binders that rewrite quantities, relations or dimensions must be migrated to presentation-only Theme adapters.
- Task-specific files under concrete scenario folders must be generalized into Mode/composition logic.
- Existing DSL fixtures and the scenario-related portion of the 2026-09-18 canonical-DSL ADR require migration.
- Tests must cover the supported Problem × Theme × Mode × Locale Cartesian product and assert exact canonical identity.
- The browser may keep `scenario` and `task` URL parameter names for compatibility while internally treating them as Theme and Mode selections.
- This architecture intentionally accepts a larger cleanup now to avoid multiplying theme/task combinations as independent puzzle implementations.

## Supersedes

This decision supersedes the scenario-related parts of `2026-09-18-represent-canonical-problem-dsl-metadata.md`, specifically the decision that `scenarioId` and theme-shaped identifiers/dimensions are part of canonical `Problem`/DSL identity. The AnswerKey privacy and optional mathematical replay decisions from that ADR remain valid.
