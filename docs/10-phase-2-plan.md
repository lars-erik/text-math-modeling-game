# Phase 2 execution plan — prove breadth after the first playable loop

**Status:** working plan, 20 September 2026.

Phase 1 ends with Milestone 10: one complete deterministic graybox session over the first mathematical family and the first four representation edges. Milestone 10 is being completed in PR #30.

Phase 2 should not simply add more surface features. Its purpose is to prove that the architecture generalizes across:

- more than one mathematical problem family;
- more than one hidden/unknown role;
- more representation edges and eventually non-text representations;
- family-independent guidance and diagnostics;
- sessions that mix real mathematical variety;
- lightweight learner history without turning activity into an unsupported mastery score.

Milestone 10.5 is a bridge between the phases. It gives the application an explicit controller/router/menu boundary before Phase 2 creates more destinations and practice flows.

This document is intentionally more concrete for M10.5–M13 than for M14–M20. Later milestones are a working order and may be split or reordered when earlier implementation exposes a better boundary.

---

## Progress overview

```mermaid
flowchart LR
    subgraph P1["Phase 1 — first complete loop"]
        M8["M8 Academic notation"]
        M9["M9 Misconception feedback"]
        M10["M10 Short deterministic session"]
    end

    subgraph Bridge["Bridge"]
        M105["M10.5 App controller / routing / menu"]
    end

    subgraph P2A["Phase 2 — prove mathematical breadth"]
        M11["M11 Second problem family"]
        M12["M12 Variable unknown roles"]
        M13["M13 Named model -> matching story"]
        M14["M14 Generic guidance & diagnostics"]
        M15["M15 Mixed-family session planner"]
    end

    subgraph P2B["Phase 2 — broaden math & representation"]
        M16["M16 Additive change / comparison"]
        M17["M17 Rational factors / percent"]
        M18["M18 First visual representation"]
        M19["M19 Local practice history"]
        M20["M20 Phase 2 playable practice gate"]
    end

    M8 --> M9 --> M10 --> M105 --> M11 --> M12 --> M13 --> M14 --> M15 --> M16 --> M17 --> M18 --> M19 --> M20
```

---

# Bridge milestone

## Milestone 10.5 — Application controller, routing and navigation shell

Tracked in GitHub issue #31.

**First red test:** parse and format explicit `home | puzzle | session` application routes from the hash and its internal query string; only the canonical hash format is supported.

Extract the role that is beginning to accumulate in `application.ts`:

- explicit `AppRoute` / application state;
- pure route <-> URL parsing/formatting;
- one application controller that owns top-level transitions;
- narrow browser History API adapter;
- semantic navigation requests from UI;
- real Home/Menu destination;
- Back/Forward restoration;
- explicit rejection of invalid route arguments.

Home must be a real route, not an alias for "load seed 17".

Keep the implementation framework-independent and small. No routing library or DI framework is expected for three top-level states.

**Acceptance:** Home, direct puzzle and session are independently replayable destinations; UI requests navigation semantically; the controller owns transitions/history; Back/Forward works; Problem, Theme, Mode and session semantics remain unchanged.

---

# Phase 2 — mathematical and representation breadth

## Milestone 11 — Second mathematical problem family

**Goal:** prove that the canonical domain, generator, DSL, Themes, Modes and composition are not accidentally specialized to `total = base + count * unitValue`.

Start with the smallest second family that needs **no grammar extension**:

```text
total = count * unitValue
```

Suggested family ID:

```text
groups-total
```

Example canonical DSL shape:

```text
problem groups-total {
    concepts { arithmetic.multiplication algebra.variable }
    quantity count: item role count = 4
    quantity unitValue: scalar role per-item = 6
    quantity total: scalar role total = ?
    equation { total = count * unitValue }
    replay { seed 103 generator groups-total-v1 }
}
```

**Why this is first:** we already used the rule of two for Theme and Mode. We have not yet used it for mathematical family. The second family is the next major architecture test.

**First red property:** every generated `groups-total` problem satisfies the multiplication relation, validates, round-trips through canonical DSL, and composes with every supported Theme/Mode that declares support.

### Required work

- introduce an explicit problem-family/generator registry or equivalent boundary proven by two implementations;
- keep family selection mathematical and Theme-free;
- remove assumptions that every Problem contains `base`;
- make supported representations/Modes explicit where a family genuinely cannot support one;
- update Theme projection contracts so role requirements are declared rather than inferred from the first family;
- preserve private `AnswerKey`;
- add fixed-seed approval output for both families;
- add architecture/property tests over the family cross-product.

Do **not** solve this by padding `groups-total` with a fake `base = 0`. The point is to prove distinct mathematical structure.

**Acceptance:** one application can generate/replay at least two genuinely different canonical families; the second family does not require Theme-specific generation or copied Mode implementations; existing Phase 1 behavior remains unchanged.

---

## Milestone 12 — Vary the unknown role

**Goal:** stop treating `unitValue` as the implicit hidden quantity.

For families where the relation allows it, generate valid variants with different unknown roles.

For `total = base + count * unitValue`, useful cases include:

- `unitValue = ?`;
- `base = ?`;
- `total = ?`;
- `count = ?` where the generated values keep the intended arithmetic clean.

For `total = count * unitValue`, useful cases include:

- `unitValue = ?`;
- `count = ?`;
- `total = ?`.

**First red property:** for every supported family × hidden-role combination, generation produces exactly one intended unknown, a valid private solution and a deterministic replay.

### Required work

- make hidden-role choice an explicit mathematical generation input/policy;
- keep Theme projection independent of which role is hidden;
- update Modes that currently assume a specific unknown;
- ensure academic symbol/substitution adapters work from visibility rather than role-specific branching;
- add property coverage for solvable integer cases;
- expose replay/debug metadata sufficient to reproduce the hidden-role selection.

**Acceptance:** changing the unknown role changes the puzzle while preserving the same family semantics; no Theme or generic UI branch is keyed to a concrete hidden quantity ID.

---

## Milestone 13 — Named model -> matching story

**Goal:** implement the fifth representation edge already described in the product vision.

```text
Named model -> matching story
```

The learner receives a named/canonical model and chooses the situation that matches it from a small deterministic set.

Distractors should be **structural**, not random prose. For example:

```text
base + count * unitValue
```

may be contrasted with a situation corresponding to:

```text
count * (base + unitValue)
```

The edge must work across more than one mathematical family introduced by M11.

**First red approval:** one fixed Problem produces a deterministic correct story plus meaningful structural distractors; selecting the correct story resolves to the same canonical relationship.

### Required work

- introduce a Mode for named-model -> story matching;
- generate distractor semantics from canonical relation structure;
- render each candidate through Theme/story presentation rather than hard-coded prose in the Mode;
- keep candidate order deterministic from replay state;
- preserve Problem identity across candidates;
- add EN/NB browser and approval coverage;
- define support explicitly per family rather than silently generating invalid distractors.

**Acceptance:** the representation graph gains its first story-target edge; correct/distractor options are semantically traceable; at least two families exercise the same Mode infrastructure.

---

## Milestone 14 — Generic guidance and diagnostics

**Goal:** turn the first M9/M10 feedback and hint slices into family-owned semantic guidance that can support multiple families without putting prose or family logic in Session/UI.

M10 establishes the desired direction: DSL/problem metadata may carry stable semantic "things to watch out for", while Modes select relevant entries and presentation localizes them.

Possible conceptual shape:

```text
guidance {
  watch base-applied-once { ... }
  watch grouping-factor { ... }
}
```

Exact syntax must emerge from tests.

**First red test:** parse/serialize one family-specific guidance entry, select it through a Mode after a known learner error, and render equivalent EN/NB feedback without changing canonical math.

### Required work

- define stable guidance/diagnostic IDs and typed payload data;
- round-trip guidance through DSL/debug printing where it is truly part of authored mathematical/pedagogical metadata;
- keep learner-facing wording in locale/presentation resources;
- let Modes select relevant guidance for their representation edge;
- ensure Session only records/reveals a selected guidance reference;
- migrate the existing base-applied-per-item diagnostic/hint to the generic mechanism;
- add at least one guidance entry for the second family.

**Acceptance:** guidance is neither Session-specific nor hard-coded to total-from-parts; the same semantic metadata can drive hint/feedback presentation in both locales.

---

## Milestone 15 — Mixed-family deterministic session planner

**Goal:** make a session vary mathematics as well as representation edge.

The current M10 planner chooses a deterministic sequence of Modes and per-item problem seeds. Extend the planning contract so an item can select:

- problem family;
- mathematical seed;
- hidden role/variant;
- Mode;
- any stable planner version needed for replay.

Example conceptual item:

```ts
{
  index,
  familyId,
  problemSeed,
  hiddenRole,
  modeId
}
```

**First red approval:** a fixed session seed produces a deterministic transcript containing both supported families, more than one hidden role and multiple representation edges.

### Required work

- select families through a registry/capability contract;
- only choose family × Mode combinations declared supported;
- keep the planner deterministic and versioned;
- provide broad-but-small coverage rather than adaptive difficulty;
- make direct item replay possible from recorded item metadata;
- keep session summary descriptive: completed items/edges/families, not inferred ability.

**Acceptance:** a short run contains genuine mathematical variety without manually authored question sequences; every item independently replays through canonical generation/composition.

---

# Phase 2 — broader mathematics

## Milestone 16 — Additive change and comparison

**Goal:** introduce the first broader mathematical structures beyond the initial multiplication/addition families.

Prefer structures that expand curriculum coverage while keeping the domain extension controlled.

Candidates:

```text
big = small + difference
end = start + change
```

This can initially represent comparison/subtractive reasoning using the existing equality/addition AST before deciding whether explicit learner-facing `-` syntax is required.

A later slice in the same milestone may add a subtraction AST/operator if tests show the representation requires it.

**First red test:** a comparison problem with one hidden difference generates, validates, serializes and can be solved through at least one existing representation edge.

### Required work

- add one or two small additive-change/comparison families;
- introduce explicit subtraction syntax only when needed by an actual representation/use case;
- add family-specific diagnostics;
- add suitable Theme projections without coupling Theme to family implementation;
- extend property generators and equivalence/checking carefully.

**Acceptance:** the domain no longer only models "fixed + repeated unit" structures; the new family runs through the same generation/composition/replay architecture.

---

## Milestone 17 — Rational factors, fractions and percent

**Goal:** support multiplicative scalars beyond positive integers.

Target families include:

```text
part = fraction * whole
part = percentFactor * whole
```

This milestone should establish a deliberate numeric representation rather than smuggling fractions through floating-point literals.

**First red property:** a generated rational factor round-trips exactly through AST/DSL, evaluates deterministically and preserves exact checking for representative fraction/percent cases.

### Required work

- choose an exact rational/value representation;
- extend parser/DSL/serializer and printers;
- generate clean fraction/percent problems;
- update formatted academic notation;
- add percent/fraction Theme language/resources;
- keep numeric exactness and normalization deterministic.

**Acceptance:** fraction-of and percent-of problems can be generated/replayed without floating-point equality hacks; existing integer problems remain unchanged.

---

# Phase 2 — representation breadth

## Milestone 18 — First visual representation

**Goal:** prove that a representation node is not synonymous with a text string.

Choose one small visual representation with strong semantic value. Good candidates are:

- bar model;
- table;
- simple quantity diagram.

A bar model is a strong first choice for grouping/additive structures because it can expose the same roles visually without needing a full graphing system.

**First red approval:** a canonical Problem produces a deterministic representation model/data structure whose semantic IDs correspond exactly to the Problem, then a renderer displays it without owning mathematical truth.

### Required work

- define a semantic visual-representation model separate from DOM/SVG rendering;
- add one or two Mode edges involving the visual node;
- make the renderer replaceable and test the representation model without pixels;
- preserve shared quantity identities;
- add selected screenshot/DOM approvals only where useful;
- verify narrow/mobile accessibility and non-visual labels.

**Acceptance:** at least one puzzle traverses a non-text representation edge using the same canonical Problem and checking architecture.

---

# Phase 2 — practice product

## Milestone 19 — Local practice history

**Goal:** retain useful learner activity locally without requiring accounts/backend or claiming a mastery model.

Store descriptive observations such as:

- completed session replay IDs/timestamps;
- family;
- representation edge/Mode;
- accepted/rejected latest submission state where appropriate;
- hint/guidance usage if useful;
- completion counts.

Use local storage/indexed storage behind a small repository interface.

Do not collapse this into a single "ability", "level" or mastery percentage.

**First red test:** a completed session emits a stable activity record which can be persisted through an in-memory adapter and restored without changing the canonical session/problem replay.

### Required work

- define a versioned persistence contract;
- separate stored activity from active Problem/AnswerKey state;
- add local browser adapter plus in-memory tests;
- handle schema/version reset/migration deliberately;
- expose a small history/progress view from the Home/Menu shell;
- allow clearing local history.

**Acceptance:** a returning learner can see previous practice activity on the same device; stored data remains descriptive and replay-safe; no backend/account dependency exists.

---

## Milestone 20 — Phase 2 playable practice gate

**Goal:** integrate the Phase 2 capabilities into one coherent practice product before adding a larger game shell.

A learner should be able to:

1. arrive at Home/Menu;
2. start a deterministic mixed practice session;
3. encounter multiple mathematical families and unknown roles;
4. traverse several representation edges, including at least one new edge from Phase 2;
5. receive family-appropriate guidance/feedback;
6. complete the run;
7. inspect a descriptive local practice history;
8. replay/debug a concrete failed item deterministically.

**First red acceptance:** one end-to-end fixed replay traverses the real app shell and produces a reviewed transcript/browser flow across the complete Phase 2 vertical slice.

### Release gate

Before considering Phase 2 complete, prove:

- at least two genuinely different canonical problem families;
- multiple hidden roles;
- Theme remains independent of mathematical family and Mode;
- at least five representation edges in total;
- at least one non-text representation edge if M18 remains in this phase;
- guidance/diagnostics are family-capable and localized;
- sessions choose only supported family × Mode combinations;
- all session items are deterministic/replayable;
- local history does not contain private AnswerKey values;
- browser navigation/deep links/history remain stable;
- unit/property/approval/browser/build checks are green;
- selected outputs have been human-reviewed.

M20 is a natural point for actual learner/usability testing before investing in roguelike/map/progression shells.

---

# Cross-cutting rules for Phase 2

## Problem-family rule of two

The second mathematical family is an architecture test, not a special case.

When M11 introduces it:

- do not preserve total-from-parts fields as the implicit generic API;
- do not add fake quantities just to satisfy old assumptions;
- do not copy Theme/Mode implementations per family;
- introduce the smallest family/capability abstraction demanded by two real implementations.

## Capability over global assumptions

Not every family must support every Mode immediately.

Represent support explicitly, for example through family/Mode capability metadata or a registry-level predicate. The planner and UI should select only valid combinations.

Avoid scattered:

```ts
if (familyId === ...)
```

branches in generic composition/UI.

## Deterministic replay remains a product feature

Every new source of variation must have a stable replay story:

- family;
- mathematical seed;
- hidden-role policy/variant;
- Mode;
- Theme;
- locale;
- planner version where necessary.

A failing property/browser/session test must identify enough metadata to reproduce the same case.

## Tests grow with mathematical capability

For every new family/operator/value type, expand together:

- generator properties;
- canonical validation;
- DSL round-trip;
- debug/use-case printer approvals;
- Theme invariance;
- Mode support tests;
- session replay properties.

Avoid adding a mathematical capability that only has UI coverage.

## Learner history stays descriptive

Until a separate research/evaluation decision exists, recorded activity may say:

- what was attempted;
- what representation edge/family was practiced;
- whether the submitted item was accepted;
- what guidance was requested.

It should not infer:

- overall mathematical ability;
- mastery percentages;
- diagnostic labels about the learner;
- adaptive difficulty scores.

---

# Deferred beyond Phase 2

The following remain roadmap candidates rather than commitments in this execution plan:

- exponentiation and exponential growth;
- equation systems;
- graph/function plotting beyond the first visual representation;
- full algebraic solving/simplification;
- rich MathLive-style entry;
- server-side accounts/sync;
- educator dashboards;
- adaptive sequencing/mastery models;
- generative/LLM scenarios;
- roguelike/city/crafting/progression shells;
- telemetry/research infrastructure beyond explicit local prototypes.

Those should be chosen after the Phase 2 playable gate and early learner feedback, not because they already appear in the broad future roadmap.
