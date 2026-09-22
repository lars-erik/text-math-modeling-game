# Evidence-based architecture reset plan

**Status:** proposed reset plan for human review. No refactor or new feature work is authorized by this document.

**Repository baseline:** `main` at `ee77126` on 22 September 2026. The working tree was clean before this document was added. GitHub had no open issues or pull requests at the time of inspection. Issue [#45](https://github.com/lars-erik/text-math-modeling-game/issues/45) and PR [#46](https://github.com/lars-erik/text-math-modeling-game/pull/46) are closed and are used here only as negative evidence.

## Evidence language

This plan uses four labels deliberately:

- **OBSERVED FACT** — directly visible in current source, tests, current documents, Git history, Issue #45, or PR #46.
- **EMPIRICAL PATTERN** — repeated across representative examples in `docs/research`; it is evidence, not a specification.
- **HYPOTHESIS** — plausible explanation or domain model that still needs a concrete vertical proof.
- **PROPOSED DESIGN** — a recommended change, not a description of the current repository.

The evidence priority used during synthesis was:

1. representative examples in `docs/research`;
2. current product intent and genuinely current architecture contracts;
3. current production behavior;
4. historical implementation choices and tests.

The supplied ChatGPT conversation URL could not be read. A direct fetch returned a cache miss, and the authenticated browser bridge failed before opening a tab with `url is not supported for stdio | in mcp_servers.context7`. This plan therefore does not attribute any claim to that conversation. Its conclusions are based on the attached brief, current repository, closed Issue #45/PR #46, and the abandoned branch.

## Executive recommendation

Do not implement M13, M14, or another product feature. Cancel M13 as currently specified.

The repository does not need two authored languages. It already has the useful seed of the intended architecture: one outer problem DSL embeds inline mathematical `Expression`/`Relation` values that become the same generic trees used by evaluation and rendering. The reset should preserve that single-file authoring experience while adding explicit constraints that make each problem mathematically valid, semantically interpretable, and compatible with faithful presentation.

The two conceptual type layers remain useful, but the outer layer must distinguish three concerns rather than collapsing them into a family-shaped descriptor:

1. **mathematical constraints** — symbol domains, exact values, dimensions, relation satisfaction, solvability, and uniqueness where a learning task requires it;
2. **semantic constraints** — explicit statements about what quantities and relationships mean in a situation, independent of expression shape;
3. **presentation constraints** — requirements that a Theme/template must satisfy without inventing, omitting required meaning, or changing facts.

Constraints do not infer real-world meaning from an arbitrary expression. Equal groups, rectangle area, percentage-of, and compounded growth can all contain multiplication while requiring different semantic and presentation contracts.

The immediate work should be deletion and truthfulness:

1. freeze/archive stale milestone instructions and correct the automatic “rule of two”;
2. delete dead compatibility code and unproven generic misconception/guidance scaffolding;
3. consolidate duplicate matrix tests and approvals;
4. build a cross-domain constraint matrix and decide the canonical authored/generated lifecycle;
5. stop for a manual architecture review before changing the domain model;
6. converge authored and generated problems on one canonical representation and validation pipeline;
7. prove semantic and presentation constraints with comparison and rectangle-area verticals before sharing an abstraction.

The evidence is insufficient to define a final universal `Situation`, `SemanticModel`, constraint solver, unit algebra, template language, language generator, or misconception ontology now.

---

## 1. Research-derived domain map

`docs/research` is useful but limited. `docs/research/curriculum-mapping.md:1-5` is explicitly a curriculum research base. `docs/research/dsl-and-theme-catalog.md:1-20` is a target catalog already influenced by the current DSL and four-role architecture. It is not an independent corpus of many fully authored stories. Claims about story templates and semantic distractors must therefore remain modest.

| Recurring structure | Concrete examples | Mathematical structure | Semantic information outside mathematics | Evidence |
| --- | --- | --- | --- | --- |
| Part/whole and take-away | `partA=5`, `partB=?`, `total=8`; `start=10`, `removed=3`, `rest=?` (`docs/research/dsl-and-theme-catalog.md:28-47`) | Equality with addition | Parts form one whole; “removed” is a directional event even when encoded as an addend | **Strong** for part/whole; **medium** for event direction |
| Equal groups and sharing | Four groups of six; 24 shared among six (`docs/research/dsl-and-theme-catalog.md:52-73`; `curriculum-mapping.md:35-36`) | `total = count * perGroup` | Groups are equivalent; count and per-group jointly define repetition; unknown role can vary without changing the relation | **Strong** |
| One fixed contribution plus repeated contribution | `total = base + count * unitValue`; taxi start fee plus price/km; followers plus followers/post (`dsl-and-theme-catalog.md:79-87,328-363`; `curriculum-mapping.md:40`) | Nested add/multiply | One contribution occurs once; another occurs once per equivalent item | **Strong** for this family |
| Fraction/percentage of a whole | One quarter of 28; 25% of 800 (`dsl-and-theme-catalog.md:90-115`; `curriculum-mapping.md:37,39`) | Multiplication by a rational factor | Factor is a proportion; part shares the whole's unit; discount may additionally imply subtraction | **Medium**; exact numeric representation remains unproven |
| Geometric products and relations | Rectangle area; similarity scale; Pythagoras (`dsl-and-theme-catalog.md:118-128,187-212`) | Products, powers, sums | Width/height/area and side relationships are not count/per-item/total roles | **Medium** as counterevidence to universal roles; individual families mostly single-example |
| Additive change/comparison | `big = small + difference`; initial/change/repeated rate (`dsl-and-theme-catalog.md:131-156,279-290`) | Addition and nested arithmetic | Initial value, directional change, and relative difference have different meanings despite similar trees | **Medium** and a good second proof candidate |
| Compounded growth | `end = start * factor^periods`; debt over years (`dsl-and-theme-catalog.md:215-228,250-261`; `curriculum-mapping.md:42,48-49`) | Exponentiation | Successive compounding, dimensionless factor, and time period | **Weak/limited** for outer semantics; sufficient only to justify a future vertical investigation |
| Systems, trig, quadratic patterns | Two-plan system, `tan(angle)`, Pythagoras/quadratic fixtures (`dsl-and-theme-catalog.md:175-247,293-303`) | Multiple relations, calls, powers/division | Relationship semantics vary substantially | **Single-example hypotheses** |

### Strong recurring concepts

- A declared symbol/quantity ledger with stable identity.
- Known versus unknown/question status, independent of expression shape.
- Nested expression trees and equality relations.
- Additive composition and multiplicative grouping/rate.
- Some notion of unit/dimension compatibility, although the current research does not yet justify a complete algebra.
- Family-local relationship meaning such as “equal groups” or “one-time plus repeated.”
- Theme-owned contextual names, units, and wording.

### Weak or limited concepts

- A closed general-purpose dimension system. The catalog often uses `scalar` even when examples imply length, area, time, money, or proportion.
- A universal semantic role enum. Rectangle, Pythagoras, fractions, and growth reuse `count/per-item/total` in ways that are structurally convenient but semantically misleading (`dsl-and-theme-catalog.md:90-128,187-225`).
- A generic template-compatibility system across all families. The theme bank is mostly evidence for variations of the same four-role family, not for all mathematical structures.

### Unsupported or single-example concepts

- A general misconception/distractor taxonomy. The only developed example is `count * (base + unitValue)`. It can describe a coherent different fee-per-item situation; it is not intrinsically a misconception or incoherent story (`docs/01-product-and-learning-loop.md:83-87`; `docs/05-graybox-core-loop.md:105-115`).
- Arbitrary AST-to-story generation.
- A general grammar or template language.
- A complete `System.Math`/`MathF`-like operation catalog.

### Conclusion

**EMPIRICAL PATTERN:** the same mathematical tree does not determine one semantic situation. Equal grouping, area, scaling, and percentage can all contain multiplication while requiring different outer meaning.

**HYPOTHESIS:** the outer DSL needs explicit semantic assertions that reference declared symbols and relations, but different assertions may remain separate until evidence demonstrates a shared invariant.

**PROPOSED DESIGN:** do not start with a universal or family-shaped descriptor. First state the mathematical, semantic, and presentation constraints for comparison, geometry, percentages, and growth; then implement two materially different vertical proofs and share only what they demonstrate.

---

## 2. Single DSL, two type layers, three constraint concerns

The normal authored representation should remain one text file and one authoring workflow. The two type layers are:

- generic mathematical `Expression`/`Relation` values;
- an outer problem definition that declares symbols, constraints, meaning, question intent, and presentation requirements.

Within the outer layer, mathematical, semantic, and presentation constraints are different validation concerns. They may refer to the same symbol and relation identities, but they must not silently substitute for one another.

```text
one authored problem file
└─ outer problem definition
   ├─ symbols and values/givens
   ├─ mathematical constraints
   ├─ explicit semantic assertions
   ├─ presentation requirements
   ├─ question/solution contract
   ├─ optional replay metadata
   └─ Expression / Relation values
```

### Generic mathematical values

Belongs in the generic mathematical layer:

- constants and symbol references;
- only the unary/binary/call operations required by actual examples;
- equality/comparison relation shapes when evidenced;
- evaluation with explicit bindings;
- generic substitution and reference collection;
- structural normalization/comparison parameterized by caller policy;
- canonical and academic/string rendering over the same tree.

Does not belong here:

- `base`, `count`, `per-item`, or `total` as pedagogical roles;
- known/hidden learner status or question intent;
- equal-group, comparison, geometric, percentage, or growth meaning;
- Theme/template compatibility;
- guidance, misconception classes, session, or UI.

The current kernel is already close: `src/features/problem-model/expression.ts:3-13` defines only literal/reference/add/multiply/equality; evaluation at `:40-75` is independent of Theme, Mode, and UI. Add rationals/division, powers, calls, or comparisons only with the concrete example that requires them.

### Mathematical constraints

The outer problem definition must make the mathematical validity obligation explicit without becoming a general constraint solver. Initially relevant categories are:

- symbol value domains such as integer, rational, non-negative, positive, bounded, or integral count;
- exact values/givens and a private complete solution witness where needed;
- non-localized dimensions and unit compatibility;
- relations that a complete binding must satisfy;
- the question target and required solution cardinality, including uniqueness where a Mode requires it;
- exactness or rounding policy for values such as percentages and growth.

The current global “exactly one hidden quantity” rule is a puzzle-policy shortcut, not a sufficient solvability or uniqueness proof.

### Semantic constraints

Semantic assertions state what the symbols and relationships mean in the situation. They may reference symbols and relations but must not duplicate the mathematical AST. They are explicit because constraints and expression shape cannot distinguish, for example:

- equal groups from rectangle area;
- percentage-of from a generic scalar product;
- compounded growth from arbitrary exponentiation;
- comparison difference from an unordered additive decomposition.

Do not commit to a `FamilyDescriptor`, universal role enum, or common semantic base type. A comparison assertion and a rectangle-area assertion may remain separate until two implementations demonstrate a useful invariant.

### Presentation constraints

The authored problem should state semantic presentation requirements, not concrete Theme IDs. Themes/templates advertise what they can faithfully express. Compatibility validation must ensure that a selected template:

- has slots for the required semantic participants and question intent;
- preserves values, units, direction, grouping, and recurrence meaning;
- does not invent facts or reinterpret a relationship;
- does not reveal private solution values;
- rejects unsupported semantics instead of forcing them into available wording.

Theme and Mode remain independent peers within declared supported combinations. The architecture must no longer assume that every story Theme can express geometry, percentages, comparison, and growth.

### Cross-domain challenge examples

| Example | Mathematical constraints | Explicit semantic assertions | Presentation requirements |
| --- | --- | --- | --- |
| Comparison: `big = small + difference` | Comparable dimensions; appropriate domains/order; unique target if required | Larger quantity, reference quantity, and directed difference | Comparative direction and comparable entities must be expressible; generic “three addends” wording is invalid |
| Rectangle: `area = width * height` | Positive measures; length × length → area | Width and height are orthogonal extents; area measures the rectangle's region | Geometry-capable vocabulary or representation; count/per-item templates must be rejected |
| Percentage: `part = factor * whole` | Exact rational factor; dimensionless factor; part/whole dimension agreement | Proportion-of; “discount” is a distinct semantic assertion that may require another relation | Must distinguish “25% of” from “25% discount” and must not invent a remaining price |
| Growth: `end = start * factor^periods` | Positive factor; integral non-negative periods; start/end dimension agreement; exactness/rounding | Repeated compounding over equal periods | Period and compounding vocabulary plus a deliberate factor/rate interpretation |

These examples are architecture tests, not instructions to implement four new product families.

### Current serialization and the convergence requirement

`src/features/problem-dsl/problem-grammar.ts:4-20` contains one outer grammar with an equation field. `src/features/problem-dsl/parse-problem.ts:161-190` delegates inline equation text to the expression parser and returns the same `Relation`. This remains one authored language even when parsing is factored into reusable components.

Authored and generated problems should converge on one typed canonical representation and one validation pipeline, but generators should not serialize and reparse DSL text:

```text
DSL parser ─────┐
                ├─> canonical unvalidated definition/case
generator ──────┘
                      ↓
        shared mathematical validation
                      ↓
          shared semantic validation
                      ↓
   selected-template compatibility validation
                      ↓
 validated public problem + private solution witness
```

No evidence justifies separate DSL files, imports between DSLs, a second user-facing parser, or a general-purpose solver.

---

## 3. Current architecture map

### Actual authored DSL path

```text
problem DSL text
  -> problem-grammar.ts
  -> parse-problem.ts
  -> parse-named-relation.ts
  -> Problem { quantities, relation, guidance?, replay? }
```

**OBSERVED FACT:** this is not the main exercise runtime path. Production consumers primarily generate `Problem` objects directly. The serializer is used by debug output; the parser is chiefly protected by tests and authoring docs. `src/features/problem-model/print-problem-debug.ts:1,25` is the only production-side serialization consumer found in the audit.

The typed `Problem` gives the two paths a partial meeting point, but not yet one acceptance pipeline:

- parsing calls `validateProblemAst` (`parse-problem.ts:204-216`), which checks references, current safe-integer/dimension rules, one hidden quantity, and replay consistency;
- the parser has no private `AnswerKey`, so it cannot prove the intended solution, solvability, or uniqueness (`docs/problem-dsl/reference.md:212-219`);
- generators construct `Problem + AnswerKey` directly and enforce generator-specific ranges/role declarations;
- `validateProblemConstraints` can check relation satisfaction and answer consistency (`problem-validation.ts:132-150,435-511`), but it has no production caller;
- neither path validates explicit semantic meaning or selected-template compatibility because those contracts do not yet exist.

The absence of DSL parsing from the hot runtime path is not itself a defect. The defect is that parsing and generation do not converge at a single validated canonical boundary before Theme, Mode, session, and UI consume the problem.

### Actual single-puzzle runtime path

```text
route/menu
  -> MathModelingPuzzle.generateCase
  -> problemFamilies registry
  -> family generator
  -> Problem + private AnswerKey
  -> Theme.present(problem, locale, storySeed)
  -> Mode.start/submit(problem, ...)
  -> composePuzzle / mergeTask
  -> PuzzleScreen union
  -> math-modeling-puzzle Lit switches
```

Key evidence:

- `Problem` and `AnswerKey`: `src/features/problem-model/problem.ts:30-54`.
- Family registry and generation metadata: `src/features/problem-generation/problem-families.ts:19-110`.
- The two actual relations: `src/features/problem-model/total-from-parts.ts:4-16` and `groups-total.ts:4-12`.
- Theme contract: `src/features/themes/theme.ts:62-70`.
- Mode union/contract: `src/features/puzzle/modes/mode.ts:15-168`.
- Composition: `src/features/puzzle/compose-puzzle.ts:134-181,213-348`.
- UI branching: `src/features/puzzle/ui/math-modeling-puzzle.ts:395-503,872-886`.

### Actual session/persistence path

```text
session route
  -> planSession
  -> GrayboxSession
  -> generateFamilyCase(defaultProblemFamilyId, ...)
  -> compose/submit each Mode
  -> SessionRunStore
  -> SessionSnapshot
  -> profile/history repository
  -> LocalStorage
```

The persistence design deliberately stores replay inputs and learner submissions, not `Problem`, relations, or `AnswerKey` (`docs/11-session-persistence.md`, especially “Snapshot contract” and “Reconstruction”). This is a good boundary.

The session planner is nevertheless tied to the current default family and every registered Mode: `src/features/session/plan-session.ts:1-8,34-45,71-84`; `src/features/session/graybox-session.ts:692-696`. `SessionSnapshot` stores theme/locale/seed but no family (`src/features/session/persistence/session-snapshot.ts:25-38`). The second family therefore works in a standalone puzzle but not through the session path.

### Boundaries that genuinely work today

- Generation does not import Theme or Mode.
- Theme receives a `Problem` and does not return a rewritten one.
- Modes do not import concrete Themes.
- Composition is the first place concrete Theme and Mode outputs meet.
- Named and academic rendering consume the expression tree plus explicit name/symbol maps (`src/features/representations/named-relation.ts:7-66`; `academic-relation.ts:6-93`).
- KaTeX is isolated behind a display adapter (`src/features/puzzle/ui/academic-display-adapter.ts`; `katex-academic-display-adapter.ts`).
- `AnswerKey` is separate from learner-visible state.

### Current mixes and duplicated representations

- `Problem.Quantity` combines identity, a narrow dimension vocabulary, a universal role, and learner visibility (`problem.ts:7-28`). These are not all mathematical concerns.
- `Problem.guidance` and `problem-model/misconception.ts` place pedagogical/family-specific concepts beside generic mathematics (`problem.ts:34-39`; `misconception.ts:3-29`).
- `namedEquationStructurePolicy` lives in the generic normalization module even though acceptance policy belongs to a Mode (`normalized-structure.ts:3-16`).
- `createAcademicSymbolMap(problem)` derives notation from pedagogical roles (`representations/academic-symbol-map.ts:6-45`).
- `ThemeFact` is copied into a parallel `ScreenQuantity` representation (`themes/theme.ts:21-38`; `puzzle/compose-puzzle.ts:31-47,297-312`).
- Mode state, screen-task state, UI branches, persisted submissions, and transcript branches each repeat the Mode classification.
- The two Theme implementations repeat nearly identical role projection and assembly (`themes/gaming-drone-power/theme.ts:12-74`; `themes/creator-followers/theme.ts:12-74`).

---

## 4. Problem inventory ranked by architectural leverage

### 1. No proven semantic-situation boundary

- **Files/evidence:** `docs/10-phase-2-plan.md:176-212`; Issue #45; PR #46; `docs/research/dsl-and-theme-catalog.md` examples.
- **Observed symptom:** M13 required “semantic story candidates” generated from relation structure before a situation representation existed.
- **Confused responsibility:** mathematical tree transformation was treated as semantic alternative generation.
- **Fan-out:** the abandoned branch changed 39 files, +1,182/−236, for one Mode. It touched the domain, Mode unions, composition, UI, locales, session planner version, snapshots, approvals, and browser tests.
- **Why it obscures the domain:** PR #46 called candidates `story-choices`, but `compose-puzzle.ts` labeled them with `formatNamedRelation`; its own handover named actual Theme-rendered situations as the “biggest gap.” The implementation could prove structural relation matching, not matching a coherent story.

### 2. The four-role enum is treated as general domain semantics

- **Files/types:** `QuantityRole` in `problem.ts:7`; `ThemeRoleStructure` in `themes/theme.ts:40-59`; family registry role sets; Theme story plans.
- **Observed symptom:** the same role names are reused for equal groups, percentages, geometry, and growth in research.
- **Confused responsibility:** convenient generator slots, semantic grouping, notation choice, and Theme story selection share one enum.
- **Fan-out:** adding a new semantic family with new roles requires both Themes, symbol-map logic, menu labels, story fragments, validation, generators, and matrix tests to change.
- **Why it obscures the domain:** `count * per-item` is not a valid semantic interpretation of width × height or scale × side merely because the syntax is multiplicative.

### 3. Mode is repeated across too many closed unions and switches

- **Files/types:** `modes/mode.ts:15-168`; `compose-puzzle.ts:57-117,213-269`; `math-modeling-puzzle.ts:395-503,872-886`; `print-screen.ts:18-31`; `puzzle-menu.ts:183-258`; session snapshot/conversion switches.
- **Observed symptom:** a Mode addition changes domain-facing state, screen state, rendering, menu resources, persistence, session planning, transcript output, tests, and approvals.
- **Duplicated responsibility:** each layer separately classifies the same Mode and answer shape.
- **Fan-out evidence:** PR #46 changed all of those areas before the semantic behavior was proven.
- **Why it obscures the domain:** implementation plumbing creates the appearance that a representation edge is a broad domain feature.

### 4. Session scaffolding silently defines product breadth

- **Files/types:** `plan-session.ts`; `graybox-session.ts`; `session-snapshot.ts`; `docs/11-session-persistence.md`.
- **Observed symptom:** sessions always use the default `total-from-parts` family but automatically include every registered Mode.
- **Confused responsibility:** a historical Phase 1 planner decides which domain families and representation edges are universal.
- **Fan-out:** adding a Mode invalidates planner versions and persisted sessions; adding a family does not make it available in sessions.
- **Why it obscures the domain:** session coverage is mistaken for domain support and drives cross-product work before semantic viability.

### 5. Generic mathematics and pedagogical policy share a folder/API

- **Files/types:** `expression.ts`; `normalized-structure.ts`; `misconception.ts`; `problem.ts`; `academic-symbol-map.ts`.
- **Observed symptom:** pure evaluation sits beside one-family misconception classification and role-derived notation.
- **Confused responsibility:** mathematical structure, Mode acceptance policy, and pedagogical interpretation are all called “problem model.”
- **Fan-out:** new math operations appear to require pedagogical changes; new pedagogical interpretations appear canonical.
- **Why it obscures the domain:** file location and type names overstate what is generic.

### 6. Test volume freezes milestone implementation rather than stable behavior

- **Evidence:** about 9,000 test/approval lines versus about 9,800 production lines in `src/features`/`src/testing` at the audited commit.
- **Files:** `compose-puzzle.unit.test.ts`; `family-composition.unit.test.ts`; `hidden-role-composition.unit.test.ts`; session unit/browser suites; numerous transcript approvals.
- **Observed symptom:** the same four modes/two themes/two families/hidden roles are asserted at multiple layers.
- **Duplicated responsibility:** parser/serializer/approval, renderer/parser/mode/transcript/browser, and session/store/persistence/browser each repeat similar evidence.
- **Fan-out:** a union member or planner rotation re-baselines several snapshots even without a new domain fact.
- **Why it obscures the domain:** passing historical matrices make deletion look unsafe while meaningful semantic boundaries remain indirectly tested.

### 7. Documentation gives stale plans operational authority

- **Files:** `readme.md:10-23`; `src/AGENTS.md:16`; `docs/10-phase-2-plan.md:3-5`; `.agents/skills/architecture-guardian/SKILL.md`.
- **Observed symptom:** agents are told to read many documents and select Phase 1 acceptance criteria even during current Phase 2 work.
- **Contradiction:** the architecture guardian says `Skin` while current architecture says `Theme`; both root instructions and the skill automatically demand abstraction at the second implementation.
- **Fan-out:** agents reason against history, stale milestone scope, current contracts, and implicit “rule of two” simultaneously.
- **Why it obscures the domain:** process rewards generalization before evidence and made Issue #45 harder to resolve.

---

## 5. Domain crystallization proposal

### Expression

**KEEP and isolate.** Rename `quantity` references to a neutral symbol/reference term when doing so is cheap, but do not create a second AST. Keep evaluation, substitution, reference collection, parsing, serialization, and rendering over the one tree.

Add operation kinds only alongside a selected example that needs them. A future rational/fraction slice may justify exact numeric values and division; a growth slice may justify power; a trig slice may justify call nodes. No current evidence justifies implementing them all now.

### Relation

**KEEP as a distinct mathematical type.** Equality is currently sufficient. Collections of relations and comparisons remain future evidence-driven additions.

### Quantity/symbol

**SPLIT conceptually, not textually.** The expression layer needs a symbol ID. The outer problem layer declares what that symbol means, whether it is given/asked, and any relevant unit/dimension. The generic AST does not need a `Quantity` object or pedagogical role.

### Problem

**KEEP an outer aggregate, but decide its lifecycle before treating the current `Problem` type as final.** Today one type is shared by generation, DSL, Theme, Mode, and composition. The target must distinguish conceptually between:

- an authored/generated definition or candidate;
- a materialized instance with concrete givens and question intent;
- a validated public problem paired with a private solution witness.

Those may be separate types, validated states of one type, or a smaller arrangement. The required invariant is that Theme, Mode, session, and UI consume only the validated public form.

Do not rename it merely to signal architecture. Rename only if the crystallized behavior makes the current name misleading.

### Semantic situation/problem description

**DO NOT introduce a universal new top-level object or family descriptor yet.** Current Theme story planners derive two fixed-plus-repeated shapes from role sets and `hasBase`. That proves bounded story rendering exists; it does not prove a general `Situation` API.

The outer DSL nevertheless needs a place for explicit semantic assertions. A comparison assertion may bind larger/reference/difference symbols; a rectangle-area assertion may bind width/height/area; a percentage assertion may bind factor/whole/part. These remain distinct until evidence demonstrates a stable shared invariant. They reference the mathematical symbols and relations but do not rebuild the expression tree.

A multiplication subtree cannot identify equal groups, rectangle area, scaling, percentage-of, or growth. Domains and dimensions can reject some invalid cases, but they cannot supply real-world meaning.

### Theme

**KEEP as presentation/context.** Theme may own vocabulary, learner-facing names, localized units, introductory fragments, and bounded templates. Templates must declare the semantic assertions, question forms, dimensions, and presentation slots they support. A Theme/template may reject an incompatible problem; it must not define mathematical correctness, clone a `Problem`, import a concrete Mode, or force unsupported semantics into available wording.

### Mode

**KEEP as learning task/representation-edge policy, but reduce closed-world plumbing.** Mode may own answer shape, structural acceptance policy, and mathematical distractors appropriate to that task. It must not claim a relation transform is a coherent alternative situation unless an outer semantic representation provides that meaning.

### Semantic classifications

- Do not put universal `base/count/per-item/total` tags on every quantity.
- Prefer explicit, narrowly scoped semantic assertions referencing participants where a template/checker actually needs them.
- Do not annotate arbitrary expression subtrees with story meaning.
- A whole-situation discriminator alone is insufficient because templates/checkers need participant bindings.
- Do not make generator `ProblemFamilyId` the source of semantic meaning.
- Share a semantic carrier only after two materially different assertions demonstrate what it must preserve.

### Units/dimensions

- Keep contextual display-unit wording in Theme, while mathematical dimensions and canonical unit identity belong to the outer symbol declarations.
- Comparison requires compatible dimensions; rectangle area requires length × length → area; percentage factors are dimensionless; growth start/end share a dimension while the factor is dimensionless and periods are integral/time-based.
- Do not build conversion or full dimensional algebra until concrete examples and validation rules require it.
- Initially forbid unsupported conversions rather than inventing a general conversion system.
- Treat the current closed `Dimension` vocabulary (`problem.ts:11-15`) as provisional.

### Misconceptions and guidance

`problem-model/misconception.ts` recognizes exactly one tree pattern and `Problem.guidance` carries opaque IDs with quantity references. This is insufficient evidence for generic mathematical-domain ownership.

Do not delete or generalize this contract until PR 3 maps which mathematical, semantic, or presentation obligation it currently protects. If the learner behavior remains important, relocate it later as narrowly scoped semantic/pedagogical data backed by a research-derived example. Do not let M14 preserve the current shape by default.

---

## 6. Story/template findings

### Evidence supporting bounded templates

- The catalog maps the fixed-plus-repeated structure into many vocabularies, such as taxi fees, follower growth, power, time, and emissions (`dsl-and-theme-catalog.md:320-376`).
- Current Theme planners select a small number of sentence fragments by role/`hasBase`, rather than rendering arbitrary ASTs (`themes/gaming-drone-power/story-plan.ts:29-110`; `creator-followers/story-plan.ts:35-135`).
- The two current families can use different total-question wording without changing the mathematical relation.
- Multiple wordings can preserve one semantic situation.

### Evidence limiting the hypothesis

- The theme bank primarily covers one four-role structure.
- Some mappings are semantically or dimensionally suspect, for example “bar weight + sets × kg per set.”
- Geometry, comparison, fraction, and compounded-growth examples need different semantic relationships.
- No independent corpus demonstrates a general template-compatibility vocabulary or robust distractor taxonomy.

### Recommended bounded mechanism

**HYPOTHESIS:** for a proven set of semantic assertions and presentation requirements, a Theme can provide:

- vocabulary/participant mappings;
- introductory/context fragments;
- a small set of compatible description templates;
- localized question fragments;
- deterministic choice among compatible templates.

The outer problem supplies semantic facts, presentation requirements, and mathematical relation values. Theme templates advertise their compatible assertions/slots and consume only those facts and references; they do not infer semantics from arbitrary AST shape. Compatibility is a validation result, not a requirement that every Theme support every problem.

### What it must not attempt

- arbitrary expression-tree-to-natural-language rendering;
- a grammar engine or template programming language;
- rendering every mathematically valid expression as a coherent story;
- deciding whether an alternative mathematical model is a meaningful situation;
- reading `AnswerKey` to fill a hidden value;
- embedding Mode behavior or candidate-order policy;
- encoding linguistic complexity merely to avoid a future LLM.

### M13 negative case

Issue #45 required a typed semantic candidate representation and Theme rendering but simultaneously required candidate semantics to be generated from relation structure. PR #46 implemented `StoryCandidateSeed { id, optionPosition, relation }`, structural AST transforms, and structure-based checking. Composition rendered candidate labels as named equations, not stories. This was internally consistent mathematical code but did not answer the semantic question. The branch is therefore evidence that the domain question must precede Mode/session/UI integration.

---

## 7. DELETE / MERGE / KEEP plan

### DELETE

| Target | Rationale |
| --- | --- |
| `src/features/compatibility-spike/compatibility-input.ts` and `compatibility-input.browser.test.ts` | Isolated stack-validation spike; no production consumer. |
| Active authority of `docs/10-phase-2-plan.md` M13+ and stale progress prose | M13 is closed/cancelled; the document still says M10 is in PR #30 and specifies the failed direction. Move to archive with a status banner. |
| Stale Phase 1 operational instructions in `src/AGENTS.md:16` | Every source edit should not select an acceptance criterion from a historical Phase 1 plan. |
| Automatic abstraction rule in root `AGENTS.md:39`, architecture guardian step 7, and `docs/06-testing-and-approvals.md` | Replace with the evidence-based shared-invariant rule. |
| Generic ownership claim for `Problem.guidance` and `problem-model/misconception.ts` | One family-specific pattern is not generic mathematics. First classify the protected behavior in PR 3; then delete, relocate, or retain it deliberately rather than removing evidence before the replacement boundary is decided. |
| Duplicate DSL approval (`problem-dsl.approval.test.ts` and approved text) if parser AST equality plus round-trip remain | Same fixture is protected by parser, serializer, and approval tests. Keep one human-readable authoring fixture only if explicitly valuable. |
| Academic transcript approvals (`academic-notation.approval.test.ts` and its three approved text files) | Renderer, parser, Mode, adapter, and browser coverage already protect the behavior. |
| Debug-printer approvals duplicated by precise unit tests | Debug output should have at most one intentional support artifact. |
| Exact historical matrix counts and milestone-named tests | They freeze 2×2×4×locales/hidden roles rather than declared capabilities. |
| Role-position inference helpers duplicated in the two session browser suites | Test-only reconstruction of the four-role architecture; replace with authored test fixtures. |
| Pre-alpha compatibility assertions such as “legacy route defaults to total-from-parts” when not part of current product intent | Compatibility is explicitly not a constraint for this reset. |

The abandoned M13 branch is already absent from `main`; do not port any of its candidate/story code.

### MERGE / CONSOLIDATE

| Targets | Result |
| --- | --- |
| `features/named-expression/*` with generic expression syntax responsibility | Keep resolver injection, but stop presenting the parser as a separate semantic “named expression” model. It is the reusable parser for inline DSL relations and learner-facing aliases. |
| Repeated AST visitors in `serialize-problem.ts`, `named-relation.ts`, and `academic-relation.ts` | Share traversal/precedence only after the formatting invariant is explicit; keep style/symbol policies at the boundary. |
| `substituteVisibleValues(problem)` | Generic `substitute(relation, bindings)` in math; `getVisibleBindings(problem)` remains outer policy. |
| `ThemeFact` and `ScreenQuantity` | One canonical public presentation-fact shape or a narrow view without copying every field. |
| Three composition matrix suites | One compact supported-composition boundary suite plus one focused test per retained representation edge. |
| Session core/store/persistence/browser coverage | Keep snapshot integrity, repository resilience, and one resume journey; remove repeated mode/role-specific transcript paths. |
| Repeated Theme projection boilerplate | At most one small helper after the shared invariant is demonstrated; do not introduce a Theme framework. |

### KEEP

- `expression.ts` evaluation/reference collection, after rehoming as a mathematical kernel.
- Generic normalization/comparison functions with caller-supplied policy.
- One outer `Problem` and one serialized DSL.
- `Problem`/`AnswerKey` privacy split.
- Family registry as a small dispatch seam, while treating its role metadata as provisional.
- AST-based named/academic renderers and KaTeX adapter isolation.
- Theme/Mode dependency boundaries that currently work.
- Persistence repository ports and error containment; freeze rather than expand them during domain work.
- Named-equation multiple-choice only as a Mode-local mathematical-answer provider, if retained product behavior requires it. Do **not** reuse its structural distractors as semantic story alternatives.

---

## 8. Target architecture

### Dependency direction

```text
generic math
  Expression / Relation / values
  parser / serializer / evaluator / substitution / structural comparison
          ^
          |
outer problem definition
  symbol declarations and mathematical constraints
  explicit semantic assertions
  presentation requirements
  question / solution contract
  relation values from generic math
          ^                         ^
          |                         |
      authored DSL              generator
          \                         /
           canonical unvalidated case
                       |
     shared mathematical + semantic validation
                       |
       validated public problem + private solution witness

validated public problem --> Theme/template compatibility + presentation
validated public problem --> Mode behavior
Theme presentation + Mode result --> composition --> public screen --> UI

session/application orchestrates stable IDs/replay and public learner inputs;
it does not redefine constraints, semantics, Theme, Mode, or mathematics.
```

The DSL and generators converge on the typed canonical boundary, not on text. Serialization is an authoring/replay representation, never a required runtime intermediate for generated problems.

### Adding a mathematical operator/function

Should change:

- expression datatype;
- nested expression parser/serializer;
- evaluator where evaluation is meaningful;
- generic formatter/renderers;
- normalization/structural behavior explicitly chosen for that operator;
- focused mathematical tests.

Should not change:

- Theme vocabulary/templates;
- Mode IDs or UI state merely because the operator exists;
- session/persistence;
- pedagogical roles or misconception types.

### Adding a semantic problem kind/assertion

Should change:

- research/example fixture and domain hypothesis;
- explicit semantic assertions and their focused consistency validator;
- mathematical constraints required by the example;
- presentation requirements independent of concrete Theme IDs;
- generator/authored fixture;
- only Themes/templates declared compatible;
- capability declarations and one vertical test.

Should not change:

- generic math unless the family truly needs a new operation;
- unrelated Themes;
- every Mode/session/browser test;
- universal role enums merely to fit the new family.

### Adding a Theme

Should change:

- one Theme's vocabulary, units, fragments/templates, and registry entry;
- compatibility declarations with proven semantic assertions and presentation requirements;
- focused Theme tests and one selected composition test.

Should not change:

- expression/relation semantics;
- generators;
- Mode implementations;
- session snapshot schema.

### Adding a Mode

Should change:

- the Mode behavior/checker and answer contract;
- its focused presentation component/view;
- a registry/capability entry;
- focused unit/composition/browser evidence.

Target property: Mode-owned input serialization or a stable generic learner-input envelope prevents the session layer from adding a new manual conversion switch for every Mode.

Should not change:

- concrete Themes;
- problem generation;
- unrelated UI branches/resources;
- planner versions until the Mode is deliberately added to a session plan.

### Adding a story/description template

Should change:

- one Theme's bounded template set and locale resources;
- compatibility with proven semantic assertions, question intent, dimensions, and required slots;
- focused rendering tests.

Should not change:

- mathematical AST/parser/evaluator;
- Mode correctness;
- Problem identity;
- session/persistence.

---

## 9. Test reset plan

### Delete

- Compatibility-spike test.
- Misconception/guidance tests and approvals tied only to `base-applied-per-item` when that generic production path is removed.
- `problem-dsl.approval.test.ts`/snapshot if the one authoring example is retained elsewhere.
- Academic transcript approvals duplicating unit and browser behavior.
- Duplicate debug/generator approvals where deterministic property/replay tests remain.
- Exact matrix-count assertions and historical milestone-named tests.
- Broad session browser completion helpers that infer semantic roles from DOM order.
- Menu normalization and pre-alpha route-compatibility tests that protect no current product decision.

### Consolidate

- `compose-puzzle.unit.test.ts`, `family-composition.unit.test.ts`, and `hidden-role-composition.unit.test.ts` into one declared-supported-composition boundary suite.
- Session unit/store/browser suites around three contracts: deterministic reconstruction, genuine acceptance/progression, and repository failure resilience.
- Parser/serializer coverage into direct generic expression precedence/nesting tests plus one outer DSL embedding/round-trip fixture.

### Retain/rewrite

- `expression.unit.test.ts` and `normalized-structure.unit.test.ts`, rewritten with neutral symbols rather than four-role fixtures.
- Parser diagnostic tests.
- One property/deterministic example per retained family.
- Import/dependency checks from the useful first portion of `src/testing/architecture-boundaries.test.ts`.
- Explicit `AnswerKey` privacy/public-state shape tests.
- LocalStorage corruption/schema/write-failure tests.
- One representative puzzle browser journey and one session-resume browser journey.
- At most one wide and one narrow screenshot after the UI contract stabilizes.

### Add

- Direct test that generic math imports no outer semantic, Theme, Mode, session, or UI package.
- Contract tests proving parsed and generated cases pass through the same canonical validation entry point without generated cases being serialized/reparsed.
- Validation tests separating mathematical failure, semantic inconsistency, and unsupported presentation.
- Authored-case tests using a private solution witness to prove relation satisfaction and the required solution-cardinality contract without exposing the witness publicly.
- Direct Theme non-mutation/Problem identity test, independent of the full matrix.
- Direct public-screen shape test proving no `AnswerKey` or hidden binding is reachable; avoid substring-only JSON checks.
- Constraint fixtures for comparison, rectangle area, percentage-of/discount, and compounded growth even before all become production families.
- One research-derived semantic fixture per proven assertion kind, checking explicit facts versus inferred relationships.
- Template compatibility tests only for declared semantic-requirement/Theme-template pairs.
- A test that structural mathematical alternatives are not accepted as story candidates without an authored semantic interpretation.

The target suite should make large deletions safe by protecting contracts, not by preserving every historical presentation transcript.

---

## 10. Documentation reset

### Classification

| Classification | Documents |
| --- | --- |
| **CURRENT / NORMATIVE** | Root `AGENTS.md`; scoped parts of `src/AGENTS.md`; `docs/architecture-contract.md`; accepted relevant ADRs; `docs/problem-dsl/index.md` and `reference.md`; `docs/browser-testing.md`; `docs/11-session-persistence.md` for persistence work |
| **EMPIRICAL INPUT** | `docs/research/curriculum-mapping.md`; `docs/research/dsl-and-theme-catalog.md` after an explicit non-normative banner |
| **HISTORICAL** | `docs/initial conversations/general spec 001.md`; `docs/07-phase-1-plan.md`; `docs/milestone-8-architecture.md`; initial technology decision record; older/superseded ADR context |
| **STALE** | `docs/10-phase-2-plan.md` status and M13+ plan; Phase 1 active-progress prose; browser-cache instructions in `docs/09-technology-decisions.md` that conflict with current browser docs |
| **CONTRADICTORY** | `Skin` in architecture guardian versus `Theme`; automatic second-implementation extraction rule; Phase 1 acceptance-criterion mandate during current work; global cross-product rule versus capability-based support |

### Proposed authoritative hierarchy

1. `AGENTS.md` — work process and links only; no duplicated architecture specification.
2. `docs/architecture-contract.md` — short current architecture map and dependency rules.
3. New concise references:
   - `docs/current/math-expression-model.md`;
   - `docs/current/problem-domain.md` (outer semantic/problem layer, explicitly provisional where necessary);
   - `docs/problem-dsl/index.md` and `reference.md` for the single serialized language.
4. Accepted, applicable ADRs for deliberate decisions and exceptions.
5. Source plus focused tests for implemented behavior; active issue/PR for current work scope.
6. `docs/research/` with an explicit empirical-input README.
7. `docs/archive/` for phase plans, milestone notes, initial conversations, and superseded material.
8. One rewritten current roadmap, with stage gates rather than an assumed M13–M20 sequence.

### Reading-path correction

The README currently asks readers to traverse eleven documents. Replace that with role-based routes:

- orient: current architecture map + repository state;
- author a problem: DSL guide/reference + math/outer-domain references;
- investigate a semantic family: relevant research examples + domain-analysis skill;
- implement: one active issue/ADR + exact source/test path;
- maintain tests: test guidance + nearest tests only.

### Architecture-guardian correction

Rename `Skin` to `Theme`. Replace the automatic rule in root instructions, the skill, and testing docs with exactly:

> The second implementation is evidence for abstraction, not an automatic instruction to extract one. Demonstrate the shared invariant before sharing the implementation.

Require the review to name both concrete examples, the stable invariant, and the actual variation point. If that cannot be done, keep implementations local.

---

## 11. Agent skills plan

Each skill should have a short `SKILL.md` (roughly 40–60 lines), a narrow trigger, an explicit default read list, an explicit “do not read by default” list, and at most one or two progressive-disclosure references. Skills should link to the architecture contract rather than duplicate it.

### `repository-orientation`

- **Trigger:** new investigation, plan, or implementation task.
- **Read:** root `AGENTS.md`, README current-state section, current architecture map, `git status`/recent log, active issue/PR, exact relevant source/test files.
- **Do not read by default:** phase history, all research, all ADRs.
- **Output/actions:** branch/worktree state; current behavior versus open work; execution path; exact evidence files; report if no concrete gap exists.
- **Structure:** `SKILL.md`; optional `references/orientation-checklist.md`.

### `research-example-domain-analysis`

- **Trigger:** proposing/changing semantic families, roles, story matching, misconception semantics, or Theme templates.
- **Read:** relevant `docs/research` examples, learning-loop intent, current DSL samples, only the relevant domain/Theme code.
- **Do not read by default:** milestone plans or production types as the source of ontology.
- **Output/actions:** example matrix; explicit versus inferred facts; model-preserving wording variants; coherent alternative models; rejected non-situations; evidence-strength labels; human decisions.
- **Structure:** `SKILL.md`; `references/example-matrix.md` template.

### `focused-implementation`

- **Trigger:** an approved, bounded code change after investigation.
- **Read:** orientation output, contract, one relevant accepted ADR, scoped source/tests, `src/AGENTS.md`; browser doc only when needed.
- **Do not read by default:** every ADR, roadmap, and research file.
- **Output/actions:** owning axis and invariant; smallest red test; minimal green/refactor checkpoints; test and approval results; branch/draft PR workflow.
- **Structure:** `SKILL.md`; optional `references/checkpoint-report.md`.

### `simplification-deletion-audit`

- **Trigger:** reset, refactor, cleanup, or fan-out concern.
- **Read:** exact execution path, import/caller graph, tests, current contract; historical material only to prove obsolescence.
- **Do not read by default:** broad future roadmap.
- **Output/actions:** DELETE/MERGE/KEEP table, callers, behavior/risk, tests to remove/rewrite; deletion before replacement.
- **Structure:** `SKILL.md`; `references/inventory-template.md`.

### `architecture-boundary-review`

- **Trigger:** changes to math, Problem/generation/DSL, Theme, Mode, or composition; post-change architecture review.
- **Read:** architecture contract, one relevant accepted ADR, selected dependency edges/tests.
- **Do not read by default:** all history; do not infer abstraction from implementation count.
- **Output/actions:** axis classification, dependency violations, exact identity/privacy/capability tests, shared-invariant evidence, stop conditions.
- **Structure:** revised current guardian `SKILL.md`; concise `references/review-checklist.md`.

### `test-maintenance-approval-discipline`

- **Trigger:** adding/removing/changing unit, property, approval, browser, or screenshot tests.
- **Read:** scoped test guidance, nearest tests, browser setup only if relevant, changed approved artifacts.
- **Do not read by default:** product roadmap or unrelated research.
- **Output/actions:** behavior classification, duplication/obsolescence review, smallest useful test mix, exact commands, explicit received/approved artifact review.
- **Structure:** `SKILL.md`; `references/approval-review.md`.

---

## 12. Revised Phase 2 plan

Use stage gates rather than a feature conveyor belt.

### Stage A — reset and empirical evidence

- Correct documentation authority and archive stale phase plans.
- Delete obsolete code/tests and consolidate the baseline.
- Build a compact corpus of fully authored examples with explicit versus inferred facts.
- Output: evidence map and unresolved human decisions, not production types.

### Stage B — domain hypothesis

- State the single-DSL/two-type-layer boundary and the three constraint concerns.
- Build constraint records for comparison, rectangle area, percentage-of/discount, growth, and one current equal-groups problem.
- Decide the authored/generated definition-instance-validation lifecycle and private solution-witness policy.
- Explicitly list counterexamples and unproven concepts; do not define universal domain types.
- Human accepts/rejects the validation obligations before implementation.

### Stage C — canonical convergence

- Make DSL parsing and generation produce the same canonical typed form.
- Run both through shared mathematical and semantic validation before Theme/Mode consumption.
- Keep the private solution witness outside learner-visible state.
- Do not serialize/reparse generated cases.

### Stage D — first semantic/presentation proof

- Use comparison (`big = small + difference`) because it exercises existing addition/equality while challenging the current roles.
- Prove explicit semantics, mathematical validity, compatible/incompatible templates, and fact preservation.
- Do not add a Mode, session integration, or generic template system.

### Stage E — second materially different proof

- Use rectangle area because it shares multiplication syntax with equal groups and percentages while requiring different semantics and dimensions.
- Keep percentage and growth as mandatory architectural counterexamples/fixtures without shipping them as product families.
- Treat the second implementation as evidence, not an extraction instruction.

### Stage F — conditional abstraction

- Name any invariant shared by comparison and geometry.
- Either retain two explicit validators/adapters or introduce the smallest shared carrier for semantic assertions and presentation requirements.
- Update DSL serialization and Theme/template compatibility only to the demonstrated extent.
- Keep M13, session work, full locale coverage, and new UI outside this reset sequence.

### Disposition of current milestones

- **M13:** cancel as specified. Preserve the product question as Stage C–F research/proof work. Remove “generate distractor semantics from canonical relation structure” as a requirement.
- **M14:** merge into a later semantic/pedagogical proof only when a concrete learner error requires guidance. Do not add generic DSL guidance syntax now.
- **M15:** postpone. Mixed-family sessions package proven capabilities; they do not discover them.
- **M16:** reuse its comparison evidence for the first semantic/presentation proof, not as a broad product-family milestone.
- **M17:** keep percentage/fraction cases as mathematical-domain and presentation counterexamples until exact rational/rounding decisions exist.
- **M18:** defer visual product work; rectangle-area presentation in the reset is an architecture proof, not a commitment to a visual Mode.
- **M19:** rewrite as an evidence-triggered persistence/history extension. M10.6 already provides active/completed local persistence.
- **M20:** defer and redefine after the new semantic boundary and a real fifth edge are proven.

Do not require the full Problems × Themes × Modes × locales product until a concept has survived first proof, second proof, and capability declaration.

---

## 13. Human decisions required

Only the following are genuine product/domain decisions; implementation details should be settled by code evidence.

1. **What does the authored DSL serialize?** Decide whether it describes a definition, a concrete instance, or supports both, and where materialization occurs.
2. **How does an authored problem provide solution evidence?** A private authored witness plus validation may be sufficient initially; a general solver is not required.
3. **What is the question/solution contract?** Decide whether known/hidden is authored identity or presentation state, which symbol/relation is targeted, and when zero/one/multiple solutions are allowed.
4. **Which exact numeric domains are initially supported?** Current safe integers cannot faithfully cover percentages or growth; rational values and rounding policy need deliberate scope.
5. **What is the canonical dimension/unit boundary?** Decide which non-localized dimensions and unit identities are mathematical, which wording is Theme-owned, and whether unsupported conversions are simply rejected.
6. **What must presentation preserve?** Decide which facts/relationships are mandatory in text, which may be omitted, and what counts as inventing or changing a fact.
7. **What exactly is the matching-situation learning task?** Decide whether alternatives are different coherent situations with different models, different wordings of the same situation/model, or separate tasks. Issue #45 and PR #46 blurred these meanings.
8. **What structural equivalence should each learner task accept?** Exact tree, commutative reordering, associative regrouping, or algebraic equivalence are pedagogical choices. Current `namedEquationStructurePolicy` accepts commutativity and swapped equality sides but not general algebraic equivalence (`normalized-structure.ts:3-71`).
9. **Is the current one-example misconception feedback required during the reset?** If retained, classify it as narrowly scoped semantic/pedagogical behavior rather than generic mathematics.
10. **How much bounded authored language variation is needed before a future LLM?** Decide the minimum useful template coverage; do not ask implementation to build a general language system.

Naming (`Situation` versus `ProblemDescription`), file layout, registry mechanics, and test framework choices are not human domain decisions unless implementation evidence exposes a real trade-off.

---

## 14. Recommended 8-PR reset sequence

No PR below is authorized until this plan is reviewed.

### PR 1 — Documentation truth and architecture decision ledger

- **Purpose:** make the repository tell the truth and expose unresolved decisions before code changes.
- **Affected areas:** `AGENTS.md`, `src/AGENTS.md`, architecture guardian, README reading order, architecture contract status, Phase 2 status, research/archive banners.
- **Expected deletions:** duplicated rules; automatic second-implementation extraction language; stale Phase 1 mandate; active M13 requirements.
- **Additions:** the three constraint concerns; authored/generated convergence gap; provisional status for current roles, dimensions, one-hidden rule, and universal cross-product language.
- **Tests:** link/reference check only if available.
- **Risk:** low; do not accidentally approve final types.
- **Dependencies:** none.
- **Simpler afterward:** agents can distinguish current facts, open decisions, empirical input, and historical plans.

### PR 2 — Safe deletion and test-baseline reduction

- **Purpose:** remove indisputably dead or duplicate material without deleting evidence needed to design the new boundary.
- **Affected areas:** compatibility spike; duplicate DSL/academic/debug/generator approvals; exact matrix counts; role-position browser helpers; stale compatibility tests.
- **Expected deletions:** compatibility component/test, redundant approvals/helpers, and historical assertions with no current product contract.
- **Deferred:** guidance/misconception, role, dimension, and validation behavior remain until PR 3 classifies the obligation each protects.
- **Tests:** retain parser/validation baselines, supported composition, session snapshot integrity, and minimal browser confidence.
- **Risk:** low-medium; caller-audit each deletion.
- **Dependencies:** PR 1.
- **Simpler afterward:** a smaller suite still records current mathematical and product behavior.

### PR 3 — Cross-domain constraint corpus and canonical-lifecycle proposal

- **Purpose:** make the target validation obligations falsifiable before changing production types.
- **Affected areas:** `docs/research`, current architecture references, and a small non-production fixture/decision format.
- **Examples:** one current equal-groups case plus comparison, rectangle area, percentage-of versus discount, and compounded growth.
- **For each example:** record value domains, dimensions/units, relations, solution-cardinality requirement, private witness need, explicit semantics, presentation requirements, compatible/incompatible templates, and rounding/exactness.
- **Expected deletions:** unsupported catalog-as-spec claims and universal-role language.
- **Tests:** optional schema validation for machine-readable fixtures; no production feature tests.
- **Risk:** low technical risk and high architectural leverage.
- **Dependencies:** PR 2.
- **Simpler afterward:** the human review can decide contracts from examples rather than proposed type names.

### MANUAL REVIEW STOP — after PR 3

Stop all domain-model, semantic DSL, and new Mode work here.

Humans must decide:

- what the DSL serializes: definition, instance, or both;
- the definition → materialization → validated-case lifecycle;
- authored private solution-witness policy;
- question target and required solution cardinality;
- initial exact numeric domains and rounding rules;
- mathematical dimension/canonical-unit versus Theme display-unit ownership;
- semantic-assertion ownership;
- presentation fidelity and compatibility rules;
- whether unsupported Theme/template combinations replace the current universal cross-product requirement.

The codebase should already be smaller and the documentation truthful, but no large outer semantic DSL should exist yet.

### PR 4 — Canonical representation and shared acceptance pipeline

- **Purpose:** make authored and generated cases converge on one typed canonical form and validator entry point.
- **Affected areas:** DSL parser boundary, family generators, `Problem` lifecycle, validation APIs, public/private result contract.
- **Expected deletions:** parallel acceptance assumptions and direct consumption of unvalidated generated problems.
- **Tests:** parsed/generated cases run the same validators; generated cases are not serialized/reparsed; validated public state cannot reach the private solution witness.
- **Risk:** medium-high because it touches the central domain boundary.
- **Dependencies:** approved manual-review decisions.
- **Simpler afterward:** Theme, Mode, session, and UI consume one validated public contract.

### PR 5 — Mathematical constraint boundary

- **Purpose:** implement only the approved minimum for domains, exact values, dimensions, relation satisfaction, and solution obligations.
- **Affected areas:** numeric values/domains, symbol declarations, dimension validation, question/solution contract, private witness validation.
- **Expected deletions:** global `single-hidden-quantity` or role-derived checks only where replaced by explicit scoped constraints.
- **Tests:** current families plus PR 3 contract fixtures; comparison/geometry/percentage/growth need not become product features.
- **Risk:** high if it drifts toward a general solver or unit system; reject that expansion.
- **Dependencies:** PR 4.
- **Simpler afterward:** mathematical validity is explicit and independent of story semantics.

### PR 6 — First semantic/presentation vertical: comparison

- **Purpose:** prove explicit meaning and template compatibility without relying on fixed-plus-repeated roles.
- **Affected areas:** one comparison assertion/validator, one bounded Theme/template path, one locale, non-UI fixtures.
- **Expected deletions:** none required; do not force comparison into existing roles.
- **Tests:** mathematical validity, larger/reference/difference bindings, compatible and incompatible templates, fact preservation, no private-value exposure.
- **Risk:** medium; avoid creating a universal assertion hierarchy.
- **Dependencies:** PR 5.
- **Simpler afterward:** one demonstrated boundary exists between expression shape, situation meaning, and presentation support.

### PR 7 — Second semantic/presentation vertical: rectangle area

- **Purpose:** challenge the boundary with multiplication that does not mean grouping/rate.
- **Affected areas:** one rectangle-area assertion/validator, geometric dimensions, one compatible presentation path; percentage and growth remain counterexample fixtures.
- **Expected deletions:** role/count-per-item assumptions exposed as unnecessary by this proof, but no automatic abstraction extraction.
- **Tests:** positive measures, length × length → area, semantic participant bindings, rejection by incompatible story templates, comparison proof unchanged.
- **Risk:** medium-high because it may falsify PR 6 assumptions; that is useful evidence.
- **Dependencies:** PR 6.
- **Simpler afterward:** shared infrastructure and genuinely distinct semantics are visible separately.

### PR 8 — Conditional semantic/presentation contract

- **Purpose:** share only the invariant demonstrated by comparison and geometry.
- **Affected areas:** outer DSL serialization, semantic-validation interface, presentation-requirement carrier, Theme/template capability checks, only if justified.
- **Expected deletions:** duplicated mechanics genuinely shared by PRs 6–7; retain separate assertion types/validators where meaning differs.
- **Tests:** both verticals, DSL round-trip, generic math isolation, explicit unsupported-presentation results, percentage/growth counterexample fixtures.
- **Risk:** high; cancel this PR if no useful shared invariant exists.
- **Dependencies:** second manual review after PR 7 and an accepted ADR for any durable contract.
- **Simpler afterward:** either one minimal proven carrier or two honest local paths. M13, session integration, full locale coverage, and new UI remain deferred.

## 15. Final manual-review stop point

The mandatory stop is **after PR 3 and before PR 4 production work**. At that point the repository should be small and truthful, the five-example constraint corpus should expose the real obligations, and the canonical authored/generated lifecycle should be a reviewable proposal rather than an accidental implementation fact.

There is a second decision checkpoint after PR 7: approve PR 8 only if comparison and rectangle area demonstrate useful shared infrastructure without collapsing their semantic differences. Percentage and growth must still fit the boundaries as explicit counterexamples. Otherwise cancel PR 8 and keep the vertical representations local.

STOP — do not implement any proposed PR until this plan has been reviewed.
