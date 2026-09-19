# Source implementation working agreement

Follow `../AGENTS.md` first. Read `../readme.md`, `../docs/architecture-contract.md`, and the relevant `../docs/` document before editing. Treat the Phase 1 plan as implementation scope only where it agrees with the architecture contract and accepted ADRs.

## Architecture preflight

Before changing domain/problem types, mathematical generation, DSL, skins/scenarios, puzzle modes/tasks, `PuzzleScreen`, or application composition, follow `../.agents/skills/architecture-guardian/SKILL.md`. Codex may auto-discover the skill; Copilot, Mistral and other agents must apply the same checklist manually.

Do not begin the normal red/green loop until the change has an explicit axis owner (Problem, Skin, Mode, or Composition/UI) and an independence invariant. A rename or wrapper around an already coupled object does not satisfy this preflight.

## Working rhythm

1. Select one acceptance criterion from `../docs/07-phase-1-plan.md`.
2. Add exactly one smallest test expressing the next observable behavior.
3. If it does not compile, add only enough production interface for it to compile.
4. Run that test and confirm it fails for the intended behavioral reason.
5. Add, remove, or modify only enough production code to make that test pass.
6. Refactor with the focused test green, then repeat from step 2 for the next behavior.
7. Report the changed files, test command/results, accepted approval artifacts, and the next smallest step.

Do not batch several predicted behaviors into one red phase. A compile failure may be
the first useful feedback when shaping a new interface, but follow it with a behavioral
red result before implementing the behavior. Add broader approval and browser coverage
after the underlying behavior has emerged through these one-test cycles.

Prefer affirmative requirements and acceptance criteria over prohibition lists. Propose a narrowly scoped change when an existing design decision conflicts with a discovered technical constraint.

## System boundaries

- Keep semantic types, validation, generation, and checking framework-independent.
- Generate a canonical, theme-free and mode-free domain AST, then serialize it into DSL; parse user input back into the same domain AST.
- Keep problem facts and hidden answers authoritative; skins, story templates, learner-facing names and academic notation are views.
- Keep Skin and Mode as orthogonal axes. A Skin never rewrites/returns `Problem` or owns task-specific factories; a Mode never imports a concrete Skin; only application/composition selects both.
- Keep mathematical equivalence, expected structure, and pedagogical intent distinguishable.
- Use explicit seeded random sources and print replay details with failures.
- Keep UI state and transitions accessible through pure use-case interfaces and stable printers.
- Use ApprovalTests for human-reviewed use-case/debug output. Use precise assertions and fast-check for mathematical invariants. Test the browser UI with interaction assertions and selective semantic-DOM approvals.
- Commit `*.approved.*`; exclude `*.received.*`; review diffs before accepting new baselines. CI verifies approved artifacts and does not reapprove them.

## Source layout

Organize implementation under `features/<feature-name>/`. Colocate each feature's production modules, unit tests, browser tests, approval tests, approved artifacts, and test fixtures. Use the suffixes `*.unit.test.ts`, `*.browser.test.ts`, `*.approval.test.ts`, and `*.fixture.ts` so test and production build configurations remain explicit.

Keep only cross-feature test infrastructure under `testing/`. Production modules must not import test modules, fixtures, or `testing/`; `tsconfig.build.json` and Vite's entry graph exclude them from production builds.

## Initial stack decision

Use TypeScript, Lit, Vite, Vitest, fast-check, KaTeX, and Ohm/JS as the **working hypothesis**. Validate Lit + Vitest browser + the Node approvals package in a small compatibility spike before investing in UI. Keep the package manager/runtime on standard Node + npm for that spike; Bun remains an optional subsequent change.

## Context7 documentation

Use the locally configured Context7 MCP server for current third-party library and framework documentation when work depends on API signatures, installation, configuration, version-specific behavior, or browser-test setup. Codex starts the server on demand; no separate editor process needs to keep it running.

1. Call `resolve-library-id` with the library name and the specific documentation question.
2. Select the result that matches the required version, authoritative source, and relevant coverage.
3. Call `query-docs` with the returned `libraryId` and a focused question.
4. If the user or repository already supplies a Context7 library ID, skip resolution and call `query-docs` directly.

Context7 answers library questions; this repository's specifications and approved ADRs remain authoritative for product, mathematical, and architectural decisions. If the Context7 tools are unavailable, run `codex mcp list` to diagnose the connection and report the limitation. Do not silently guess version-sensitive APIs or install/reconfigure the server as a workaround.

## Stop and report

At the end of each small vertical slice, summarize observable behavior, test results, unresolved trade-offs, and the next proposed test. Ask for a design decision only when competing valid implementations cannot be resolved by the specification.

## Architecture Decision Record (ADR)

When a user prompt approves a design decision, use the [MADR](https://adr.github.io/madr/) template to document it.   
Store under `../docs/adr/` with a `YYYY-MM-DD-<title>.md` filename.
