---
name: architecture-reset-planning
description: Investigate the current text-math-modeling-game repository and plan its architecture reset, domain crystallization, deletion, test cleanup, documentation, roadmap, and future agent skills. Use for the current architecture-reset planning work, not feature implementation or execution of the refactor.
---

# Architecture reset planning

## Mission

Produce an evidence-based, executable plan that makes this repository simpler, understandable, maintainable, and safe to extend.

This skill governs the CURRENT planning task only. It is not a request to implement the plan or create the future skills described by it.

Do not change production code, tests, architecture contracts, or agent skills unless the user explicitly authorizes that change. Update the reset-plan document only when requested.

## 1. Establish the baseline

Read `AGENTS.md` first.

Then inspect:
- the current PR, branch, working-tree status, and latest commit;
- `docs/architecture-reset-plan.md`;
- `docs/architecture-contract.md`;
- only the ADRs, research examples, source files, and tests relevant to the current investigation.

Check whether instructions and documents are current, historical, empirical, or contradictory.

Do not read the entire repository or documentation tree by default.

## 2. Investigate with focused subagents

Divide investigations by question, not by arbitrary directory.

Useful investigation scopes include:
- mathematical expression model, outer DSL, and authored/generated paths;
- research examples, semantic meaning, and constraints;
- architecture dependencies, duplication, and deletion opportunities;
- tests, obsolete behavior, and documentation/roadmap inconsistencies.

Give each subagent a narrow scope, concrete questions, and an explicit stopping condition.

Require findings to identify exact files, types, callers, tests, or research examples.

Do not ask multiple agents to independently rediscover the whole architecture.

Classify findings as:
- OBSERVED FACT
- EMPIRICAL PATTERN
- HYPOTHESIS
- PROPOSED DESIGN

Reconcile conflicting findings before recommending changes.

## 3. Reconstruct the actual execution paths

Trace representative exercises from input to UI.

Inspect both:
- serialized authored DSL -> parser -> typed problem;
- generator -> typed problem.

Determine where these paths converge and whether they share validation.

Continue through Theme, Mode, composition, and UI. Inspect session/persistence only where relevant.

Identify duplicate representations, repeated classification, broad switches, unnecessary adapters, and changes that propagate through unrelated layers.

Do not assume passing tests or existing documentation prove architectural correctness.

## 4. Challenge the domain model empirically

Use `docs/research` as evidence, not as an authoritative specification.

Compare materially different examples: grouping, comparison, geometry, percentages, and growth where available.

Do not derive a universal model from `total = base + count * perItem`.

Preserve the intended authoring experience:
- one serialized problem DSL, normally one text file;
- generic mathematical Expression/Relation datatypes nested inside the outer DSL;
- no requirement for separate user-facing languages, files, parsers, or imports.

Distinguish:
- mathematical constraints: domains, values, dimensions, relations, solution obligations;
- semantic assertions: what quantities and relationships mean;
- presentation compatibility: what a Theme/template can faithfully express.

Expression shape and mathematical constraints cannot infer real-world meaning by themselves.

A valid problem does not become invalid merely because a Theme cannot present it.

Distinguish machine-checkable invariants from the human review needed to establish that authored prose is truthful.

Do not invent a universal ontology, solver, unit system, or natural-language engine.

## 5. Plan simplification before replacement

Build a concrete DELETE / MERGE / KEEP inventory.

For each proposed deletion or consolidation, identify:
- the code and its callers;
- the behavior it currently provides;
- existing tests;
- evidence that the behavior is obsolete, duplicated, or misplaced;
- how retained behavior remains protected.

Question abstractions supported by only one concrete use.

A second implementation is evidence for abstraction, not an automatic instruction to extract one. Identify the shared invariant first.

Prefer removing unnecessary paths over creating frameworks to reconcile them.

## 6. Produce an executable reset plan

The plan must explain:
- the current architecture and its actual data flow;
- the proposed minimum domain boundaries and unresolved hypotheses;
- the canonical authored/generated representation and validation lifecycle;
- the deletion and test-consolidation sequence;
- documentation source-of-truth changes;
- a revised Phase 2 roadmap;
- future Agent Skills worth considering, with their purposes and triggers ONLY.

Do not create or scaffold those future skills.

Break refactoring into small, dependent PRs. Each PR should specify scope, expected deletions, preserved behavior, tests, risks, and completion criteria.

Include two distinct human checkpoints:
1. A domain/contract decision after the research and initial safe cleanup.
2. A manual code/architecture review after canonical-path and mathematical-constraint cleanup, before new semantic implementations.

At the second checkpoint, the repository should have one canonical representation per major concept, no known competing main-path representations, consolidated tests, truthful documentation, and an execution path a human can trace directly.

## 7. Report concisely and stop

Lead with:
1. Findings that materially change the plan.
2. Decisions requiring human judgment.
3. The next safe PR and the next review checkpoint.

Keep detailed file evidence in the plan rather than repeating it in a long handover.

Distinguish confirmed conclusions from unresolved questions.

Do not start implementation, create additional skills, or expand the investigation without a concrete reason.

STOP after delivering the requested plan or plan revision.