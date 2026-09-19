# Research: DSL catalog per grade/knowledge area + theme bank

> Companion to `curriculum-mapping.md`: a target catalog of canonical DSL
> fixtures per grade band and knowledge area, plus a bank of relatable,
> fruit-free themes. All fixtures follow the canonical, theme-free DSL from
> `docs/03-dsl-and-representations.md`; themes follow the projection contract
> from `docs/04-generation-and-scenarios.md` (theme changes never rewrite the
> canonical Problem or AnswerKey).

Conventions:

- Same structure as `total-from-parts`: `concepts`, `quantity` (with role and
  known/`?`), `equation`, `replay`.
- The current grammar supports `+ *`, `=`, parentheses. Families marked ⚠️
  require grammar extensions (subtraction, division, exponent, function
  calls, multiple equations) — the documented "broader catalog" direction
  (additive change, comparisons, ratios, two unknowns, geometry,
  exponentials).
- Canonical IDs stay theme-free; theme wording enters only through Theme
  projection.

## 1. DSL fixtures per grade and knowledge area

### Years 1–2 — numbers (addition/subtraction in daily life)

⚠️ subtraction:

```text
problem sum-from-parts {
    concepts { arithmetic.addition algebra.variable }
    quantity partA: scalar role addend = 5
    quantity partB: scalar role addend = ?
    quantity total: scalar role total = 8
    equation { total = partA + partB }
    replay { seed 101 generator sum-from-parts-v1 }
}
```

```text
problem take-away {
    concepts { arithmetic.subtraction algebra.variable }
    quantity start: scalar role total = 10
    quantity removed: scalar role addend = 3
    quantity rest: scalar role difference = ?
    equation { start = rest + removed }
    replay { seed 102 generator take-away-v1 }
}
```

### Years 3–4 — multiplication as grouping

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

Partitive division (⚠️ division, or keep as multiplication with hidden factor):

```text
problem share-evenly {
    concepts { arithmetic.multiplication arithmetic.division algebra.variable }
    quantity count: item role count = ?
    quantity unitValue: scalar role per-item = 4
    quantity total: scalar role total = 24
    equation { total = count * unitValue }
    replay { seed 104 generator share-evenly-v1 }
}
```

### Years 4–5 — fractions and money (purchase = current family)

```text
problem total-from-parts {
    concepts { arithmetic.addition arithmetic.multiplication algebra.variable linear.one-unknown }
    quantity base: scalar role base = 50
    quantity count: item role count = 4
    quantity unitValue: scalar role per-item = ?
    quantity total: scalar role total = 250
    equation { total = base + count * unitValue }
    replay { seed 17 generator total-from-parts-v1 }
}
```

Fraction of an amount (⚠️ fractional scalars):

```text
problem fraction-of-amount {
    concepts { arithmetic.multiplication fractions.fraction-of algebra.variable }
    quantity fraction: scalar role per-item = 1/4
    quantity whole: scalar role total = 28
    quantity part: scalar role base = ?
    equation { part = fraction * whole }
    replay { seed 105 generator fraction-of-amount-v1 }
}
```

### Years 5–6 — percent and measurement

⚠️ percent scaled as fraction:

```text
problem percent-of-amount {
    concepts { arithmetic.multiplication percent.percentage algebra.variable }
    quantity fraction: scalar role per-item = 25/100
    quantity whole: scalar role total = 800
    quantity part: scalar role base = ?
    equation { part = fraction * whole }
    replay { seed 106 generator percent-of-amount-v1 }
}
```

Rectangle area (current grammar):

```text
problem rectangle-area {
    concepts { arithmetic.multiplication geometry.area algebra.variable }
    quantity width: scalar role count = 7
    quantity height: scalar role per-item = 5
    quantity area: scalar role total = ?
    equation { area = width * height }
    replay { seed 107 generator rectangle-area-v1 }
}
```

### Year 7 — equations from text (backwards thinking)

```text
problem unknown-start {
    concepts { arithmetic.addition arithmetic.multiplication algebra.equation linear.one-unknown }
    quantity base: scalar role base = ?
    quantity count: item role count = 5
    quantity unitValue: scalar role per-item = 3
    quantity change: scalar role addend = 4
    quantity total: scalar role total = 19
    equation { total = base + change + count * unitValue }
    replay { seed 108 generator unknown-start-v1 }
}
```

Comparison (⚠️ subtraction):

```text
problem compare-difference {
    concepts { arithmetic.subtraction algebra.variable comparison.difference }
    quantity big: scalar role total = 47
    quantity small: scalar role base = 29
    quantity difference: scalar role difference = ?
    equation { big = small + difference }
    replay { seed 109 generator compare-difference-v1 }
}
```

### Year 8 — algebraic expressions and the function concept

Current family = linear function from text:

```text
problem linear-model {
    concepts { arithmetic.addition arithmetic.multiplication algebra.variable linear.one-unknown functions.linear }
    quantity base: scalar role base = 50
    quantity count: item role count = 12
    quantity unitValue: scalar role per-item = ?
    quantity total: scalar role total = 110
    equation { total = base + count * unitValue }
    replay { seed 110 generator total-from-parts-v1 }
}
```

Pattern generalization (figurate numbers, ⚠️ exponent/non-linear):

```text
problem pattern-quadratic {
    concepts { algebra.variable patterns.figurate-numbers }
    quantity step: item role count = 6
    quantity term: scalar role total = ?
    relation { term = step * step }
    replay { seed 111 generator pattern-quadratic-v1 }
}
```

### Year 9 — Pythagoras and geometry

⚠️ squares/roots:

```text
problem pythagoras {
    concepts { geometry.pythagoras algebra.variable arithmetic.addition }
    quantity a: scalar role count = 3
    quantity b: scalar role per-item = 4
    quantity c: scalar role total = ?
    relation { c*c = a*a + b*b }
    replay { seed 112 generator pythagoras-v1 }
}
```

Similarity/scale (current grammar):

```text
problem similar-scale {
    concepts { arithmetic.multiplication geometry.similarity algebra.variable }
    quantity scale: scalar role per-item = ?
    quantity smallSide: scalar role count = 4
    quantity bigSide: scalar role total = 10
    equation { bigSide = scale * smallSide }
    replay { seed 113 generator similar-scale-v1 }
}
```

### Year 10 — growth factor and equation systems

Exponential growth (⚠️ exponent):

```text
problem exponential-growth {
    concepts { functions.exponential percent.growth-factor algebra.variable }
    quantity start: scalar role base = 10000
    quantity factor: scalar role per-item = 103/100
    quantity periods: item role count = 5
    quantity end: scalar role total = ?
    relation { end = start * factor^periods }
    replay { seed 114 generator exponential-growth-v1 }
}
```

Equation system (⚠️ two equations, two unknowns):

```text
problem system-two-plans {
    concepts { algebra.equation-system linear.two-unknowns }
    quantity baseA: scalar role base = 200
    quantity unitA: scalar role per-item = 5
    quantity baseB: scalar role base = 50
    quantity unitB: scalar role per-item = 10
    quantity count: item role count = ?
    quantity total: scalar role total = ?
    equations {
        total = baseA + unitA * count
        total = baseB + unitB * count
    }
    replay { seed 115 generator system-two-plans-v1 }
}
```

### 1P — society/work-life modelling

```text
problem loan-growth {
    concepts { percent.growth-factor functions.exponential arithmetic.multiplication }
    quantity principal: scalar role base = 150000
    quantity factor: scalar role per-item = 107/100
    quantity years: item role count = 1
    quantity debt: scalar role total = ?
    relation { debt = principal * factor^years }
    replay { seed 116 generator loan-growth-v1 }
}
```

Proportionality (⚠️ division):

```text
problem inverse-proportion {
    concepts { proportionality.inverse algebra.variable arithmetic.multiplication }
    quantity workers: item role count = ?
    quantity hoursPerWorker: scalar role per-item = 6
    quantity totalHours: scalar role total = 30
    equation { totalHours = workers * hoursPerWorker }
    replay { seed 117 generator inverse-proportion-v1 }
}
```

### 1T (MAT09-02) — modelling and functions

Linear model with rate of change (current family, 1T vocabulary: slope and intercept):

```text
problem linear-rate-of-change {
    concepts { functions.linear linear.one-unknown algebra.variable }
    quantity intercept: scalar role base = 250
    quantity rate: scalar role per-item = ?
    quantity steps: item role count = 4
    quantity value: scalar role total = 450
    equation { value = intercept + rate * steps }
    replay { seed 118 generator total-from-parts-v1 }
}
```

Trigonometry (⚠️ function calls):

```text
problem trig-shadow {
    concepts { geometry.trigonometry algebra.variable }
    quantity pole: scalar role total = 12
    quantity shadow: scalar role base = 9
    quantity angle: scalar role unknown = ?
    relation { tan(angle) = pole / shadow }
    replay { seed 119 generator trig-shadow-v1 }
}
```

Average rate of change (⚠️ 1T extension):

```text
problem average-rate {
    concepts { calculus.derivative functions.polynomial }
    quantity startValue: scalar role base = 40
    quantity timeSpan: item role count = 5
    quantity endValue: scalar role total = 100
    quantity avgRate: scalar role per-item = ?
    equation { endValue = startValue + avgRate * timeSpan }
    replay { seed 120 generator average-rate-v1 }
}
```

## 2. Theme bank — relatable, fruit-free themes per grade band

Each theme projects the canonical roles `base`, `count`, `unitValue`,
`total` onto learner-facing names and units. A theme never changes the
Problem or AnswerKey. Every theme should ship nb + en resource sets.

### Years 1–4

| Theme ID | Context | base | count | unitValue | total | Why it lands |
|---|---|---|---|---|---|---|
| `dino.eggs` | Dinosaur nests | eggsAtStart | nests | eggsPerNest | eggsTotal | kids love dinos |
| `lego.brick-tower` | LEGO tower | baseplateBricks | floors | bricksPerFloor | bricksTotal | construction play |
| `pokemon.card-pack` | Card packs | looseCards | packs | cardsPerPack | cardsTotal | collecting |
| `minecraft.blocks` | Block building | startingBlocks | layers | blocksPerLayer | blocksTotal | creative mode |
| `robot.odometer` | Small robot on a mission | metersAtStart | trips | metersPerTrip | metersTotal | coding/robotics (Sphero) |
| `cupcake.party` | Bake workshop | bakedAlready | trays | piecesPerTray | piecesTotal | food, but not fruit |
| `aquarium.fish` | Aquarium | fishAtStart | tanks | fishPerTank | fishTotal | pets |
| `superhero.rescue` | Hero rescue mission | rescuedAtStart | buildings | rescuedPerBuilding | rescuedTotal | hero stories |

### Years 5–7

| Theme ID | Context | base | count | unitValue | total | Why it lands |
|---|---|---|---|---|---|---|
| `gaming.skin-bundle` | Game shop | startingCredit | skinPacks | pricePerPack | creditTotal | Robux/V-Bucks economy |
| `creator.followers` | (existing) | startingFollowers | promotedPosts | followersPerPost | finalFollowers | already in repo |
| `scooter.ride` | E-scooter | startFee | minutes | pricePerMinute | priceTotal | everyday transport |
| `football.card-collection` | Football cards | cardsAtStart | packs | cardsPerPack | cardsTotal | Panini/collector |
| `streaming.watchtime` | Series marathon | episodesWatched | seasons | episodesPerSeason | episodesTotal | Netflix/Twitch |
| `paper-round` | Paper route | bonusPerRoute | customers | kronerPerCustomer | payTotal | first jobs |
| `tiktoker.challenge` | Dance challenge | viewersAtStart | videos | viewersPerVideo | viewersTotal | creator economy |
| `esports.team-points` | Esports tournament | groupStagePoints | matches | pointsPerMatch | pointsTotal | gaming |

### Years 8–10

| Theme ID | Context | base | count | unitValue | total | Why it lands |
|---|---|---|---|---|---|---|
| `gym.sets-reps` | Training | barWeight | sets | kgPerSet | totalWeight | training/apps |
| `job.shift-pay` | Part-time job | fixedBonus | hours | payPerHour | payTotal | summer job |
| `car.charging` | EV charging | batteryAtStart | sessions | percentPerSession | batteryTotal | sustainability/tech |
| `phone.subscription` | Mobile plan | fixedFee | GB | kronerPerGB | priceTotal | own phone |
| `influencer.sponsored` | Sponsored posts | flatFee | posts | clicksPerPost | clicksTotal | media literacy |
| `climate.co2-budget` | CO₂ accounting | baselineEmissions | flights | emissionsPerFlight | emissionsTotal | climate engagement |
| `festival.budget` | Festival budget | ticket | days | kronerPerDay | costTotal | festival season |
| `startup.users` | App beta | usersAtStart | growthCampaigns | usersPerCampaign | usersTotal | tech entrepreneurship |

### 1P / 1T (vg.)

| Theme ID | Context | Fits families | Why it lands |
|---|---|---|---|
| `student.loan` | Student loan and interest | exponential growth, growth factor | student economy |
| `housing.mortgage` | Mortgage | exponential, linear amortization | adult life |
| `parttime.tax` | Tax on wages | percent, linear model | payslip |
| `epidemic.growth` | Disease spread | exponential, derivation | current events, 1T |
| `battery.degradation` | Battery capacity over time | exponential decay, percent | tech/sustainability |
| `podcast.downloads` | Downloads per episode | linear + exponential growth | creator economy |
| `stock.market` | Share price and average rate of change | linear, percent, derivative | finance |
| `uranium.decay` | Radioactive decay (physics) | exponential | cross-curricular science |

## 3. Coverage grid (grade × knowledge area × target family count)

| Grade | Numbers | Algebra | Geometry | Functions | Statistics/prob. |
|---|---|---|---|---|---|
| 1–2 | 3–4 (sum, take-away) | 1 (patterns) | 1–2 (measurement) | – | – |
| 3–4 | 3 (grouping, division) | 2 (patterns, two-way expressions) | 2 (area, volume counting) | – | – |
| 5–7 | 4 (fraction, decimal, percent) | 3 (equations, inequalities ⚠️) | 3 (circumference, area, scale) | 1 (table→rule) | 2 (probability as fraction, central tendency ⚠️) |
| 8–10 | 2 (powers ⚠️) | 5 (linear, quadratic ⚠️, system ⚠️, comparison) | 3 (Pythagoras ⚠️, similarity, volume) | 4 (linear, exponential ⚠️, quadratic ⚠️, rational ⚠️) | 2 (growth-factor model, simulation ⚠️) |
| 1P | 2 (permille, standard form ⚠️) | 2 (formulas, proportionality ⚠️) | 1 (compound units) | 3 (linear, exponential, modelling) | 2 (statistics from text) |
| 1T | 2 (root expressions ⚠️) | 5 (identities, polynomial division ⚠️, quadratic) | 3 (trig ⚠️, area rule ⚠️, Pythagoras) | 6 (polynomial, rational, exponential, power, derivative ⚠️, rate ⚠️) | 1 (data exploration) |

⚠️ = requires grammar extension beyond `+ * =` (subtraction, division,
exponent, function calls, relation operators, multiple equations).

## 4. Recommended rollout order

1. **Now (no grammar change):** fill out `count * unitValue` and
   `base + count * unitValue` with all four roles hidden in turn, plus the
   full theme bank above — immediately yields many DSLs per grade with the
   existing engine.
2. **Grammar step 1:** subtraction and comparison (`a = b + diff`) → full
   years 1–2 coverage and year-7 comparisons.
3. **Grammar step 2:** fraction/percent factors as `unitValue` (multiplicative
   scalars, not only integers) → years 5–7 percent/fractions.
4. **Grammar step 3:** exponent → exponential growth (year 10, 1P, 1T).
5. **Grammar step 4:** equation systems → year 10 systems.
6. Each step: golden-master fixtures in canonical format + at least one
   theme per grade band from the tables above.
