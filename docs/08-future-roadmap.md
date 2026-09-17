# Roadmap after Phase 1

This is architectural context only. Implementation planning, estimates, and detailed work items apply exclusively to `07-phase-1-plan.md`.

## Representation breadth

Introduce bar diagrams, tables, Cartesian graphs, geometry diagrams, functions, and optionally code-like representations as additional nodes/edges in the representation graph. Rich math entry (for example MathLive) can attach to the academic-notation edge. Maintain shared semantic identities across views.

## Mathematical concept breadth

Extend the AST and concept composition with subtraction/division, ratios, percentages, linear functions, simultaneous equations, geometry, powers, exponential growth, and eventually other branches. Let each concept declare generation constraints, supported representations, normalization/checking policies, and diagnostics. Expand test generators together with mathematical capabilities.

## Diagnostics and equivalence

Evolve dimensional analysis and error taxonomy. A symbolic math adapter such as Compute Engine may test equivalence beyond bounded arithmetic; semantic role preservation and the requested structure remain independent assessment criteria. Add explainable counterexamples that show the real-world implication of a learner's model.

## Personalization

Track progress at each transformation edge (story -> quantity, quantity -> named equation, named -> academic, reverse edges, etc.). Use repeated observations to suggest practice and scaffolding. Keep scoring descriptive and uncertainty-aware; establish educational efficacy through evaluation rather than assumptions.

## Generative scenarios

Add richer deterministic grammar templates and, optionally, an LLM story adapter driven by locked mathematical facts plus a user-selected interest pack. Validate that generated text faithfully preserves quantities, relationships, assumptions and unknown role before presenting it.

## Game shells

Expose the same puzzle engine to different skins: procedural encounter chains, city exploration, creator progression, crafting/building, or mystery. Gameplay progression consumes the puzzle use-cases and their event/result model; thematic UI remains a replaceable presentation layer.

## Delivery and research

Investigate mobile and keyboard accessibility, user testing, telemetry with consent, educator-facing tooling, localization, and educational studies once the graybox loop demonstrates acceptable usability. Treat these as separate design decisions with explicit validation work.
