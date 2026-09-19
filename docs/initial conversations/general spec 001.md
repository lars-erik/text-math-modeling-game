# Math Representation Puzzle

## Phase 1 — Semantic DSL, Procedural Generation, and Graybox Core Loop

## 1. Product vision

Build a web-based mathematics learning game focused on a specific skill that is poorly served by traditional exercise systems:

> Translating between natural-language situations, explicit semantic models, formal expressions, and conventional mathematical notation.

The product should not primarily train arithmetic execution. It should train **representation**.

A learner may already be perfectly capable of solving:

```text
4x + 30 = 210
```

while struggling to construct that equation from:

> A system has a fixed power draw of 30 W. Four identical modules are connected. Together they draw 210 W. How much power does each module use?

The game should make the normally invisible intermediate representations explicit and train them independently.

The eventual product may use game maps, encounters, progression systems, interest-based themes, adaptive difficulty, and procedural scenarios.

Phase 1 must deliberately ignore most of that.

The first goal is to prove that the **core puzzle loop itself is useful, understandable, satisfying, and technically sound**.

---

# 2. Core learning model

The fundamental representation chain is:

```text
Natural-language situation
        ↕
Semantic quantities
        ↕
Named formal expression
        ↕
Substituted expression
        ↕
Academic mathematical notation
```

Example:

### Natural language

> A creator already has 320 followers. They gain 18 followers from each of seven promoted posts. How many followers do they have afterwards?

### Semantic quantities

```text
startingFollowers = 320
followersPerPost = 18
postCount = 7
finalFollowers = unknown
```

### Named expression

```text
finalFollowers =
    startingFollowers
    + followersPerPost * postCount
```

### Substituted expression

```text
finalFollowers = 320 + 18 * 7
```

### Academic notation

```text
F = 320 + 18 · 7
```

The important idea is:

> Academic symbols are compressed names for concepts the learner should already understand.

Single-letter symbols must therefore be a **presentation choice**, not the canonical internal representation.

The canonical semantic representation should use descriptive identifiers such as:

```text
followersPerPost
totalEnergy
monthlyFee
itemCount
distanceTravelled
```

---

# 3. Core puzzle philosophy

A puzzle should normally ask the learner to perform **one transformation**, rather than forcing them through the entire problem-solving pipeline every time.

Examples:

```text
story → quantities
quantities → named expression
named expression → academic notation
academic notation → named expression
named expression → story
incorrect model → diagnose error
```

This makes it possible to isolate the exact representational skill being trained.

A learner who can calculate perfectly should not repeatedly be forced to demonstrate arithmetic competence when the target skill is mathematical modelling.

Likewise, failure at one representation boundary should not automatically be reported as simply:

```text
Wrong answer
```

The architecture must eventually support distinguishing errors such as:

```text
semantic misunderstanding
incorrect mathematical relationship
incorrect substitution
notation/syntax error
algebraic manipulation error
arithmetic error
```

Phase 1 does not need the complete diagnostic system, but the semantic architecture must make it possible.

---

# 4. Representation graph

Treat the learning space as a graph rather than a fixed linear pipeline.

Initial nodes:

```text
Story
QuantityModel
NamedExpression
SubstitutedExpression
AcademicExpression
```

Initial transitions:

```text
Story -> QuantityModel
QuantityModel -> NamedExpression
NamedExpression -> SubstitutedExpression
SubstitutedExpression -> AcademicExpression

AcademicExpression -> NamedExpression
NamedExpression -> QuantityModel
QuantityModel -> Story
```

Later nodes may include:

```text
Diagram
Graph
Table
GeometryDiagram
Code
Function
EquationSystem
```

A puzzle type is essentially:

```ts
interface PuzzleDefinition {
    sourceRepresentation: RepresentationKind;
    targetRepresentation: RepresentationKind;
    checkPolicy: CheckPolicy;
}
```

The core puzzle engine should therefore not be built around a specific UI such as "solve this equation".

It should be built around:

> Transform representation A into representation B.

---

# 5. Architectural principles

## 5.1 The semantic AST is the source of truth

All mathematically meaningful content must ultimately map to one canonical semantic AST.

Do not use natural-language text, LaTeX, or the DSL itself as the source of truth.

Conceptually:

```text
             Story renderer
                   ↑
                   |
DSL parser -> Semantic AST <- Procedural generator
                   |
                   ↓
             Math renderer
```

The procedural generator should generate the semantic AST directly.

It should **not** generate DSL strings and then parse them during normal runtime.

The DSL serializer exists so generated problems can be:

* inspected,
* persisted,
* copied into test fixtures,
* reproduced,
* manually edited,
* round-trip tested.

The invariant should be:

```text
AST
 ↓ serialize
DSL
 ↓ parse
AST
```

produces an equivalent semantic model.

---

## 5.2 Syntax and semantics are separate

These are different:

```text
4 * x + 30
30 + x * 4
30 + 4x
```

They may represent the same mathematical relationship while having different syntax trees.

Similarly:

```text
totalCost = fixedCost + itemCount * itemPrice
```

and:

```text
T = F + np
```

are different presentations of the same semantic model.

The architecture must distinguish:

```text
parsing
semantic interpretation
canonicalization
mathematical equivalence
pedagogical target structure
```

---

## 5.3 Correctness is contextual

There must not be one universal `isCorrect()` function.

Different puzzles require different notions of correctness.

Initial policies:

```ts
type CheckPolicy =
    | "exact-structure"
    | "normalized-structure"
    | "equivalent-value";
```

Examples:

### Exact structure

Useful when explicitly training precedence or grouping.

```text
4 * (x + 30)
```

must not match:

```text
4 * x + 30
```

### Normalized structure

Allow harmless syntactic variation:

```text
x + 30
30 + x
```

when commutativity is irrelevant to the learning goal.

### Equivalent value

Useful for completed arithmetic:

```text
320 + 18 * 7
```

may be accepted as equivalent to:

```text
446
```

Later phases may introduce stronger symbolic equivalence.

---

# 6. Technology choices

Assume a browser-first TypeScript application.

Recommended Phase 1 stack:

```text
TypeScript
React
Vite
Vitest
Testing Library
fast-check
Ohm/JS
KaTeX
plain CSS or CSS Modules
```

Do not introduce a game engine.

Do not introduce a large visual component framework for the graybox.

## DSL parsing: Ohm/JS

Use Ohm/JS for the initial DSL and expression grammars.

Reasons for choosing it for Phase 1:

* grammar definition remains compact;
* syntax can remain separate from our semantic AST;
* semantic operations naturally support parse-tree-to-AST transformations;
* it does not force our domain model to inherit from the parser architecture;
* suitable for a small language that may change significantly during early development.

Keep the semantic AST handwritten TypeScript.

Do not treat the Ohm parse tree as the domain model.

### Deferred alternative: Langium

Langium is a strong candidate if the DSL later becomes a substantial authoring language requiring:

* editor tooling,
* references,
* validation,
* syntax highlighting,
* Language Server Protocol support,
* generated language infrastructure.

Do not adopt that complexity yet.

## Mathematical rendering: KaTeX

Use KaTeX for read-only academic notation.

The internal AST should produce LaTeX through our own visitor:

```text
Semantic AST -> LatexVisitor -> KaTeX
```

KaTeX must never become part of the semantic model.

## Mathematical input

For Phase 1, use a deliberately small textual mathematical syntax parsed by our own expression grammar.

Examples:

```text
4*x + 30 = 210
4x + 30 = 210
total = fixed + count * price
```

Do not implement a full LaTeX editor in Phase 1.

MathLive and its Compute Engine are strong future candidates for:

* rich mathematical input;
* LaTeX parsing;
* MathJSON conversion;
* symbolic simplification;
* stronger equivalence checks.

The domain must remain independent from those libraries.

---

# 7. Testing philosophy

Development is test-driven.

For every feature:

```text
red
→ smallest implementation
→ green
→ refactor
```

Do not build speculative infrastructure before a failing test requires it.

Every discovered production bug must become a regression test.

Use two complementary testing styles.

## Example-based tests

Use small explicit examples to define intended semantics.

Example:

```ts
it("evaluates multiplication before addition", () => {
    const ast = parseExpression("30 + 4 * 45");

    expect(evaluate(ast)).toBe(210);
});
```

## Property-based tests

Use `fast-check` heavily for generator invariants.

This project is especially suited to property-based testing because procedural generation itself is core functionality.

Important properties include:

```text
Every generated problem parses after serialization.

Every generated one-unknown linear problem has exactly one unknown.

Every generated beginner problem has a valid solution.

Generated integer-only problems produce integer solutions.

AST -> DSL -> AST preserves semantic meaning.

Renaming variables does not change evaluation.

Rendering an expression does not mutate it.

A generated known solution satisfies the generated equation.
```

Always expose the random seed for generated problems.

Any failing generated case must be reproducible from its seed.

---

# 8. Semantic domain model

Keep the first AST deliberately small.

## 8.1 Expressions

Initial expression types:

```ts
type Expression =
    | LiteralExpression
    | VariableExpression
    | AddExpression
    | SubtractExpression
    | MultiplyExpression
    | DivideExpression;
```

Example definitions:

```ts
interface LiteralExpression {
    kind: "literal";
    value: number;
}

interface VariableExpression {
    kind: "variable";
    quantityId: QuantityId;
}

interface AddExpression {
    kind: "add";
    left: Expression;
    right: Expression;
}

interface SubtractExpression {
    kind: "subtract";
    left: Expression;
    right: Expression;
}

interface MultiplyExpression {
    kind: "multiply";
    left: Expression;
    right: Expression;
}

interface DivideExpression {
    kind: "divide";
    numerator: Expression;
    denominator: Expression;
}
```

Do not add powers, roots, functions, vectors, matrices, or geometry operators until a Phase 1 test requires them.

They belong in later concept modules.

---

# 9. Quantities

A quantity represents a meaningful thing in the situation.

```ts
interface Quantity {
    id: QuantityId;

    displayName: string;

    value:
        | { kind: "known"; value: number }
        | { kind: "unknown" };

    dimension?: Dimension;
}
```

Example:

```ts
{
    id: "dronePower",
    displayName: "Drone power",
    value: { kind: "unknown" },
    dimension: "energy"
}
```

The identifier is semantic.

The academic symbol is presentation metadata and must not be the identity of the quantity.

For example:

```ts
interface AcademicSymbolMap {
    [quantityId: QuantityId]: string;
}
```

could map:

```text
dronePower -> p
totalPower -> P
```

without changing the underlying problem.

---

# 10. Minimal dimensions

Introduce a deliberately tiny dimension system because it provides excellent semantic feedback.

Initial dimensions may be:

```ts
type Dimension =
    | "scalar"
    | "count"
    | "money"
    | "energy"
    | "distance"
    | "time";
```

Phase 1 only needs enough checking to detect obvious invalid addition/subtraction.

For example:

```text
money + money       valid
energy + energy     valid
count + money       invalid
scalar * money      valid
count * money       potentially valid depending on model
```

Do not attempt full dimensional algebra yet.

The API should allow a proper unit/dimension system to replace this later.

---

# 11. Relations

Phase 1 needs equations.

```ts
interface Equation {
    kind: "equation";
    left: Expression;
    right: Expression;
}
```

A complete problem is:

```ts
interface Problem {
    id: string;

    concepts: ConceptId[];

    quantities: Quantity[];

    relation: Equation;

    scenario: ScenarioBinding;

    metadata: {
        seed: number;
        difficulty: number;
    };
}
```

---

# 12. Concept model

A problem should explicitly declare what mathematical concepts it is intended to train.

Example concept IDs:

```text
arithmetic.addition
arithmetic.subtraction
arithmetic.multiplication
arithmetic.division

algebra.variable
algebra.expression
algebra.equation

linear.one-unknown
linear.two-unknowns

geometry.rectangle
geometry.area

exponents.power
exponents.growth
```

Only a small subset is implemented in Phase 1.

Initial supported concepts:

```text
arithmetic.addition
arithmetic.subtraction
arithmetic.multiplication
algebra.variable
algebra.equation
linear.one-unknown
```

The concept system should be compositional.

A generated problem may train:

```text
[
    arithmetic.addition,
    arithmetic.multiplication,
    algebra.variable,
    linear.one-unknown
]
```

rather than belonging to one mutually exclusive category.

---

# 13. Initial DSL

The DSL exists primarily for:

* tests;
* debugging;
* fixtures;
* reproducing generated problems;
* manual authoring.

Example:

```text
problem creator-growth {
    concepts {
        arithmetic.addition
        arithmetic.multiplication
        algebra.variable
        linear.one-unknown
    }

    quantity startingFollowers: count = 320
    quantity followersPerPost: count = 18
    quantity postCount: scalar = 7
    quantity finalFollowers: count = ?

    equation {
        finalFollowers =
            startingFollowers
            + followersPerPost * postCount
    }

    scenario creator.followers
}
```

Another example:

```text
problem drone-power {
    concepts {
        arithmetic.addition
        arithmetic.multiplication
        linear.one-unknown
    }

    quantity basePower: energy = 30
    quantity droneCount: scalar = 4
    quantity dronePower: energy = ?
    quantity totalPower: energy = 210

    equation {
        totalPower =
            basePower + droneCount * dronePower
    }

    scenario gaming.drone-power
}
```

Keep the grammar boring.

Readable beats clever.

Do not attempt to make the DSL itself resemble mathematical notation more than necessary.

---

# 14. Visitors and semantic operations

Implement behavior over the AST using visitors or equivalent explicit operations.

Do not put substantial behavior directly into AST node classes.

Initial operations:

## EvaluationVisitor

Evaluate an expression when all required variables have values.

```ts
evaluate(expression, bindings)
```

## UnknownVisitor

Return all unknown quantities referenced by an expression/equation.

```ts
findUnknowns(relation)
```

## ValidationVisitor

Validate structural and semantic invariants.

Examples:

```text
all quantity references exist
exactly one unknown when required
division denominator cannot be statically zero
relation is dimensionally plausible
```

## SubstitutionVisitor

Replace named variables with known numeric values while preserving unknowns.

Example:

```text
total = base + count * price
```

becomes:

```text
210 = 30 + 4 * price
```

## NormalizationVisitor

Normalize only transformations explicitly supported by the current check policy.

Initial examples:

```text
a + b  ~  b + a
a * b  ~  b * a
```

Do not silently perform arbitrary algebraic simplification.

## LatexVisitor

Convert the semantic AST into LaTeX.

Example:

```text
30 + 4 * dronePower = 210
```

may become:

```latex
30 + 4p = 210
```

depending on the symbol map.

## DSLSerializer

Serialize the canonical domain model into deterministic DSL text.

Output ordering and formatting must be deterministic so snapshots remain stable.

---

# 15. Input parsing and checking

The learner's mathematical input must also become an AST.

Pipeline:

```text
user input
    ↓
expression grammar
    ↓
input AST
    ↓
name resolution
    ↓
normalization according to puzzle policy
    ↓
comparison with expected AST
```

Never compare raw strings.

For example:

```text
30 + 4*p
```

and:

```text
4*p + 30
```

must be eligible for semantic comparison rather than string comparison.

Likewise spacing must never matter.

---

# 16. Procedural generation

Procedural generation is a first-class domain system, not an afterthought.

The generator must produce valid semantic ASTs.

It should never rely on generating a random textual equation and hoping that it happens to be useful.

Conceptually:

```text
Generator specification
        ↓
Expression/relation shape
        ↓
Quantity roles
        ↓
Numerical values
        ↓
Unknown placement
        ↓
Validation
        ↓
Scenario binding
        ↓
Problem AST
```

---

# 17. Composite generator architecture

The generator must support composition of mathematical concepts.

Avoid one giant function such as:

```ts
generateMathProblem(difficulty)
```

Prefer small composable generators.

Conceptual API:

```ts
interface Generator<T> {
    generate(context: GenerationContext): T;
}
```

Higher-level generators may compose smaller generators:

```ts
const generator = compose(
    oneUnknownLinearEquation(),
    usesAddition(),
    usesMultiplication(),
    integerValues(),
    positiveValues(),
    solutionRange(1, 100)
);
```

The exact API should emerge through tests.

Do not over-design it before examples require abstraction.

A useful decomposition is likely:

```text
ShapeGenerator
ValueGenerator
UnknownSelector
ConstraintValidator
ScenarioBinder
```

---

# 18. Phase 1 generated equation family

Start with one highly useful mathematical schema:

```text
total = base + count * unitValue
```

Any one of the appropriate quantities may later become unknown.

Examples:

```text
210 = 30 + 4 * x

610 = 250 + 4 * x

500 = 50 + 3 * x
```

This single structure supports many meaningful scenarios.

Examples:

```text
fixed fee + item count * item price = total cost

existing followers + posts * followers per post = final followers

base power + modules * power per module = total power

starting XP + missions * XP per mission = final XP
```

The first implementation may restrict the unknown to `unitValue`.

Once fully tested, allow unknown placement in:

```text
base
count
unitValue
total
```

where mathematically and pedagogically sensible.

---

# 19. Generation by construction

Prefer generating values in a direction that guarantees solvability.

Bad approach:

```text
random total
random base
random count
solve for unitValue
hope result is nice
```

Better:

```text
random base
random count
random unitValue
calculate total
hide unitValue
```

For example:

```text
base = 30
count = 4
unitValue = 45

total = base + count * unitValue
total = 210
```

Then convert `unitValue` to unknown.

This gives strong generator invariants and avoids excessive rejection sampling.

---

# 20. Seeded randomness

Production generation must be reproducible.

Example:

```ts
generateProblem({
    seed: 918273,
    concepts: [
        "arithmetic.addition",
        "arithmetic.multiplication",
        "linear.one-unknown"
    ]
});
```

The debug UI must display:

```text
Seed: 918273
```

A failed generated case should be reproducible from that seed.

---

# 21. Property-based generator tests

Use property-based tests aggressively.

Examples:

```ts
it.prop([linearProblemArbitrary])(
    "generated solution satisfies the equation",
    problem => {
        expect(
            evaluateEquation(
                problem.relation,
                solutionBindings(problem)
            )
        ).toBe(true);
    }
);
```

Properties should include:

```text
generated problems validate

generated Phase 1 problems contain exactly one unknown

the hidden value is inside the configured range

the original generated value solves the equation

serialization is deterministic

AST -> DSL -> AST preserves semantics

renaming quantities preserves mathematical behavior

scenario binding never changes the mathematical relation
```

---

# 22. Scenario system

Story generation must be replaceable independently of mathematics.

Define an interface such as:

```ts
interface StoryGenerator {
    generate(problem: Problem): Story;
}
```

Phase 1 uses deterministic handcrafted templates.

Later implementations may include:

```text
template generator
grammar-based generator
LLM generator
hybrid generator
```

Nothing outside the story-generation boundary should care which implementation produced the text.

---

# 23. Scenario bindings

Do not build arithmetic directly around domain words.

The mathematical schema might expose semantic roles:

```text
base
count
unitValue
total
```

A scenario maps those roles to domain concepts.

Example:

```ts
const creatorFollowersScenario = {
    id: "creator.followers",

    roles: {
        base: "startingFollowers",
        count: "postCount",
        unitValue: "followersPerPost",
        total: "finalFollowers"
    }
};
```

Another:

```ts
const dronePowerScenario = {
    id: "gaming.drone-power",

    roles: {
        base: "basePower",
        count: "droneCount",
        unitValue: "dronePower",
        total: "totalPower"
    }
};
```

The mathematical structure remains identical.

---

# 24. Initial interest packs

Implement only a few deterministic cases, but deliberately avoid the traditional "fruit budget" feel.

Suggested initial packs:

```text
creator/social
gaming/technology
style/products
```

These must be selectable interests, never demographic assumptions.

Example creator text:

> A creator already has 320 followers. Each promoted post brings in 18 new followers. After seven promoted posts, how many followers do they have?

Example gaming/technology text:

> A ship uses 30 MW for its basic systems. Four identical drones are active. The whole system uses 210 MW. How much power does each drone use?

Example style/products text:

> A subscription has a fixed monthly fee of 250 kr. Four identical products were added this month, bringing the total to 610 kr. What was the price of each product?

These examples may intentionally share the same mathematical schema.

That similarity is pedagogically useful.

---

# 25. Future LLM story generation

The architecture should permit a language model to generate contextualized story text later.

However:

> An LLM must never define the mathematics or the correct answer.

The future pipeline should be:

```text
validated Problem AST
        ↓
structured scenario facts
        ↓
LLM
        ↓
story text
        ↓
optional validation
```

The model receives fixed mathematical facts and turns them into natural language.

It does not invent the equation.

It does not grade the learner's mathematics.

It does not determine the expected solution.

This keeps the mathematical core deterministic and testable.

LLM integration is explicitly outside Phase 1.

---

# 26. Graybox core loop

Build one screen.

No map.

No account.

No inventory.

No animation system.

No game economy.

No avatar.

The page should roughly contain:

```text
┌──────────────────────────────────────────┐
│ Problem / source representation          │
│                                          │
│ [ current source representation ]        │
│                                          │
├──────────────────────────────────────────┤
│ Build the next representation            │
│                                          │
│ [ interactive answer area ]              │
│                                          │
│ [ Check ] [ Hint ] [ New Problem ]       │
├──────────────────────────────────────────┤
│ Feedback                                 │
├──────────────────────────────────────────┤
│ Debug                                    │
│ seed / AST / expected result / concepts  │
└──────────────────────────────────────────┘
```

The debug panel may be permanently visible in Phase 1.

---

# 27. Initial puzzle types

Implement only enough puzzle types to prove the representation loop.

## Puzzle A — Story to quantities

Given:

> A ship uses 30 MW for basic systems. Four identical drones are active. Together they use 210 MW.

Learner identifies:

```text
basePower = 30
droneCount = 4
dronePower = unknown
totalPower = 210
```

For the first graybox, this may use selectable chips rather than free-form input.

The important test is identifying mathematical quantities and unknowns.

---

## Puzzle B — Quantities to named expression

Given:

```text
basePower = 30
droneCount = 4
dronePower = unknown
totalPower = 210
```

Learner constructs:

```text
totalPower = basePower + droneCount * dronePower
```

This is the most important Phase 1 puzzle.

Initially, either use:

* a small expression editor;
* draggable expression tokens;
* or plain textual input.

Choose whichever creates the smallest testable implementation.

Do not optimize visual interaction yet.

---

## Puzzle C — Named expression to academic notation

Given:

```text
totalPower = basePower + droneCount * dronePower
```

and symbol mapping:

```text
totalPower -> P
dronePower -> p
```

produce:

```text
210 = 30 + 4p
```

Render the expected notation using KaTeX.

The learner may initially type:

```text
210 = 30 + 4*p
```

rather than literal LaTeX.

---

## Puzzle D — Academic notation to named model

Given:

```text
210 = 30 + 4p
```

and:

```text
p = dronePower
```

reconstruct:

```text
totalPower = basePower + droneCount * dronePower
```

---

## Puzzle E — Match equation to story

Do not attempt free-form natural-language grading in Phase 1.

Instead, given an equation/model, present several generated scenarios and ask which story expresses the same relationship.

Distractors should contain meaningful structural errors.

Example distractor:

> Each drone uses 30 MW plus another unknown amount.

This corresponds to:

```text
droneCount * (basePower + dronePower)
```

rather than:

```text
basePower + droneCount * dronePower
```

This lets us train model-to-language reasoning without needing NLP-based grading.

---

# 28. Feedback

Feedback should refer to mathematical meaning whenever possible.

Bad:

```text
Incorrect.
```

Better:

```text
Your expression applies the fixed power cost once per drone.
```

Best future version:

```text
4 * (dronePower + basePower)

means:

four copies of both dronePower and basePower.
```

Phase 1 only needs enough structure to prove this style of feedback is feasible.

Implement feedback first for one known structural mistake:

```text
count * (unitValue + base)
```

instead of:

```text
base + count * unitValue
```

---

# 29. Debug representation

Every generated problem should have an inspectable debug representation.

Example:

```text
Seed:
918273

Concepts:
arithmetic.addition
arithmetic.multiplication
linear.one-unknown

Schema:
base-plus-count-times-unit

Scenario:
gaming.drone-power

AST:
Equation
├── Variable(totalPower)
└── Add
    ├── Variable(basePower)
    └── Multiply
        ├── Variable(droneCount)
        └── Variable(dronePower)

Unknown:
dronePower

Solution:
45

DSL:
[serialized DSL here]
```

This view will be invaluable while developing generators.

---

# 30. Phase 1 implementation plan

Work strictly in small vertical increments.

Do not implement the entire architecture before the first playable puzzle exists.

## Step 1 — Project skeleton

Create:

```text
React
TypeScript
Vite
Vitest
Testing Library
fast-check
Ohm/JS
KaTeX
```

Acceptance criteria:

```text
npm test
npm run build
npm run dev
```

all work.

Render a single graybox page.

No product styling.

---

## Step 2 — Smallest semantic expression AST

Write tests first for:

```text
Literal
Variable
Add
Multiply
Equation
```

Implement only those nodes.

Write an evaluator visitor.

First target example:

```text
total = base + count * unit
```

with bindings:

```text
base = 30
count = 4
unit = 45
total = 210
```

Test that the relation evaluates as true.

Do not add subtraction or division yet.

---

## Step 3 — Quantity model

Introduce:

```text
Quantity
known value
unknown value
dimension
```

Tests:

```text
variable references resolve to quantities

missing references are rejected

a one-unknown problem reports exactly one unknown

known bindings can be evaluated
```

Implement the smallest validation visitor needed.

---

## Step 4 — Minimal expression parser

Create an Ohm grammar for:

```text
numbers
identifiers
+
*
=
parentheses
```

Example:

```text
totalPower = basePower + droneCount * dronePower
```

Parse into the canonical semantic AST.

Tests must verify precedence:

```text
a + b * c
```

means:

```text
a + (b * c)
```

while:

```text
(a + b) * c
```

remains different.

---

## Step 5 — DSL parser

Extend the grammar to parse the first complete problem fixture.

Start with exactly one hand-written DSL document.

Test:

```text
DSL -> Problem AST
```

Do not add grammar features without a fixture requiring them.

---

## Step 6 — DSL serializer

Implement deterministic serialization.

Test:

```text
AST -> DSL
```

Then test:

```text
AST -> DSL -> AST
```

for semantic equality.

Also test:

```text
DSL -> AST -> DSL
```

for canonical textual output.

---

## Step 7 — LaTeX visitor

Implement:

```text
literal
variable symbol
addition
multiplication
equation
parentheses when required
```

Test precedence explicitly.

Examples:

```text
a + b * c
```

should not render redundant grouping.

```text
(a + b) * c
```

must retain grouping.

Use KaTeX only after LaTeX string generation has unit tests.

---

## Step 8 — First deterministic problem generator

Implement exactly one schema:

```text
total = base + count * unitValue
```

Generate:

```text
base
count
unitValue
```

and derive:

```text
total
```

Then hide:

```text
unitValue
```

Tests:

```text
problem validates
one unknown exists
solution is integer
solution satisfies equation
values remain inside configured ranges
same seed produces same problem
```

---

## Step 9 — Property tests for generation

Introduce `fast-check`.

Test many generated configurations.

Important invariant:

```text
generate
→ solve with original hidden value
→ relation evaluates true
```

Add serialization round-trip as a generated property.

Any failure must print or retain its seed.

---

## Step 10 — First scenario generator

Implement one deterministic template:

```text
gaming.drone-power
```

Input:

```text
base = 30
count = 4
unitValue = 45
total = 210
```

Output:

> A ship uses 30 MW for its basic systems. Four identical drones are active. Together they use 210 MW. How much power does each drone use?

Test the generated facts, not literary quality.

The story generator must never calculate mathematics itself.

It only receives already-generated quantities.

---

## Step 11 — Second scenario using identical mathematics

Add:

```text
creator/social
```

or another clearly different interest domain.

Use the exact same mathematical AST.

Test that:

```text
scenario A mathematics == scenario B mathematics
```

This is the first proof that mathematical generation and theme generation are correctly separated.

---

## Step 12 — Graybox puzzle: quantities to named expression

Build the first actual interactive puzzle.

Display:

```text
basePower = 30
droneCount = 4
dronePower = ?
totalPower = 210
```

Ask the learner to enter:

```text
totalPower = basePower + droneCount * dronePower
```

Parse learner input into an AST.

Compare using `normalized-structure`.

Display:

```text
Correct
```

or meaningful parser/structure feedback.

Write UI tests before implementation.

---

## Step 13 — Graybox puzzle: story to quantities

Display generated story text.

Ask the learner to identify:

```text
known quantities
unknown quantity
values
```

Use constrained controls initially.

Do not parse free-form prose responses.

---

## Step 14 — Graybox puzzle: named model to academic notation

Render the academic result with KaTeX.

Allow simple typed mathematical syntax as input.

Keep symbol mapping explicit.

Example:

```text
dronePower -> p
```

Expected:

```text
210 = 30 + 4*p
```

Parse and compare ASTs.

---

## Step 15 — First reverse puzzle

Given academic notation and semantic symbol mappings, reconstruct or select the matching named relation.

This proves that the architecture supports movement in both directions.

---

## Step 16 — Minimal puzzle session

Create a session containing approximately:

```text
5–10 generated transformations
```

Mix:

```text
story -> quantities
quantities -> named relation
named relation -> academic notation
academic notation -> named relation
```

No scoring system is required.

At completion, display only simple diagnostics such as:

```text
8 / 10 correct

Story -> quantities: 3 / 4
Quantities -> model: 3 / 3
Notation -> model: 2 / 3
```

This is enough to begin evaluating whether the core loop reveals meaningful differences between representation skills.

---

# 31. Phase 1 acceptance criteria

Phase 1 is successful when all of the following are true.

## Mathematical engine

* A canonical semantic AST exists.
* The AST does not depend on React, KaTeX, or natural-language text.
* Expressions can be evaluated.
* Problems can be semantically validated.
* Learner expressions are parsed into the same AST representation.

## DSL

* At least one complete problem can be represented.
* Parser and serializer exist.
* Round-trip tests pass.
* Generated problems can be dumped as readable DSL.

## Generation

* At least one mathematical schema is procedurally generated.
* Generation is seeded and deterministic.
* Generated problems are valid by construction.
* Property-based tests cover generator invariants.
* At least two semantically different story domains can represent the same mathematical AST.

## Representation

The system supports at least:

```text
story
quantities
named expression
academic expression
```

and transformations in more than one direction.

## Graybox

A user can complete a short generated session entirely in the browser.

No manually authored sequence of fixed problems is required.

---

# 32. Explicit Phase 1 non-goals

Do not implement:

```text
user accounts
cloud persistence
leaderboards
maps
roguelike progression
combat
inventory
achievements
adaptive difficulty
LLM story generation
free-form prose grading
full LaTeX editing
symbolic computer algebra
geometry
graphs
two-variable systems
quadratics
exponents
calculus
mobile polish
production visual design
analytics infrastructure
```

The architecture should permit those later where appropriate.

It should not implement them prematurely.

---

# 33. High-level roadmap after Phase 1

Do not plan these phases in implementation detail yet.

They exist only to protect current architectural decisions from obvious dead ends.

## Phase 2 — Representation depth

Expand representation types and input quality.

Possible additions:

```text
interactive diagrams
tables
graphs
MathLive input
stronger expression equivalence
better structured feedback
```

## Phase 3 — Mathematical concept composition

Expand the generator to support composable families such as:

```text
arithmetic
linear equations
systems with two unknowns
ratios
percentages
geometry
powers
exponential growth
functions
```

Concept composition should determine the generated AST structure rather than selecting from a catalogue of prewritten questions.

## Phase 4 — Personalization

Introduce learner modelling.

Track success by transformation edge:

```text
Story -> Model
Model -> Expression
Expression -> Notation
Notation -> Model
```

rather than merely tracking a single generic "math score".

Use this to choose future transformations and scaffolding.

## Phase 5 — Generative context

Allow richer scenario generation based on user-selected interests.

A language model may turn validated structured problems into varied natural-language situations.

The mathematical AST remains authoritative.

## Phase 6 — Game themes and progression

Build different experiences over the same learning engine.

Examples may include:

```text
roguelike encounters
city exploration
social/creator progression
building/crafting
mystery/problem solving
```

The game layer consumes the puzzle engine.

The puzzle engine must not depend on a particular game layer.

---

# 34. Architectural boundary summary

The intended dependency direction is:

```text
                    ┌─────────────────────┐
                    │     Web UI          │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │   Puzzle Engine     │
                    └──────────┬──────────┘
                               │
              ┌────────────────▼────────────────┐
              │        Semantic Domain          │
              │ AST / validation / visitors     │
              └────────────────┬────────────────┘
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
     ┌───────▼──────┐  ┌───────▼──────┐  ┌──────▼──────┐
     │ DSL Adapter  │  │ Generators    │  │ Renderers   │
     └──────────────┘  └───────┬──────┘  └──────┬──────┘
                               │                 │
                        ┌──────▼──────┐    ┌─────▼──────┐
                        │ Scenarios   │    │ KaTeX/etc. │
                        └─────────────┘    └────────────┘
```

The semantic domain must have no dependency on:

```text
React
KaTeX
Ohm parse trees
LLMs
game mechanics
specific story themes
```

---

# 35. First principle for Codex

When implementing this specification:

> Prefer the smallest tested implementation that enables the next vertical slice.

Do not implement a general algebra system before one is required.

Do not build a universal generator before generating one equation family correctly.

Do not implement every visitor before one puzzle needs it.

Do not introduce abstractions solely because the roadmap suggests they may eventually become useful.

Start with:

```text
total = base + count * unitValue
```

and make the complete journey work:

```text
generate semantic problem
→ serialize DSL
→ generate meaningful story
→ render named model
→ accept learner input
→ parse input
→ compare ASTs
→ render academic notation
→ reverse the transformation
→ repeat with another generated problem
```

Once that loop is pleasant, reliable, reproducible, and well tested, expand the mathematics.
