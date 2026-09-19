# TDD, ApprovalTests and printers

## Core working method

Every small behavior starts from a failing test. Implement the smallest solution, run the relevant suite, and refactor. Use three complementary forms of evidence:

| Test type | What it proves | Example |
| --- | --- | --- |
| Exact assertions | Mathematical/domain invariants and critical decisions | `evaluateRelation(problem, key) === true`. |
| fast-check properties | Large families of generator, parser and serializer behavior, with reproducible counterexamples | `AST -> DSL -> AST` is semantically invariant. |
| ApprovalTests | Human-reviewed, meaningful whole-output representations | A puzzle transcript, AST tree, generated story/fact ledger, debugger output, or selected HTML subtree. |

Approval tests exercise **production printers invoked on actual use-case output**. They are not handwritten expected text masquerading as integration tests. An approved result is a reviewed characterization, not proof that every numeric property is correct.

## Architecture evidence

Architecture boundaries need executable evidence in addition to import rules and prose. For changes touching Problem, Skin, Mode or composition, add the smallest relevant checks from this set:

1. **Canonical identity:** generate one Problem, project every Skin and build every Mode, then assert the original Problem remains deeply equal to its pre-composition value.
2. **Cross-product composition:** exercise every supported Skin × Mode × locale combination (and input providers where applicable) over one canonical Problem.
3. **Semantic reuse:** assert the same canonical relation/DSL and private AnswerKey are reused across those combinations; do not settle for equal arithmetic results or normalized-shape equality.
4. **Dependency boundaries:** statically verify that generation/DSL do not import Skins or Modes, Skins do not import Modes, Modes do not import concrete Skins, and generic UI does not import concrete Skin implementations.
5. **Answer privacy:** verify no hidden AnswerKey binding appears in browser registry or PuzzleScreen output.
6. **Order independence:** where composition APIs allow Skin and Mode preparation in either order, assert equivalent composed semantics.

When the second implementation appears on an axis, use it as an abstraction test. A second Skin or Mode should extend a registry/contract and cross-product test rather than copy a branch from the first implementation.

Approval files remain useful for human review of wording and complete use-case output, but they are not architectural evidence by themselves.
## ApprovalTests package integration

Begin with the open-source Node package `approvals`. Prove that the installed version works in the selected Node/Vitest/ESM setup with a tiny spike (one `.approved.txt` file, one intentionally changed output, inspect diff, restore). Isolate its API behind a local helper such as `verifyApproval(name, text)` so the rest of the suite has no package-specific coupling. Pick a noninteractive CI reporter and stable test-specific directory. The official Node project documents `verify`, reporters, generated approved/received files, and TypeScript declarations.

Repository policy:

```
*.approved.*   -> commit and human-review changes
*.received.*   -> ignore
```

Use LF line endings, stable paths, deterministic sort/order, and explicit seeds. Any value intentionally scrubbed from approval output must be irrelevant to the behavior under test; retain seeds, concept IDs and relevant numbers. Accept approved-file changes only after inspecting the diff. CI verifies committed baselines; human review authorizes each changed approval.

## Printers to build in order

### 1. Semantic AST printer

```
Equation
├── Quantity(totalPower)
└── Add
    ├── Quantity(basePower)
    └── Multiply
        ├── Quantity(droneCount)
        └── Quantity(dronePower)
```

This is a readable view of the AST used by the DSL round-trip and checker. Confirm printer output by approval, structure by precise AST assertions.

### 2. Scenario/facts printer

Print story text plus a stable fact ledger: quantity ID, label, given/hidden state, units, hidden answer only in test/debug mode, role map and schema. A story can look plausible yet misstate the mathematics; unit assertions catch that, and the approval makes linguistic changes reviewable.

### 3. Use-case transcript printer

An actual test calls the public `start` use-case, submits learner input, then prints *each returned screen model*. Include source and target representation, command, submitted input, parsed result, check policy, diagnostic and feedback, with stable ordering. Example:

```text
=== Start puzzle ===
seed: 918273
transition: Quantities -> NamedExpression
source:
  basePower = 30 MW
  droneCount = 4 drones
  dronePower = ? MW/drone
  totalPower = 210 MW
prompt: Construct the named equation.

=== Submit ===
input: totalPower = droneCount * (basePower + dronePower)
result: structural-mismatch
feedback: Your model charges basePower for each drone.
```

Expand approval examples to correct submission, parse error, hint, reverse puzzle, and next problem as those behaviors are implemented.

### 4. Debug printer (reference: original specification section 29)

Print seed, generator version/config, concepts, shape, scenario binding, AST, visible quantities, private answer key (test-only), DSL, expected relation, and check diagnostics. Make it an actual function exercised by tests and the developer panel. Approve with stable cases and review whenever schema/diagnostics change.

### 5. Selected semantic HTML printer

Once the UI exists, mount the Lit component in browser tests; await its completed update and relevant child updates. Select the puzzle area's shadow DOM, normalize insignificant whitespace/attributes, and approve the meaningful markup. Keep this approval scoped to semantic structure: prompt, labels, inputs, buttons and feedback. Write separate interaction tests for keyboard entry, submission and updates; raw HTML equality alone cannot show behavior or accessibility.

## Example TDD cases

- The AST for `base + count * unit` evaluates according to multiplication precedence.
- `count * (unit + base)` has a different tree and a targeted diagnostic.
- Generator with fixed seed produces identical case and transcript.
- A generated answer key always satisfies the relation.
- Every Phase 1 generated case has one hidden quantity and integer solution.
- Changing Skin changes story/names/units while retaining the exact canonical Problem/DSL/relation and AnswerKey.
- DSL serialization/parsing round-trips with stable printer output.
- Learner-facing Skin names can change while canonical quantity IDs and relation references remain unchanged.
- User input `count*unit + base` is eligible for normalized-structure matching against `base + count*unit`.
- A fully grounded arithmetic task accepts an equivalent result under `equivalent-value`; a named-modelling task uses its structural/pedagogical policy.

## Property-based test discipline

Use fast-check arbitraries that generate **valid constrained domain inputs** and a smaller set of explicitly invalid inputs. Prefer shrinking to the smallest counterexample and printing both the test runner replay seed/path and our generator seed/configuration. Require CI to run a stable, finite property budget; add a more extensive optional local run as needed.

## Browser test discipline

Use Vitest for pure TS tests. Validate its Playwright browser provider in the initial compatibility spike for component tests that need real DOM/custom-element behavior. Keep a minimal browser suite covering one input and submission. Vitest browser mode supports Playwright; Lit's `updateComplete` waits for the element itself, so wait deliberately for nested asynchronous updates when needed. Make recorded approval strings reproducible across supported development machines and CI.

## First approval acceptance gate

The first green vertical slice includes:

1. A tested semantic AST and solution invariant.
2. An approved AST/debug print for a fixed case.
3. A public use-case producing a screen model and an approved transcript.
4. A failing transcript after a deliberately introduced change, showing a readable diff.
5. A separately passing behavioral assertion, ensuring the approved output has mathematical meaning.
