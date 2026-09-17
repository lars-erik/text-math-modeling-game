# Procedural generation and scenarios

## Two independent generators

The **mathematical generator** produces a complete and valid semantic problem plus a private answer key. The **scenario generator** renders those fixed facts as a particular story. A scenario can change audience appeal and vocabulary while the mathematics and answer remain identical.

```
requested concepts + constraints + seed
           ↓
    composable math plan
           ↓
     AST + answer key
           ↓
       validation
           ↓
 scenario binding + template
           ↓
     rendered story
```

Mathematical generation constructs an AST directly. The DSL serializer exposes that AST for fixtures, review, and replay.

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
  scenarioId: string;
}

interface GeneratedCase {
  problem: Problem;       // learner-visible facts and semantic relationship
  answerKey: AnswerKey;  // complete hidden bindings, for checking/debug
  replay: ReplayToken;   // seed, generator version, config/scenario ID
}
```

Compose distinct responsibilities as needed by concrete tests: `ShapeGenerator`, `ValueGenerator`, `UnknownSelector`, `ConstraintValidator`, `ScenarioBinder`. A small pure function may satisfy several responsibilities at first; extract reusable interfaces when a second shape requires them. Allow multiple concepts to contribute to one schema: addition and multiplication may both shape the same generated relation.

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

Inject the random-number source. Use a stable documented algorithm or library, explicit numeric ranges, and deterministic ordering. The same seed, generator version, configuration and scenario ID produce an identical case. Print all replay fields with generated test failures. `fast-check` manages its own shrinkable test cases; record both the fast-check replay seed/path and the application's generation seed as appropriate.

Generation invariants:

- All quantity references resolve, and quantity IDs are unique.
- The requested concepts are represented by the resulting shape.
- Phase 1 puzzles expose exactly one hidden quantity.
- All generated values fit the configured ranges and numeric safety constraints.
- Every generated answer key satisfies the relation.
- The hidden answer meets the integer-solution constraint.
- AST -> DSL -> AST preserves semantics.
- Scenario selection leaves the mathematical model and answer unchanged.

## Structured scenario bindings

The shape has roles: `base`, `count`, `unitValue`, `total`. A scenario gives the roles meaningful identifiers, labels, dimensions/units, and natural language.

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

Use an explicit role map that preserves the equation structure across interest packs. Use coherent units and narrative: the fixed base applies once, each repeated unit applies `count` times, and the question identifies the hidden role.

## First handcrafted templates

Gaming / technology:

> A ship uses 30 MW for basic systems. Four identical drones are active. Together they draw 210 MW. How much power does one drone draw?

Creator / social:

> A creator starts with 30 followers. Each of four promoted posts gains the same number of followers. The creator finishes with 210 followers. How many followers does each post gain?

Style / products (optional third pack):

> A subscription has a fixed fee of 30 kr. Four identical products bring the total to 210 kr. What is the price of one product?

The domain's numbers come from the generated AST and answer key, not hard-coded values in a story string. Use simple singular/plural helpers for coherent output. Interest is a **user-selected context preference**, not a demographic inference.

## Template testing

Print a deterministic story and a fact ledger in an approval artifact. Test required quantities, values, dimensions, unknown role and equation separately through exact assertions. An approved prose output verifies wording and readability but is not the sole source of evidence that the story is mathematically faithful.

## Later LLM adapter

Retain a `StoryGenerator` interface that accepts validated facts and returns story text and structured metadata. An eventual language model receives a locked fact ledger and interest setting. Treat its text as untrusted until a validation/review process confirms that it preserved facts, mathematical relationships, units, and the question. The semantic AST/answer key remains authoritative. Phase 1 uses deterministic templates; the LLM path is an architectural seam.
