# Research: Norwegian mathematics curriculum mapping (grunnskole + videregående)

> Research base for populating the DSL/theme catalog: which mathematical
> families, competence aims and example word problems map to each grade level
> and knowledge area. Compiled 19 September 2026 from Udir primary sources.

## Summary

- The grunnskole mathematics curriculum was renewed (MAT01-06, in force
  1 August 2026) with a stronger emphasis on calculation fluency. The five
  knowledge areas run through the whole school: **numbers and number sense,
  algebra, geometry, functions, statistics and probability**.
- Videregående: 1P (MAT08-01) is unchanged and practically oriented.
  T-track mathematics was restructured: the new **Mathematics T** plan
  (MAT09-02, in force 1.8.2026) covers old 1T plus most former R1 content
  (derivative, polynomial division, trigonometry). The old 2T (MAT5-02) was
  retired in 2016 and folded into R1. From 1.8.2027 the S subjects are
  replaced by **Mathematics for economics** and **Mathematics for statistics**
  (MAT11-01/MAT11-02).
- Word problems ("tekstoppgaver") are explicitly anchored in the competence
  aims at every level, from «lage og løse problemer fra lek og hverdag»
  (year 2) to «modellere situasjoner … og argumentere for om modellene er
  gyldige» (1T). The product's representation chain
  (story → quantities → named equation → notation) matches the curriculum
  progression 1:1 through the core element *Representasjon og kommunikasjon*
  («oversette mellom matematiske representasjoner og dagligspråket»).
- The implemented family `total = base + count * unitValue` is a classic
  year-8 word problem (taxi start fee + per-km price type).

## Grade-by-grade mapping

| Grade | Competence aim focus (excerpt) | Knowledge areas | Example word problem (type) |
|---|---|---|---|
| 1–2 | Counting forwards/backwards, addition/subtraction in play and daily life, equals sign as relation, patterns, measuring length/mass, clock | numbers, geometry, measurement | "You have 5 cars and get 3 more — how many now?" |
| 3 | Multiplication as counting/grouping, doubling/halving, division, area measurement, coordinate system | numbers, algebra (patterns), geometry | "5 children have 4 apples each — how many altogether?" |
| 4 | Partitive/measurement division, four operations relations, estimation, "create expressions for practical situations", volume, simple algorithms | numbers, algebra, geometry | "24 apples shared evenly among 6 children …"; "find a situation matching 3 · 5 + 2" (two-way translation — exactly the product's mode) |
| 5 | Fractions/decimals/percent, fraction as part of whole and as division, informal equations, probability in games, personal finance, time | numbers, algebra, statistics | "1/4 of a class of 28 are sick — how many are healthy?"; "what is the chance of rolling a six?" |
| 6 | Decimals on the number line, circumference/pi, area/volume, symmetry, congruence mappings, programming figures | numbers, geometry | "A circle has diameter 10 cm — how long is the circumference?" |
| 7 | Percent/negative numbers, order of operations, equations and inequalities, central tendency, tables/diagrams, economy | numbers, algebra, statistics | "A jacket costs 800 kr, discounted 25 % …"; "I think of a number; doubled plus 3 is 11" |
| 8 | Powers/square roots, factorization, generalizing patterns algebraically, expressions with variables, equations/inequalities, function concept | algebra, functions, numbers | "A taxi costs 50 kr to start plus 12 kr per km — write an expression" (= the product's `base + count * unitValue`) |
| 9 | Compound measurement units, similarity, Pythagoras, surface area/volume, statistical representations, spread, probability and simulation | geometry, statistics | "A 5 m ladder stands 3 m from a wall — how high does it reach?"; critiquing media diagrams |
| 10 | Binomial formulas, systems of equations, linear/exponential/quadratic/rational functions, slope, growth factor, interest/loans/credit, modelling, Python | algebra, functions, statistics | "10 000 kr at 3 % interest — how much after 5 years?"; mobile plan A vs. B (system/modelling) |

## Videregående

| Subject | Status | Content / example word problem |
|---|---|---|
| 1P (MAT08-01) | in force | Reading maths in local-community texts, modelling from society/work life, variables, formulas, percent/pp/permille/growth factor, proportionality, compound units, functions, standard form. E.g. "A 150 000 kr loan at 7 % effective interest — what do you owe after a year?" |
| Mathematics T (MAT09-02) | new from 1.8.2026 | Computational thinking/programming, proofs, variables and formulas, equations/systems/inequalities, identity vs. equation vs. expression vs. function, quadratic functions and binomial formulas, modelling, reading mathematical texts, polynomial/rational/exponential/power functions, derivative and rate of change, polynomial division, trigonometry. E.g. "Bacteria double every hour — model the count after t hours"; "a 12 m flagpole casts a 9 m shadow — sun elevation angle?" |
| Old 2T (MAT5-02) | retired 2016 | Content continued in R1 |
| R1/R2 | in force | R1: functions, derivation, trigonometry, vectors. R2: integration, differential equations |
| Mathematics for economics / statistics (MAT11-01/02) | fixed 15.1.2026, from 1.8.2027 | Replaces S1/S2; difficulty between P and R; Udir publishes example exam sets by school start 2027 |

## Sources

| Source | Credibility | Last updated |
|---|---|---|
| [Udir — MAT01-06 curriculum PDF (bokmål)](https://data.udir.no/kl06/v201906/laereplaner-lk20/MAT01-06.pdf?lang=nob) | 5/5 (official regulation) | 08.06.2026 |
| [Udir — MAT01-06, year 9 aims](https://www.udir.no/lk20/mat01-06/kompetansemaal-og-vurdering/kv1028?lang=nob) | 5/5 | 2026 |
| [Udir — MAT01-06, year 10 aims](https://www.udir.no/lk20/mat01-06/kompetansemaal-og-vurdering/kv1029?lang=nob) | 5/5 | 2026 |
| [Udir — mathematics 1P (MAT08-01)](https://www.udir.no/lk20/mat08-01/kompetansemaal-og-vurdering/kv31?lang=nob) | 5/5 | 2020 (unchanged) |
| [Udir — Mathematics T (MAT09-02)](https://www.udir.no/lk20/mat09-02/kompetansemaal-og-vurdering/kv979?lang=nob) | 5/5 | fixed 13.10.2025, in force 01.08.2026 |
| [Udir — curriculum changes overview](https://www.udir.no/laring-og-trivsel/lareplanverket/endringer/) | 5/5 | 16.09.2026 |
| [Udir — S subjects replaced](https://www.udir.no/laring-og-trivsel/lareplanverket/endringer/nye-matematikkfag-s-fagene-erstattes/) | 5/5 | 28.01.2026 |
| [Salaby tekstoppgaver](https://skole.salaby.no/5-7/matematikk/tekstoppgaver), [Matematikkens Verden](https://www.matematikkensverden.no/p/tekstoppgaver.html), [malimo](https://malimo.no/shop/categories/tekstoppgaver), [Utdanningsforskning](https://utdanningsforskning.no/artikler/2014/tekststykker-i-matematikk/) | 3/5 (teaching resources) | - |

## Open questions

- Should the product target the full 13-year progression or focus on the
  algebra/modelling core (roughly years 4–10 plus 1P/1T) where the
  representation chain is strongest?
- Which problem families follow `total-from-parts`: proportionality,
  percent/growth factor, exponential growth, equation systems?
- Where to source approved word problems for MAT09-02 and the 2027 subjects
  once Udir publishes example sets?
