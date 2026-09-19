# Architecture contract: Problem × Skin × Mode

**Status:** authoritative architecture contract.

If older milestone prose, existing code, or an older ADR conflicts with this document, follow this contract and the newest accepted ADR until the conflict is deliberately resolved.

## Core composition

```text
                  Puzzle Generator
                         |
                         v
                  canonical Problem
                    /         \
                   /           \
                Skin           Mode
                   \           /
                    \         /
                     Composer
                        |
                        v
                   PuzzleScreen
```

`Problem -> Skin -> Mode -> PuzzleScreen` is a conceptual composition, not a required execution order. Skin and Mode are independent peers over the same canonical `Problem`. The composer may evaluate either first or both independently; the result must not depend on ordering.

## Ownership

| Concern | Owner | May contain | Must not contain |
| --- | --- | --- | --- |
| Canonical mathematics | `Problem` | concepts, canonical quantity IDs/roles, generic mathematical dimensions, givens, relation, mathematical replay | scenario/skin ID, story text, learner-facing names, localized units, concrete theme IDs, task/mode, input provider |
| Hidden numeric solution | `AnswerKey` | complete bindings keyed by canonical quantity ID | browser-visible registry or `PuzzleScreen` state |
| Theme and language | Skin | story plan, story text, contextual labels, learner-facing variable names, contextual units/dimensions, locale resources | a rewritten `Problem`, concrete Mode imports, task-specific factories/checkers |
| Learning task | Mode | representation source/target, interaction state, semantic answer shape, checker policy, generic distractor semantics | concrete Skin/theme imports or scenario-specific quantity IDs |
| Learner-facing composition | Composer / application | selected Problem, Skin, Mode, locale/input mode, merged generic presentation contracts | hidden `AnswerKey` |
| Rendered use-case state | `PuzzleScreen` | shared story/context plus a discriminated task-specific state | assumptions that every task is quantities -> named equation |

## Canonical Problem

A generated `Problem` represents mathematics only. For the initial family its identity is equivalent to:

```text
total = base + count * unitValue
```

with canonical roles/IDs such as `base`, `count`, `unitValue`, and `total`. A drone skin may display these as `basePower`, `droneCount`, `dronePower`, and `totalPower`; a creator skin may display them as follower/post concepts. Neither mapping changes the `Problem` or its relation AST.

Mathematical generation therefore takes mathematical inputs such as seed, concepts and numeric constraints. It does not take `scenarioId`, `skinId`, locale, task/mode, or input provider.

The canonical DSL serializes only canonical mathematics and mathematical replay. Skin/scenario selection, localized names, story text and academic display choices are separate replay/presentation metadata.

## Skin

A Skin is a pure projection of a canonical `Problem` into learner-facing context. A useful conceptual contract is:

```ts
type SkinPresentation = {
  story: { text: string; plan: unknown };
  quantities: Readonly<Record<QuantityId, {
    label: string;
    variableName: string;
    unit?: string;
  }>>;
};

renderSkin(problem, skinId, locale, storySeed): SkinPresentation
```

A Skin may validate that its contextual units and wording are coherent with canonical roles. It must not return another `Problem`, rename IDs inside the AST, rewrite the relation, or generate Story->Quantities / NamedEquation task definitions.

## Mode

A Mode selects the representation edge being trained. Initial modes are:

- Story -> Quantities
- Quantities -> Named Equation

Free text and multiple choice are input providers within the same named-equation Mode, not distinct mathematical cases or skins.

Mode logic works with canonical semantic IDs/roles. Distractor relations are generated semantically from canonical math. Learner-facing labels for those relations are rendered later from a generic name map supplied by composition; the Mode does not import a concrete Skin.

## Composer and PuzzleScreen

The application selects a canonical Problem, Skin, Mode, locale and optional input provider and composes them:

```ts
composePuzzle({ problem, skin, mode, locale, inputMode }): PuzzleScreen
```

`PuzzleScreen` has shared context, including the active localized story, plus a discriminated union for Mode-specific source/target/input/feedback. Story -> Quantities uses the story as its source. Quantities -> Named Equation still displays the same story as context alongside the quantities.

Changing Skin, Mode, locale or input provider keeps the same canonical Problem and AnswerKey. Changing only the mathematical seed generates a different Problem.

## Required invariants

Treat supported dimensions as a Cartesian product:

```text
Problem(seed)
  × Skin(drone | creator | ...)
  × Mode(story->quantities | quantities->named-equation | ...)
  × Locale(en | nb | ...)
  × InputProvider(where applicable)
```

Architecture tests must prove:

1. Applying any Skin or Mode does not mutate the canonical `Problem`.
2. The same Problem/DSL/relation/AnswerKey is reused across every Skin and Mode.
3. Every supported Skin composes with every supported Mode.
4. Composition order is irrelevant.
5. Locale changes presentation only.
6. Hidden answer bindings never enter learner-visible screen/registry state.
7. Generic UI and Mode code do not import concrete Skin implementations.

Prefer exact semantic identity assertions (`expect(after).toEqual(before)`) over weaker checks that two themed problems merely evaluate to the same number or normalized shape.

## Dependency direction

```text
problem-model / generation / DSL
            |
            +------> skins
            |
            +------> modes
                      \
                       +--> composer/application --> PuzzleScreen --> Lit UI
```

Skins and Modes may depend on shared domain contracts. They may not depend on each other. Concrete Skin registries and Mode registries meet only in application/composition code.

## Smells that require redesign before merge

- `if (skinId === ...)` inside mathematical generation or a Mode.
- `if (mode === ...)` inside a Skin.
- A Skin binding returns `{ problem: ... }`.
- A Skin rewrites quantity IDs, relation nodes or academic symbol maps on `Problem`.
- A scenario folder contains task-specific factories such as `named-equation-definition` or `story-quantities-definition`.
- A supposedly generic `PuzzleScreen` hardcodes one source/target edge.
- Adding a second Skin or Mode requires copying a large branch from the first.
- A test proves only arithmetic/normalized equivalence when the architecture requires object/semantic identity.

## Rule of two

The second implementation of an axis is the abstraction test. Before merging a second Skin, second Mode or second mathematical family, remove branching/duplication that couples the first implementation to another axis. Do not preserve the first implementation as the implicit generic API merely because it already works.
