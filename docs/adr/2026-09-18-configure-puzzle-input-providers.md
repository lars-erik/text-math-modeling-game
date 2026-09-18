# Configure puzzle input providers independently of checking

## Status

Accepted

## Context and problem statement

The quantities-to-equation puzzle needs both the existing multiple-choice
interaction and the Milestone 3 text parser. Later puzzle modes may submit
structured or editor-produced JSON rather than strings. Making the root Lit
component own one hard-coded form couples presentation choice to semantic
checking and makes each new input mode replace the previous one.

The development page also needs a temporary way to select a concrete puzzle
without importing that puzzle from the reusable component. UI-specific code
should be visibly separated from framework-independent puzzle use cases while
tests remain colocated with their feature.

## Decision drivers

- Multiple input experiences must coexist for the same semantic puzzle.
- Input components must not perform parsing or mathematical checking.
- The use case needs a typed, extensible answer boundary suitable for future
  structured JSON answers.
- A puzzle component must be configurable from markup without embedding the
  reference puzzle in the component implementation.
- The current feature layout should expose the Lit boundary without requiring
  a repository-wide reorganization.

## Considered options

1. Keep one input form in `math-modeling-puzzle` and replace it per milestone.
2. Add conditional text and radio markup directly to the root component.
3. Use input-provider definitions backed by individual web components, with a
   shared learner-answer union passed to the framework-independent use case.

## Decision outcome

Use option 3.

`math-modeling-puzzle` selects an input-provider definition by its
`input-mode` attribute. Each provider renders an individual web component and
emits a bubbling `puzzle-answer` event whose detail implements the shared
`LearnerAnswer` union. The initial variants are `text` and
`multiple-choice`. Parsing, name resolution, normalization, and checking stay
in `submitPuzzle`; input components only collect and package learner intent.

The root component resolves its `puzzle` attribute as a key in the global
`mathModelingPuzzles` registry. `main.ts` owns and populates that registry with
the reference puzzle before loading the custom element. This registry is a
temporary application-composition mechanism, not domain state.

Lit components, provider definitions, and browser tests live under
`features/puzzle/ui/`. Framework-independent puzzle definitions, answer
contracts, screen models, use cases, printers, and their unit/approval tests
remain directly under `features/puzzle/`. Further nesting is deferred until a
second implementation technology or a larger application layer makes it
useful.

The temporary graybox UI exposes a small mode navigation bar. Selecting a mode
updates the reflected `input-mode` attribute and restarts the current puzzle
screen so drafts and feedback from incompatible providers are not mixed.

## Consequences

- Multiple choice and parsed text input remain available for the same puzzle.
- Future input modes add a learner-answer variant, a web component, and a
  provider registration without moving mathematical logic into Lit.
- Puzzle markup is explicit and reproducible, for example
  `<math-modeling-puzzle puzzle="reference" input-mode="text">`.
- The global registry must be populated before the custom element is loaded;
  `main.ts` therefore uses a dynamic import after registration.
- Switching modes currently resets the puzzle screen. Persisting independent
  drafts per provider can be added when a use case requires it.
- The registry is intentionally simple and should be replaced by the eventual
  session/puzzle composition boundary rather than expanded into a service
  locator.
