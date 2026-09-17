# DSL and representation adapters

## DSL role

The domain AST is the authority. The DSL is its readable, serializable authoring/debug format. Parse a DSL fixture into a domain `Problem`, serialize generated `Problem` values into stable DSL, and replay both. The normal generator constructs ASTs directly, followed by validation and optional serialization.

Use Ohm/JS for a compact grammar and explicit semantic actions mapping parse nodes to domain unions. Keep the grammar adapter isolated. Use deterministic formatting and a documented canonical ordering.

## First canonical fixture

```text
problem drone-power {
    concepts {
        arithmetic.addition
        arithmetic.multiplication
        algebra.variable
        linear.one-unknown
    }

    quantity basePower: power = 30
    quantity droneCount: item = 4
    quantity dronePower: powerPerItem = ?
    quantity totalPower: power = 210

    equation {
        totalPower = basePower + droneCount * dronePower
    }

    scenario gaming.drone-power
    symbol dronePower = p
}
```

Treat dotted concept/scenario names and dashed problem IDs as identifiers in the metadata grammar. Expression identifiers remain separately lexed and resolved to quantity IDs. Symbols have explicit mappings. Start with this single fixture and evolve syntax from tests.

## Expression grammar: first increment

```
Expression := identifier | numeric literal | parenthesized expression | addition | multiplication
Equation   := Expression "=" Expression
```

Define correct operator precedence (`*` before `+`) and grouping. Whitespace is insignificant; an input such as `basePower+4*dronePower` is valid when the referenced quantities exist. Learner input initially uses explicit `*` multiplication (`4*p`); the notation printer may display `4p`. This keeps academic display and textual input parsing as separate concerns.

Resolve `p` through a declared symbol mapping in academic-input puzzles. Resolve descriptive names through quantity IDs in named-input puzzles. Report ambiguous or unknown identifiers as parse/name-resolution feedback.

## Required round-trips

```text
Problem AST -> DSL serializer -> DSL parser -> semantically same Problem AST
DSL fixture -> parser -> serializer -> canonical DSL output
```

Compare normalized structural semantics and relevant metadata. Replay metadata may be generated outside the hand-authored fixture and must have a documented serialization policy. The printer is deterministic in ordering, whitespace and line endings.

Use example tests for grouping, precedence, unknown tokens, duplicate IDs, and undefined references; add fast-check round-trip properties once the generator works.

## Renderers

From a single AST, define independent adapters:

- **Named printer:** `totalPower = basePower + droneCount * dronePower`.
- **Substitution printer:** `210 = 30 + 4 * dronePower`; replace only known values.
- **LaTeX printer:** `210 = 30 + 4p`, using the symbol map and mathematical precedence.
- **Debug tree printer:** indented AST plus quantity table, solution and replay info.
- **Story printer:** structured facts -> template-based prose.

All printers are pure or accept explicit formatting options. Tests approve meaningful examples. Evaluate output only through the semantic engine, not by evaluating a LaTeX string or DSL string as program code.

## Notation equivalence and parenthesis safety

The LaTeX printer parenthesizes ASTs whenever omission would change meaning: `(a+b)*c` is grouped; `a+b*c` uses precedence. Output ordering may be normalized when the check policy allows it, and the pretty-printer preserves a learner's intended model. Provide explicit tests and approved render examples for each precedence case.

MathLive/Compute Engine integration is a later adapter decision; keep all underlying domain contracts reusable.
