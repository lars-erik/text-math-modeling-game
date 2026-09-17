# Working agreement for Codex, Copilot and other agents.

Read `../readme.md` and the relevant `../docs/` document before editing. Treat the Phase 1 plan as the implementation scope and the future roadmap as context.

## Working rhythm

1. Select one acceptance criterion from `../docs/07-phase-1-plan.md`.
2. Add the smallest failing example, property, or approval test expressing observable behavior.
3. Implement the smallest production change that makes it pass.
4. Run the relevant tests and refactor with the tests green.
5. Report the changed files, test command/results, accepted approval artifacts, and the next smallest step.

Prefer affirmative requirements and acceptance criteria over prohibition lists. Propose a narrowly scoped change when an existing design decision conflicts with a discovered technical constraint.

## System boundaries

- Keep semantic types, validation, generation, and checking framework-independent.
- Generate a domain AST, then serialize it into DSL; parse user input back into the same domain AST.
- Keep problem facts and hidden answers authoritative; story templates and academic notation are views.
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
