# Text Math Modeling Game — specification package

**Status:** planning baseline, 17 September 2026. **Scope:** Phase 1 only has implementation milestones; later phases are architectural direction.

Build a test-driven web puzzle for translating between natural-language situations, quantity models, named expressions, substituted expressions, and academic notation. The same deterministic semantic problem powers every representation.

## Reading order

1. [Product and learning loop](docs/01-product-and-learning-loop.md) — intent, representation graph, initial use cases.
2. [Architecture and semantic domain](docs/02-architecture-and-domain.md) — AST, quantities, operations, validation, checking.
3. [DSL and representations](docs/03-dsl-and-representations.md) — editable syntax, parsing, serialization, notation.
4. [Procedural generation and scenarios](docs/04-generation-and-scenarios.md) — composable concept generators, seeds, story templates.
5. [Graybox puzzles and UI](docs/05-graybox-core-loop.md) — initial exercises, two-way traversal, screen contract.
6. [TDD and approval testing](docs/06-testing-and-approvals.md) — golden masters, use-case printers, properties, DOM testing.
7. [Phase 1 execution plan](docs/07-phase-1-plan.md) — small red/green/refactor milestones and acceptance criteria.
8. [Future roadmap](docs/08-future-roadmap.md) — architecture boundaries only.
9. [Technology decisions](docs/09-technology-decisions.md) — Lit, Svelte, Vue, React; Vite/Bun; parser and renderer trade-offs.

[Codex working agreement](src/AGENTS.md) specifies how an implementation agent should proceed.

## First vertical slice

Use the equation family `total = base + count * unitValue` and a drone-power story. Generate valid values by construction, hide `unitValue`, print a deterministic use-case transcript, accept a named equation, parse and check it, show structured feedback, and render academic notation. Add the reverse transformation and a second scenario only after this path works.

## Architectural invariant

```
Generator ──────┐
DSL parser ─────┼──> semantic Problem AST ──> puzzle/use-case ──> screen model
                │            │                      │                  │
                │            ├──> DSL/LaTeX printers └──> trace printer  ├──> Lit view
                │            └──> scenario renderer                     └──> approval
                └── DSL serializer (AST → text)
```

The domain remains usable from tests and command-line tooling without a browser. All generated cases are reproducible with seed + generator version/configuration. The test suite includes exact invariants, properties, and human-reviewed approved artifacts.

## Development

Milestone 0a is pinned and verified with Node `v24.12.0` and npm `11.6.2`.
The implementation package is rooted in `src/` so the repository can add other technology packages later without restructuring this one.

```powershell
cd src
npm install
npm run browser:install
npm run typecheck
npm test
npm run build
```

Approval tests write deterministic `*.received.*` files when a baseline is missing or changed. Received files are ignored by Git. Inspect the console diff and received file before manually promoting it to the corresponding committed `*.approved.*` file. Tests and CI never update approved files automatically.

`browser:install` keeps Playwright's Chromium binaries under `src/node_modules`; it does not write them to the user-level Playwright cache. `npm test` runs both the Node approval suite and the headless Chromium interaction suite.
