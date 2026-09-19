# Procedural generation and themes

## Independent mathematical generation and Theme projection

The **mathematical generator** produces a complete canonical `Problem` plus a private `AnswerKey`. A **Theme** projects those fixed canonical facts into a story, contextual labels/names/units and locale-specific wording. Theme selection never changes the Problem or AnswerKey.

```text
requested concepts + constraints + seed
           |
           v
    composable math plan
           |
           v
 canonical Problem + private AnswerKey
           |
           +-------------> Mode
           |
           +-------------> Theme + locale + story seed
                                |
                                v
                         ThemePresentation
```

Mathematical generation constructs the AST directly. The canonical DSL exposes only that mathematical AST/replay. Learner-facing replay records Theme, Mode and locale separately.

## Initial compositional design

Treat `arithmetic.addition`, `arithmetic.multiplication`, `algebra.variable`, and `linear.one-unknown` as composable capability/constraint declarations. Give the generator an explicit plan and validate that its output satisfies all requested concepts. Mathematical *shapes* are reusable building blocks, not hard-coded theme-specific questions.

Illustrative interface:

```ts
interface GenerationRequest {
  seed: number;
  concepts: readonly ConceptId[];
  constraints: {
    integerSolutions: true;
    minSolution: number;
    maxSolution: number;
    positiveValues: true;
  };
}

interface GeneratedCase {
  problem: Problem;      // canonical learner-visible mathematics
  answerKey: AnswerKey; // complete hidden bindings, for checking/debug only
  replay: MathReplayToken; // seed, generator version, mathematical config
}

interface PuzzleSelection {
  themeId: string;
  mode: PuzzleMode;
  locale: PuzzleLocale;
  storySeed: number;
}
```

Compose mathematical responsibilities as needed by concrete tests: `ShapeGenerator`, `ValueGenerator`, `UnknownSelector`, and `ConstraintValidator`. Theme projection is outside mathematical generation. A small pure function may satisfy several mathematical responsibilities at first; extract reusable interfaces when a second mathematical shape requires them. Allow multiple concepts to contribute to one schema: addition and multiplication may both shape the same generated relation.

## First equation family

```
total = base + count * unitValue
```

Generate valid values **by construction**:

```
base = 30
count = 4
unitValue = 45
total = 30 + 4 * 45 = 210
```

Hide `unitValue` in the first vertical slice. Later allow hiding `base`, `count`, or `total` after writing appropriate domain and pedagogy tests (including zero/non-integer cases). Preserve the complete answer key rather than solving randomly constructed equations to recover it.

The mathematical family uses generic roles/dimensions such as `scalar + item * scalar -> scalar`: `item` marks the repeated count and the second `scalar` is the abstract per-count value. Concrete Theme concepts such as MW/drone or followers/post are presentation/unit semantics validated by the Theme; they do not rewrite the canonical Problem's IDs, relation or generic dimensions.

The initial family trains the requested concept composition:

```
arithmetic.addition
arithmetic.multiplication
algebra.variable
algebra.equation
linear.one-unknown
```

A broader catalog can later add additive change, comparisons, ratios, two unknowns, geometry, and exponentials through tested AST/constraint composition.

## Determinism and replay

Inject the random-number source. Use a stable documented algorithm or library, explicit numeric ranges, and deterministic ordering. The same seed, generator version and mathematical configuration produce an identical canonical case regardless of Theme, Mode or locale. Print mathematical replay fields with generated test failures. `fast-check` manages its own shrinkable test cases; record both the fast-check replay seed/path and the application's generation seed as appropriate.

The `total-from-parts-v1` generator uses Mulberry32 and accepts unsigned 32-bit
integer seeds (`0` through `4294967295`). This range is the replay contract:
every accepted numeric seed maps to one initial RNG state, so larger safe
integers that would be truncated by JavaScript bitwise operations are rejected.
Restricting the accepted range does not change output for an already-supported
seed and therefore does not require a generator-version change.

Generation invariants:

- All quantity references resolve, and quantity IDs are unique.
- The requested concepts are represented by the resulting shape.
- Phase 1 puzzles expose exactly one hidden quantity.
- All generated values fit the configured ranges and numeric safety constraints.
- Every generated answer key satisfies the relation.
- The hidden answer meets the integer-solution constraint.
- AST -> DSL -> AST preserves semantics.
- Theme selection leaves the exact canonical Problem/DSL/relation and AnswerKey unchanged.
- Mode selection leaves the exact canonical Problem/DSL/relation and AnswerKey unchanged.
- Locale selection leaves the exact canonical Problem, AnswerKey, and semantic Theme story plan unchanged.
- Every supported locale provides the complete typed resource-key set required by its scenario.

## Structured Theme projections

The shape has canonical IDs/roles: `base`, `count`, `unitValue`, `total`. A Theme gives those roles contextual learner-facing names, labels, units and natural language while retaining the canonical IDs as semantic identity.

```
Shape: total = base + count * unitValue

Gaming roles:
  base       -> basePower (MW)
  count      -> droneCount (drones)
  unitValue  -> dronePower (MW/drone)
  total      -> totalPower (MW)

Creator roles:
  base       -> startingFollowers (followers)
  count      -> promotedPostCount (posts)
  unitValue  -> followersPerPost (followers/post)
  total      -> finalFollowers (followers)
```

Use an explicit presentation map keyed by canonical IDs/roles. `basePower` and `startingFollowers` are learner-facing names, not replacements for canonical `base`; similarly for the other roles. Use coherent units and narrative: the fixed base applies once, each repeated unit applies `count` times, and the question identifies the hidden role.

A Theme adapter returns presentation data, not `{ problem: Problem }`. It never renames AST references, rewrites relations, changes mathematical replay, or creates task-specific definitions. The same `ThemePresentation` is reusable by every Mode.

## Localized Theme resource maps

Keep Theme semantics separate from language. A Theme first produces a deterministic **story plan** containing semantic keys for quantities, nouns, and sentence fragments. A locale renderer then resolves those keys through a language resource map and interpolates only validated fact-ledger values. Random selection chooses semantic variant keys before localization, so changing language does not choose a different mathematical story structure.

Use Bellissima-style language modules: each supported locale lives in its own file and exports the same typed nested map. For example:

```text
features/scenarios/gaming-drone-power/
  scenario.ts
  lang/
    en.ts
    nb.ts
    index.ts
```

The exact implementation shape should emerge from tests, but the Phase 1 resource contract includes stable keys for at least:

```ts
type ScenarioLocaleResources = {
  quantities: {
    basePower: { variableName: string; label: string };
    droneCount: { variableName: string; label: string };
    dronePower: { variableName: string; label: string };
    totalPower: { variableName: string; label: string };
  };
  nouns: {
    ship: { singular: string; plural: string };
    drone: { singular: string; plural: string };
  };
  units: {
    power: string;
    powerPerDrone: string;
  };
  fragments: {
    baseFact: { basicSystems: string };
    countFact: { activeDrones: string };
    totalFact: { combinedDraw: string };
    question: { perDronePower: string };
  };
};
```

The map keys are stable Theme resource keys while semantic quantity references point back to canonical Problem IDs; values are localized. `variableName` is the identifier shown to and accepted from the learner for named-expression puzzles. The parser resolves that localized name back to the Problem's canonical quantity ID before semantic checking. Noun forms and sentence fragments are data rather than conditionals embedded in the renderer. Extend the shared noun-form schema deliberately when a supported language needs additional grammatical forms.

Generic puzzle UI text (commands, common prompts, feedback categories) uses the same per-locale-map pattern in the puzzle feature rather than being duplicated in every scenario. All learner-visible strings should come from a locale resource boundary even when Phase 1 initially exercises only a small subset.

Phase 1 proves the contract with English (`en`) and Norwegian Bokmål (`nb`) resources for the first scenario. Add an exact key-parity/type test, approve representative rendered stories in both languages, and assert that locale changes preserve the canonical AST, answer key, chosen story-plan keys, and hidden role. Include locale in rendered-puzzle/session replay metadata whenever exact text reproduction depends on it; locale is not an input to mathematical generation.

## First handcrafted templates

Gaming / technology:

> A ship uses 30 MW for basic systems. Four identical drones are active. Together they draw 210 MW. How much power does one drone draw?

Creator / social:

> A creator starts with 30 followers. Each of four promoted posts gains the same number of followers. The creator finishes with 210 followers. How many followers does each post gain?

Style / products (optional third pack):

> A subscription has a fixed fee of 30 kr. Four identical products bring the total to 210 kr. What is the price of one product?

The domain's numbers come from the generated AST and answer key, not hard-coded values in a story string. Use simple singular/plural helpers for coherent output. Interest is a **user-selected context preference**, not a demographic inference.

## Template testing

Print a deterministic story and a fact ledger in an approval artifact. Test required quantities, values, contextual units, unknown role and relation separately through exact assertions. Approve representative output for each Phase 1 locale and verify that localized learner-facing variable names resolve to the same canonical quantities. Also assert exact deep equality of the canonical Problem before and after every Theme projection; normalized arithmetic equivalence alone is insufficient. An approved prose output verifies wording and readability but is not the sole source of evidence that the story is mathematically faithful.

## Later LLM adapter

Retain a `StoryGenerator`/Theme interface that accepts the immutable canonical Problem plus validated presentation facts and returns story text and structured metadata. An eventual language model receives a locked fact ledger and interest setting. Treat its text as untrusted until a validation/review process confirms that it preserved facts, mathematical relationships, units, and the question. The semantic AST/answer key remains authoritative. Phase 1 uses deterministic templates; the LLM path is an architectural seam.
