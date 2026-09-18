# Architecture and semantic domain

## Dependency direction

```
Vite / Lit UI -> puzzle application/use-cases -> domain AST + semantic operations
                                          -> generators -> domain AST
DSL adapter <------------------------------> domain AST
Story adapter / LaTeX printer / trace printer <- domain AST and screen model
```

Domain and puzzle use-cases are framework-independent TypeScript. The Lit layer renders the screen model and dispatches user actions. Adapters supply DSL parsing, story templates, and notation. All public operations use domain types rather than parser-tree, HTML, or KaTeX objects.

## Identity and meaning

Use stable quantity IDs as references. Canonical quantity IDs remain locale-independent; learner-facing descriptive variable names (e.g. English `dronePower` or Norwegian `droneEffekt`) are presentation/name-resolution metadata and may vary without changing the problem. Academic symbols (`p`) are separate presentation metadata and may also vary without changing the problem. Define problem data separately from the learner's submitted answer, checker diagnostics, localization resources, and presentation state.

A named-expression puzzle resolves the active locale's variable names back to canonical quantity IDs before checking. Localized labels, nouns, units, prompts, story fragments, and feedback never become semantic identity. The DSL/debug representation continues to use stable canonical IDs so fixtures and replay remain language-neutral.

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
  label: string;
  dimension: Dimension;
  given: { kind: 'known'; value: number } | { kind: 'hidden' };
};

type Problem = {
  id: string;
  concepts: readonly ConceptId[];
  quantities: readonly Quantity[];
  relation: Relation;
  scenarioId: string;
  academicSymbols: Readonly<Record<QuantityId, string>>;
  replay: { seed: number; generatorVersion: string };
};
```

A generated **answer key** separately preserves the complete numeric bindings, including the hidden value. The learner-facing `Problem`/screen model exposes only given facts. Use explicit boundaries so serializing a puzzle or inspecting its browser state cannot inadvertently reveal the answer key. A local development/debug printer may receive the key deliberately.

The AST's `quantity` node carries an ID, not a cached value. A binding environment supplies values to evaluation. `hidden` is a property of problem visibility, not a statement that the mathematical variable lacks a true value.

## Initial AST and extensions

Start with literals, references, addition, multiplication, and equations. Add parenthesized parsing into the expression tree while preserving precedence on output; groupings that change structure remain visible in the tree. Add subtraction/division in a later small test-driven extension if needed by the initial checker or puzzle. Powers, roots, geometry and functions are roadmap concepts.

Use integer-safe, bounded Phase 1 generation. JavaScript numbers are acceptable inside configured safe integer ranges; use validated integer arithmetic and document division/rational support when introduced. Add explicit zero/negative/overflow validation as concepts evolve.

## Dimensions and quantity roles

Define a small dimension representation that can express a total, a count, and a per-item rate. Prefer typed dimensions over asserting that all counts are identical to dimensionless values; e.g. `MW/drone * drone -> MW` is the long-term interpretation. Initial Phase 1 can implement a minimal safe subset for addition and multiplication, with dimensions such as `power`, `item`, `powerPerItem`, `money`, `moneyPerItem`, and `scalar`, or a small base-exponent system. Write validity cases before choosing the representation.

Test initial rules:

- `basePower + droneCount * dronePower` evaluates to a power total.
- `basePower + droneCount` is rejected as dimensionally incompatible.
- A count multiplied by power per drone yields power.

Scenario mappings must assign coherent quantity labels and units to the roles and carry them through feedback.

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
  source: { kind: string; content: unknown };
  target: { kind: string; prompt: string };
  input: { kind: 'expression' | 'quantities' | 'choice'; value?: string };
  feedback?: { kind: string; message: string };
  replay: { seed: number; puzzleIndex: number };
};
```

Refine these types from the first use-case printer. The printer renders screen data, and Lit renders the same data with interactive accessible controls.
