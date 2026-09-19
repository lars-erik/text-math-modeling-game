# DSL and representation adapters

## DSL role

The domain AST is the authority. The DSL is its readable, serializable authoring/debug format. Parse a DSL fixture into a domain `Problem`, serialize generated `Problem` values into stable DSL, and replay both. The normal generator constructs ASTs directly, followed by validation and optional serialization.

Use Ohm/JS for a compact grammar and explicit semantic actions mapping parse nodes to domain unions. Keep the grammar adapter isolated. Use deterministic formatting and a documented canonical ordering.

## First canonical fixture

The canonical DSL is mathematical, not themed. A Phase 1 fixture is therefore shaped like:

```text
problem total-from-parts {
    concepts {
        arithmetic.addition
        arithmetic.multiplication
        algebra.variable
        linear.one-unknown
    }

    quantity base: scalar role base = 30
    quantity count: item role count = 4
    quantity unitValue: scalar role per-item = ?
    quantity total: scalar role total = 210

    equation {
        total = base + count * unitValue
    }

    replay {
        seed 17
        generator total-from-parts-v1
    }
}
```

Scenario/Skin selection, story text, learner-facing names such as `dronePower` or `followersPerPost`, contextual units, locale, puzzle Mode, input provider and academic display symbols are intentionally absent. They are separate composition/replay metadata.

Treat dashed problem IDs and dotted concept names as metadata identifiers. Expression identifiers resolve only to canonical quantity IDs. Evolve syntax from canonical mathematical tests rather than from one Skin's vocabulary.

### Canonical formatting and migration

The required Problem data is the canonical problem ID, ordered concept IDs, canonical quantity definitions (ID, generic dimension/role, known/hidden state), one relation, and optional mathematical replay. The private AnswerKey is never serialized.

Canonical serialization uses this section order: problem header, concepts, quantities in domain order, equation, optional replay, closing brace. It uses four spaces per indent, one space around expression operators, the minimum parentheses needed to reconstruct the exact expression tree, LF line endings, and one final newline.

The earlier Phase 1 DSL included `scenario` and theme-shaped quantity IDs/dimensions. ADR `2026-09-19-compose-problem-skin-mode-independently.md` supersedes that part of the contract. Migrate existing golden files deliberately as the implementation is refactored; do not preserve themed DSL solely for backward compatibility with the accidental coupling.

## Expression grammar: first increment

```
Expression := identifier | numeric literal | parenthesized expression | addition | multiplication
Equation   := Expression "=" Expression
```

Define correct operator precedence (`*` before `+`) and grouping. Whitespace is insignificant. Canonical DSL expressions use canonical IDs (`total = base + count * unitValue`), while learner input may use the active Skin's names.

Named-input identifiers resolve through the composed Skin/locale name map and then to canonical quantity IDs. For example, `dronePower`, `followersPerPost`, and localized equivalents can all resolve to canonical `unitValue` in different puzzle presentations. Academic-input identifiers resolve through a separate notation map owned by the relevant representation/Mode. Report ambiguous or unknown identifiers as parse/name-resolution feedback.

The expression parser accepts its name resolver as data rather than hard-coding a Skin or language. Tests prove that differently skinned/localized equations resolve to the same canonical AST. Neither learner name maps nor academic symbols enter the complete-problem DSL.

## Required round-trips

```text
Problem AST -> DSL serializer -> DSL parser -> semantically same Problem AST
DSL fixture -> parser -> serializer -> canonical DSL output
```

Compare normalized structural semantics and relevant metadata. Replay metadata may be generated outside the hand-authored fixture and must have a documented serialization policy. The printer is deterministic in ordering, whitespace and line endings.

Use example tests for grouping, precedence, unknown tokens, duplicate IDs, and undefined references; add fast-check round-trip properties once the generator works.

## Renderers

From one canonical AST plus explicit presentation inputs, define independent adapters:

- **Canonical named/debug printer:** `total = base + count * unitValue`.
- **Skin-aware learner named printer:** renders the same relation with the active Skin/locale name map.
- **Substitution printer:** replaces only known values while preserving the active learner-facing unknown name.
- **LaTeX/academic printer:** uses an explicit notation map supplied by the relevant representation/Mode.
- **Debug tree printer:** indented canonical AST plus quantity table, solution and mathematical replay info.
- **Story renderer:** canonical Problem + Skin presentation/story plan -> prose.

All printers are pure or accept explicit formatting options. Tests approve meaningful examples. Evaluate output only through the semantic engine, not by evaluating a LaTeX string or DSL string as program code.

## Notation equivalence and parenthesis safety

The LaTeX printer parenthesizes ASTs whenever omission would change meaning: `(a+b)*c` is grouped; `a+b*c` uses precedence. Output ordering may be normalized when the check policy allows it, and the pretty-printer preserves a learner's intended model. Provide explicit tests and approved render examples for each precedence case.

MathLive/Compute Engine integration is a later adapter decision; keep all underlying domain contracts reusable.
