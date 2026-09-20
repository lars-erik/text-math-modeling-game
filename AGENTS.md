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

## Source work

For files under `src/`, also follow `src/AGENTS.md` for the TDD rhythm, source layout, approvals and test commands.

## Architecture decisions

When a user prompt approves an architectural decision, record it under `docs/adr/` using the existing MADR-style format. If the decision supersedes an older ADR, mark the older ADR accordingly rather than leaving two accepted decisions in conflict.

## Stop and report

If implementation requires a Theme to know a Mode, a Mode to know a concrete Theme, a Theme to rewrite `Problem`, or mathematical generation to require presentation choices, stop production work and surface the conflict before continuing.
