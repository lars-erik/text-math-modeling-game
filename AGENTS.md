# Project working agreement for Codex, Copilot, Mistral and other agents

Read `readme.md`, `docs/architecture-contract.md`, and the relevant document under `docs/` before editing product code. Approved ADRs and the architecture contract are authoritative when older milestone prose or existing code disagrees.

## Architecture preflight

Before changing `Problem`, generation, DSL, skins/scenarios, puzzle modes/tasks, `PuzzleScreen`, or application composition, follow `.agents/skills/architecture-guardian/SKILL.md`. Codex may auto-select the skill; other agents must follow the same checklist explicitly.

Classify every architecture-affecting change as one or more of these axes:

- **Problem** — canonical mathematics, concepts, generic quantity roles/IDs, givens and relations.
- **Skin** — theme/story, contextual labels, learner-facing names, units and localized presentation.
- **Mode** — the representation edge or learning task, its interaction and checking policy.
- **Composition/UI** — combines the independent axes into a learner-facing screen.

Hard boundaries:

- `Problem` is theme-free, locale-free and mode-free. Mathematical generation does not accept a skin/scenario selection.
- A Skin may read a `Problem`; it may not mutate it, clone it into a themed `Problem`, or manufacture mode-specific task definitions.
- A Mode may read canonical mathematical structure; it may not import or select a concrete Skin.
- Only composition/application code may select both a Skin and a Mode.
- Skin and Mode are orthogonal. Every supported Skin must be composable with every supported Mode unless an explicit ADR narrows the product contract.
- Renaming or wrapping a coupled type is not architectural separation. Separation is complete only when the axes vary independently and cross-product tests prove it.

When introducing the second implementation on an axis (second skin, second mode, second mathematical family), refactor duplicated branching into the axis abstraction before merge rather than copying the first implementation.

## Source work

For files under `src/`, also follow `src/AGENTS.md` for the TDD rhythm, source layout, approvals and test commands.

## Architecture decisions

When a user prompt approves an architectural decision, record it under `docs/adr/` using the existing MADR-style format. If the decision supersedes an older ADR, mark the older ADR accordingly rather than leaving two accepted decisions in conflict.

## Stop and report

If implementation requires a Skin to know a Mode, a Mode to know a concrete Skin, a Skin to rewrite `Problem`, or mathematical generation to require presentation choices, stop production work and surface the conflict before continuing.
