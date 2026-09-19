# Architecture and semantic domain

`docs/architecture-contract.md` is the authoritative boundary contract. This document describes the mathematical domain inside that contract.

## Dependency direction

```text
problem model / math generation / canonical DSL
                    |
                    +------> Skin adapters
                    |
                    +------> Mode use-cases
                              \
                               +--> composer/application --> PuzzleScreen --> Lit UI
```

Domain and Mode use-cases are framework-independent TypeScript. Skins and Modes are orthogonal peers over one canonical `Problem`; they do not import each other. The Lit layer renders the composed screen model and dispatches user actions. All public domain operations use domain types rather than parser-tree, HTML, KaTeX, concrete Skin, or concrete Mode objects.

## Identity and meaning

Use stable, theme-free quantity IDs such as `base`, `count`, `unitValue`, and `total` as references. Learner-facing descriptive names such as `dronePower`, `followersPerPost`, or localized equivalents are Skin presentation/name-resolution metadata and may vary without changing the problem. Academic symbols are notation/Mode presentation metadata and may also vary without changing the problem. Define problem data separately from Skin, Mode, submitted answer, checker diagnostics, localization resources, and presentation state.

A named-expression puzzle resolves the active Skin/locale variable names back to canonical quantity IDs before checking. Localized labels, contextual dimensions/units, nouns, prompts, story fragments, symbols, and feedback never become canonical mathematical identity. The DSL/debug representation uses stable canonical IDs so fixtures and mathematical replay remain theme- and language-neutral.

A useful starting model (illustrative TypeScript, refine through tests):

```ts
type QuantityId = string;
type ConceptId = string;

type Expr =
  | { kind: 'literal'; value: number }
  | { kind: 'quantity'; id: QuantityId }
  | { kind: 'add'; left: Expr; right: Expr }
  | { kind: 'multiply'; left: Expr; right: Expr };

type Relation = { kind: 'equation'; left: Expr; right: Expr };

type Quantity = {
  id: QuantityId;
  role?: 'base' | 'count' | 'per-item' | 'total';
  dimension: GenericDimension;
  given: { kind: 'known'; value: number } | { kind: 'hidden' };
};

type Problem = {
  id: string;
  concepts: readonly ConceptId[];
  quantities: readonly Quantity[];
  relation: Relation;
  replay?: { seed: number; generatorVersion: string };
};
```

A generated **answer key** separately preserves the complete numeric bindings, including the hidden value. The learner-facing `Problem`/screen model exposes only given facts. Use explicit boundaries so serializing a puzzle or inspecting its browser state cannot inadvertently reveal the answer key. A local development/debug printer may receive the key deliberately.

The AST's `quantity` node carries an ID, not a cached value. A binding environment supplies values to evaluation. `hidden` is a property of problem visibility, not a statement that the mathematical variable lacks a true value.

## Initial AST and extensions

Start with literals, references, addition, multiplication, and equations. Add parenthesized parsing into the expression tree while preserving precedence on output; groupings that change structure remain visible in the tree. Add subtraction/division in a later small test-driven extension if needed by the initial checker or puzzle. Powers, roots, geometry and functions are roadmap concepts.

Use integer-safe, bounded Phase 1 generation. JavaScript numbers are acceptable inside configured safe integer ranges; use validated integer arithmetic and document division/rational support when introduced. Add explicit zero/negative/overflow validation as concepts evolve.

## Dimensions and quantity roles

Keep canonical mathematical dimensions generic enough to describe the reusable shape without naming a theme. Contextual dimensions and units such as MW, drones, followers, posts, MW/drone or followers/post belong to the active Skin presentation and can be validated there against canonical roles.

Test canonical rules using canonical IDs/roles, for example that the reusable relation is structurally valid and that incompatible generic dimensions are rejected. Separately test each Skin's unit/fact ledger for contextual consistency. A Skin must not make its concrete dimensions authoritative by rewriting the canonical `Problem`.

## Semantic operations

Use visitors or pure pattern-matching functions over the AST. Introduce an operation when a failing use-case needs it:

| Operation | Contract |
| --- | --- |
| `evaluate(expr, bindings)` | Pure calculation with explicit unknown/missing-binding result. |
| `evaluateRelation(relation, bindings)` | Validate that full solution satisfies the equation. |
| `collectReferences(relation)` | Traverse referenced quantity IDs, detect unresolved names. |
| `validateProblem(problem, key?)` | Check IDs, visibility, references, dimensions, solution and schema invariants. |
| `substitute(expr, visibleBindings)` | Replace known quantities with literals, preserve the hidden variable. |
| `normalize(expr, policy)` | Apply only allowed transformations and preserve meaningful grouping. |
| `toLatex(relation, symbols)` | Render academic output with correct precedence and notation. |
| `printAst`, `printDebug` | Stable, readable test/debug output. |

`collectReferences` plus problem quantity visibility determines the set of unknowns. Keep the traversal separate from hiding/display mechanics.

## Checking and pedagogical identity

Define independently:

1. **Syntactic validity:** learner input parses and resolves to declared quantities/symbols.
2. **Structural match:** expected operator structure/relations match under an explicit policy.
3. **Mathematical equivalence:** expressions have the same value, or a future symbolic engine establishes equivalence under stated assumptions.
4. **Pedagogical match:** the learner expresses the requested semantic roles and relationship.

Initial check policies: `exact-structure`, `normalized-structure`, `equivalent-value`. Provide equation comparison explicitly; decide by a test whether swapping entire left/right sides is accepted for an exercise. Pure numeric equality at one sample binding is insufficient evidence of general algebraic equivalence. `equivalent-value` therefore applies to *fully ground arithmetic* in Phase 1, while named modelling exercises use structural/pedagogical checking.

Example: `4*(p+30)` and `30+4*p` are mathematically different. `4*p+30` and `30+4*p` may pass normalized structural checking. Preserve a diagnostic for applying a fixed cost four times.

## Interfaces at the UI boundary

Use cases accept explicit commands and return plain data:

```ts
type PuzzleCommand =
  | { kind: 'submit'; input: string }
  | { kind: 'hint' }
  | { kind: 'next' };

type PuzzleScreen = {
  context: {
    story: string;
    replay: { seed: number; skin: string; mode: string; locale: string };
  };
  task:
    | StoryToQuantitiesScreen
    | QuantitiesToNamedEquationScreen
    | FutureModeScreen;
};
```

The shared context belongs outside any one task's `source` representation. Refine the discriminated task union from use-case tests. The printer renders the same composed screen data that Lit renders with interactive accessible controls.
