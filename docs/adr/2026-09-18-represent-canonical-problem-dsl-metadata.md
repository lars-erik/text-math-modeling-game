# Represent canonical problem DSL metadata without answer keys

## Status

Superseded in part by `2026-09-19-compose-problem-skin-mode-independently.md`.

## Context and problem statement

The Milestone 4 canonical DSL names a problem, concepts, quantity dimensions,
a scenario, and academic symbols. The existing `Problem` model only carried
quantities, their puzzle roles, a relation, and mandatory generator replay
data. Parsing the documented fixture into that type would either discard DSL
data or invent generator data that a hand-authored problem does not have.

The problem exposed to a learner must also remain safe to serialize. Complete
numeric bindings, including the hidden value, belong to the separate
`AnswerKey` and must not become DSL metadata.

## Decision drivers

- The documented DSL fixture must round-trip without losing supported data.
- Canonical identity must not depend on locale-specific names or story text.
- Existing hand-built puzzle behavior must continue while the domain contract
  grows toward generated and manually authored problems sharing one API.
- Replay must distinguish generated problems from hand-authored problems
  without fabricated defaults.
- Milestone 4 should not introduce story resources, generation configuration,
  or a general dimension algebra ahead of their milestones.

## Considered options

1. Keep metadata only in the DSL parse tree and leave `Problem` unchanged.
2. Store metadata on `Problem`, require replay for every problem, and invent a
   replay record when parsing a hand-authored fixture.
3. Store the canonical fixture metadata on `Problem`, keep replay optional,
   and keep private answer bindings in `AnswerKey` only.

## Decision outcome

Use option 3.

> Historical note: the scenario-related and academic-presentation portions of this decision are superseded. Canonical `Problem`/DSL no longer owns Skin/scenario identity, theme-shaped names/dimensions, or academic presentation symbols. The separate AnswerKey and optional mathematical replay decisions below remain valid.

The original decision stated that `Problem` required a canonical problem ID, ordered concept IDs, quantities,
the relation, a canonical scenario ID, and an academic-symbol map. Each
quantity requires a canonical ID, a minimal Phase 1 dimension, and its
learner-visible known/hidden state. IDs and dimensions are language-independent
tokens. Localized display names, units, story fragments, and learner name maps
remain outside the problem's mathematical identity.

Generator replay is optional metadata. The DSL omits replay when a problem has
none and serializes an explicit replay block when it is present; parsing never
creates a seed or generator version. The existing puzzle role is retained as
optional transitional metadata so current screens can preserve their behavior.
When present, the DSL serializer must encode it explicitly rather than discard
it.

The initial dimension vocabulary is the smallest set exercised by Phase 1:
`item`, `power`, `powerPerItem`, and `scalar`. Dimensional compatibility rules,
localized labels and units, scenario role maps, generator configuration, and
story plans remain reserved for later milestones.

The public problem DSL never contains `AnswerKey.bindings`. Known quantity
values are serialized because they are learner-visible facts; the hidden value
is represented only as `?`.

## Consequences

- Hand-authored and generated problems use the same `Problem` type.
- The historical fixture round-tripped its then-supported metadata without depending on a locale; the current canonical fixture is additionally Skin/theme-independent.
- Generated problems can retain exact replay data without forcing fabricated
  replay metadata onto authored problems.
- Serializing or logging a `Problem` cannot reveal a hidden answer binding.
- A later milestone may replace the transitional quantity role with an
  explicit scenario role map, but that expansion is not required for the
  canonical Milestone 4 fixture.
