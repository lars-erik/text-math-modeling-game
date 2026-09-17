# Phase 1 execution plan — small test-driven steps

**Goal:** validate the mathematical/representation engine with one generated schema, two coherent story themes, deterministic printers, a real graybox UI, and reverse-direction puzzles. Each milestone ends with observable working behavior and a test report. Start with a thin vertical slice; grow language and generator capabilities only when needed.

## Milestone 0 — Compatibility and tooling spike

**First red test:** an approval of a fixed text string has no baseline and produces a reviewable `.received.txt`; after explicit human approval it passes and a changed string produces a useful diff.

- Scaffold TypeScript + Vite + Lit + Vitest + fast-check and Ohm/JS/KaTeX dependencies as needed.
- Integrate `approvals` through one test helper; validate current package/ESM/Vitest compatibility rather than relying on an assumed API.
- Configure `.gitignore` for received files and stable LF for approved files.
- Add one Lit component and a Vitest browser-mode/Playwright test proving mount, keyboard input, submit, and observable feedback.
- Record exact commands and runtime version in the repository README; keep the stack decision in `09-technology-decisions.md` up to date.

**Acceptance:** baseline approval round-trip and browser interaction both run locally and in a repeatable script; production UI remains minimal.

## Milestone 1 — One hand-built semantic case

**First red test:** `total = base + count * unitValue` evaluates as true with `{base:30,count:4,unitValue:45,total:210}` and false with a mismatched total.

- Introduce literal, quantity reference, add, multiply, equation AST nodes.
- Implement evaluation from full bindings, reference resolution, and a private answer key.
- Create the four quantity roles, visibility state and descriptive IDs.
- Add precise tests for operator tree, missing reference, unknown visibility, numeric ranges, and a deliberate wrong binding.
- Implement a stable AST printer and approve the fixture's printed tree.

**Acceptance:** domain operations work with no browser; one fixture demonstrates a meaningful semantic relationship and testable print.

## Milestone 2 — First use-case and transcript

**First red approval:** `startPuzzle(fixedCase)` returns a screen model; a real `printScreen` output shows representation kind, quantities, prompt and seed.

- Define a small start/submit command surface and plain data `ScreenModel`.
- Accept a temporary typed/structured named answer via the use-case to prove success and one failure path.
- Approve a transcript printed from real use-case results; add a precise assertion for acceptance/rejection.
- Route that screen model into one basic Lit element with labelled controls.

**Acceptance:** a developer can view and test one complete, fixed quantities -> named-equation interaction in the browser and through an approved use-case transcript.

## Milestone 3 — Parse learner expressions

**First red tests:** `totalPower = basePower + droneCount * dronePower` parses and evaluates; `(a+b)*c` and `a+b*c` have different ASTs; an undefined name produces a typed error.

- Add a minimal Ohm learner grammar for identifiers, integers, `+`, `*`, `=`, parentheses.
- Convert the grammar result into the canonical domain AST and resolve quantity IDs.
- Compare normalized structure only to the extent shown by tests (e.g. commutative addition/multiplication); reject `count*(unit+base)` and provide targeted feedback.
- Wire typed input through the use-case and approve correct, structural-error and parse-error transcripts.

**Acceptance:** no raw string equality determines mathematical correctness; accepted/rejected input has deterministic diagnostics.

## Milestone 4 — Minimal complete DSL

**First red test:** parse one complete `problem drone-power { ... }` fixture into the same domain case.

- Add DSL metadata/quantity/equation grammar on top of the tested expression subset.
- Build deterministic `serializeProblem(problem)` and canonical ordering.
- Add AST -> DSL -> AST and DSL -> AST -> canonical DSL tests; approve canonical fixture plus debug dump.
- Keep test fixtures alongside their reviewed approvals.

**Acceptance:** manually authored and generated problems can eventually share an identical domain API; the hand-built reference case round-trips today.

## Milestone 5 — Procedural generator for one family

**First red property:** every generated `base + count * unitValue` case has an integer hidden value that satisfies the equation and one unknown.

- Inject a stable, seeded RNG and bounded positive integers.
- Generate base/count/unit first, derive total, hide unit; retain a private answer key.
- Validate values, references, dimensions, requested concepts and solution.
- Add fast-check properties for invariants, deterministic replay, and generated DSL round-trips.
- Approve at least one seeded case's DSL and debug printer output.

**Acceptance:** the browser can receive a fresh valid problem from a seed. A failed generated test provides reproducible replay information.

## Milestone 6 — First deterministic story

**First red approval:** rendering the reference problem with `gaming.drone-power` yields a readable story and corresponding fact ledger.

- Bind mathematical roles to power/drone quantities, units and labels.
- Implement a small template with correct singular/plural and unknown question.
- Show Story -> Quantities in the existing screen using constrained chips or selections.
- Approve story + ledger and one use-case transcript; assert that the facts preserve the AST and correct hidden role.

**Acceptance:** the same generated case appears as coherent prose and a quantity-model puzzle; a learner can complete the transformation.

## Milestone 7 — Second scenario and compositional request

**First red test:** applying the creator/followers scenario to the same generated values preserves the normalized mathematical shape and answer key.

- Add a role map and template with coherent follower/post units.
- Expose requested concept list and scenario choice as generation inputs.
- Compose the initial capability/constraint declarations rather than implementing concept-specific question strings.
- Approve story outputs for both domains and property-test math invariance under a scenario change.

**Acceptance:** one schema yields reproducible distinct stories; interest choice changes context rather than correctness.

## Milestone 8 — Substitution and academic display

**First red test/approval:** a known-value substitution prints `210 = 30 + 4 * dronePower`; a LaTeX visitor produces correct precedence and symbol compression for `210 = 30 + 4p`.

- Implement substitution of visible values only and a per-puzzle academic symbol map.
- Render output with KaTeX.
- Extend the small input parser's name resolution to support the explicit academic symbol map using textual `4*p` input.
- Add named -> notation and notation -> named puzzles; test both use-case transitions and approve their traces.

**Acceptance:** a player can traverse the representation graph in both directions using generated problems.

## Milestone 9 — Structured misconception feedback

**First red use-case approval:** submitting `droneCount * (basePower + dronePower)` yields a semantic explanation that base power is applied once per drone.

- Add the minimal diagnostic classifier and associated explanation.
- Preserve the player's input after failure; show the meaningful consequence.
- Assert the expression is rejected under the intended structure policy even if an accidental numeric assignment happens to coincide.

**Acceptance:** at least one wrong expression generates specific, helpful and testable feedback.

## Milestone 10 — Short graybox session

**First red approval:** a fixed-seed session prints 5–10 actual generated source/target transformations, submissions, feedback and per-edge completion.

- Sequence the implemented puzzle kinds with deterministic replay.
- Implement `next()` and the first meaningful `hint()` when test cases define their behavior.
- Show per-transition counts on completion, without treating them as a diagnosis or overall math ability score.
- Add targeted browser interaction tests for navigation and accessible feedback; approve a selected stable semantic-DOM fragment after render completion.
- Run unit, property, approval, browser and build checks as the final acceptance gate.

**Acceptance:** a complete browser session runs without manually maintaining a fixed question sequence; all representations derive from validated problems.

## Definition of done for every milestone

- The behavior started with a red test and finishes green.
- New or changed `.approved.*` files were intentionally reviewed.
- Precise mathematical assertions accompany relevant approvals.
- A replay identifier or stable fixture reproduces the behavior.
- Production code remains aligned with the specified boundaries.
- The report identifies completed behavior, executed checks, and the next smallest milestone.

## Phase 1 release gate

A seeded, validated problem can be generated as an AST, printed as canonical DSL/debug data, rendered in two deterministic contexts, transformed through story/quantity/named/academic nodes in more than one direction, submitted and checked semantically, and completed in a short accessible graybox session. Relevant mathematical properties and human-reviewed use-case outputs pass CI.
