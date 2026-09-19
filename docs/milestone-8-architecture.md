# Milestone 8 architecture note

Milestone 8 adds the two representation edges between named equations and
academic notation without changing canonical `Problem`, its DSL, or
`AnswerKey`.

## Ownership

- `features/representations/substitute-visible-values.ts` visits a canonical
  relation and replaces only visible Problem givens with literals. It receives
  no `AnswerKey`.
- `features/representations/academic-symbol-map.ts` creates and validates a
  deterministic `QuantityId -> symbol` map independently of Theme.
- The named and academic relation visitors consume canonical AST plus explicit
  name/symbol maps. Their strings are boundary output only; serialized DSL text
  is never an intermediate semantic representation.
- The existing Ohm expression parser remains the only learner-expression
  grammar. The academic parser adapter only reverses the symbol map before
  delegating to it.
- The two new Modes own direction, input state, parsing and structural checking.
  They import no concrete Theme.
- The composer is the first layer that combines a Mode relation/symbol map with
  Theme-localized learner names. `PuzzleScreen` carries AST and maps rather than
  treating formatted strings as authoritative.
- `academic-notation-display` depends on an `AcademicDisplayAdapter`. The
  application injects the KaTeX adapter; semantic, representation, Mode and
  screen-model modules do not import KaTeX. Our AST visitor owns
  `renderToString`; KaTeX is only a replaceable read-only display implementation.

The architecture suite exercises the full two Themes × four Modes × two locales
product, exact canonical Problem/DSL identity, AnswerKey privacy, Theme import
boundaries, and the isolated KaTeX dependency.
