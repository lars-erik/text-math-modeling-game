# Project working agreement for Codex, Copilot, Mistral and other agents

Read `readme.md`, `docs/architecture-contract.md`, and the relevant document under `docs/` before editing product code. Approved ADRs and the architecture contract are authoritative when older milestone prose or existing code disagrees.

## Issue and pull-request workflow

For every issue or implementation task, make the work visible on GitHub before doing substantial local implementation:

1. Create a dedicated branch from the current target branch.
2. Push an initial start commit immediately (an empty commit is fine when supported).
3. Open a **draft/WIP pull request** against the target branch before substantial implementation begins. Link the issue in the PR body when there is one.
4. Work in small, coherent checkpoints. Commit and push each meaningful checkpoint as it is completed; do not accumulate a large stack of local-only commits before the first push.
5. Keep pushing the same branch throughout the task so PR CI and the `/pr-N/` preview continuously reflect the latest deployable progress.
6. Prefer checkpoints that leave CI green and the preview usable. When an intermediate push must be broken, make that state explicit and restore a deployable checkpoint promptly.
7. Mark the PR ready for review only when the issue is complete, required tests/approvals pass, and the implementation is ready to merge.

The draft PR is the shared progress surface for humans and other agents. Do not wait until the implementation is nearly finished to create it.

## Architecture preflight

Before changing `Problem`, generation, DSL, themes/scenarios, puzzle modes/tasks, `PuzzleScreen`, or application composition, follow `.agents/skills/architecture-guardian/SKILL.md`. Codex may auto-select the skill; other agents must follow the same checklist explicitly.

Classify every architecture-affecting change as one or more of these axes:

- **Problem** — canonical mathematics, concepts, generic quantity roles/IDs, givens and relations.
- **Theme** — theme/story, contextual labels, learner-facing names, units and localized presentation.
- **Mode** — the representation edge or learning task, its interaction and checking policy.
- **Composition/UI** — combines the independent axes into a learner-facing screen.

Hard boundaries:

- `Problem` is theme-free, locale-free and mode-free. Mathematical generation does not accept a theme/scenario selection.
- A Theme may read a `Problem`; it may not mutate it, clone it into a themed `Problem`, or manufacture mode-specific task definitions.
- A Mode may read canonical mathematical structure; it may not import or select a concrete Theme.
- Only composition/application code may select both a Theme and a Mode.
- Theme and Mode are orthogonal. Every supported Theme must be composable with every supported Mode unless an explicit ADR narrows the product contract.
- Renaming or wrapping a coupled type is not architectural separation. Separation is complete only when the axes vary independently and cross-product tests prove it.

When introducing the second implementation on an axis (second theme, second mode, second mathematical family), refactor duplicated branching into the axis abstraction before merge rather than copying the first implementation.

## Repository investigation and evidence

Before proposing or implementing work: 

1. Establish the current branch and working-tree state. 
2. Inspect existing source code before proposing new functionality. 
3. Use GitHub CLI (gh) through the terminal to inspect relevant issues and pull requests. 
4. Distinguish implemented functionality on the current branch from changes in open PRs. 
5. Treat historical milestone documents as historical context. Verify current behavior against source code and authoritative architecture documentation. 
6. Support findings with exact file paths and relevant code references. 
7. Verify that a proposed task is not already implemented or tracked by an existing issue. 

If a required command fails, report the exact error and explain what could not be verified. 

During Plan mode, use read-only terminal commands for investigation. Keep the working tree unchanged.

## Investigation and task proposals

Before proposing new work:

1. Inspect the current branch, relevant source files, and existing tests.
2. Use GitHub CLI (gh) to verify relevant issue and PR status.
3. Distinguish current implementation, open PRs, and future roadmap ideas.
4. Identify a concrete missing behavior, failing test, or demonstrated maintenance problem.
5. Provide evidence for each proposed task, including exact file paths and relevant references.

A roadmap idea is not evidence of missing functionality.  
An absent abstraction is not necessarily a design problem.

If no concrete improvement is found, report that conclusion instead of inventing work.

If a tool appears unavailable, attempt to use it and report the actual error before concluding that access is missing.

## Source work

For files under `src/`, also follow `src/AGENTS.md` for the TDD rhythm, source layout, approvals and test commands.

## Browser-test environment

Follow [`docs/browser-testing.md`](docs/browser-testing.md) for Windows, macOS, Linux, and CI setup. After `npm ci` in `src/`, use `npm run browser:install` to install the pinned Chromium in Playwright's shared user cache. On Linux hosts with package-install privileges use `npm run browser:install:ci` to install both Chromium and required system libraries. Run `npm run browser:doctor` to diagnose startup failures without changing the machine. Do not repeatedly attempt arbitrary system package installations or disable tests to hide a missing browser; when system privileges are unavailable, report the error and consult the CI browser-test result.

## Architecture decisions

When a user prompt approves an architectural decision, record it under `docs/adr/` using the existing MADR-style format. If the decision supersedes an older ADR, mark the older ADR accordingly rather than leaving two accepted decisions in conflict.

## Stop and report

If implementation requires a Theme to know a Mode, a Mode to know a concrete Theme, a Theme to rewrite `Problem`, or mathematical generation to require presentation choices, stop production work and surface the conflict before continuing.
