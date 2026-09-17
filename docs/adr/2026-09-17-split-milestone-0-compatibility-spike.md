# Split Milestone 0 into independently verified compatibility slices

## Status

Accepted

## Context and problem statement

Milestone 0 combines two unrelated integration risks: the CommonJS-oriented `approvals` package running under ESM/Vitest, and Lit browser tests running through Vitest's Playwright provider. Testing both at once would make failures harder to attribute and would cross the project's one-small-milestone working agreement.

The fixed-string approval required by Milestone 0 is a tooling probe. It is not a substitute for the production-printer approvals required by later domain and use-case milestones.

## Decision drivers

- Each slice must have one observable failure and one independently repeatable success condition.
- Human review must remain the only operation that promotes received output to an approved baseline.
- Package-specific approval behavior must remain behind a local adapter.
- The compatibility spike must not introduce product or mathematical behavior.

## Considered options

1. Implement the approval and browser integrations together as one change.
2. Prove the approval integration first, then prove the browser integration in a separate slice.

## Decision outcome

Use option 2. Milestone 0a proves the approval round-trip using Node, TypeScript, Vitest, and `approvals`. Milestone 0b will separately add Vite, Lit, and the Vitest Playwright browser provider.

An approval failure is useful when it exits nonzero, preserves a deterministic `.received.txt`, reports a readable difference without launching a GUI, and leaves `.approved.txt` unchanged.

## Consequences

- A failure in Milestone 0a is isolated from browser and custom-element behavior.
- The first approved file contains a fixed compatibility string; later approved artifacts must come from production printers invoked on actual domain or use-case output.
- Milestone 0 is complete only after both 0a and 0b satisfy their respective acceptance checks.
