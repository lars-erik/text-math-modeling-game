# Localize stories and learner variable names with resource maps

## Status

Accepted

## Context and problem statement

The mathematical problem, answer key, and checking rules must remain identical across languages, while learner-facing stories, quantity labels, variable names, units, prompts, and feedback need localization. Scenario stories should also be generated compositionally from reusable sentence parts and nouns rather than maintained as one complete translated string per problem.

Using localized variable names directly as AST identity would make parsing, replay, fixtures, and semantic comparison language-dependent. Keeping prose templates embedded in scenario code would scatter translations and grammatical rules across production logic.

The desired authoring model follows the Bellissima-style localization pattern: one language module per locale, each exporting the same nested dictionary shape.

## Decision drivers

- Mathematical identity, answer keys, and replayable generation must be language-independent.
- Learners should see and enter natural variable names in their selected language.
- Story generation needs reusable localized sentence fragments and noun forms.
- Translation files should be easy to compare, review, and extend independently.
- Missing localization keys should be detectable by types/tests rather than discovered in the browser.
- Switching language must not silently change the selected mathematical or narrative structure.

## Considered options

1. Use canonical/English variable names and stories in every language.
2. Store complete translated story strings and localized variable names directly on each generated problem.
3. Keep canonical semantic IDs and deterministic story-plan keys, then resolve learner-facing names and prose through same-shaped per-locale resource maps.

## Decision outcome

Use option 3.

Canonical `QuantityId` values, mathematical ASTs, answer keys, scenario role mappings, and story-plan keys remain locale-independent. A named-expression parser receives the active locale's variable-name resolver and maps learner-facing names back to canonical quantity IDs before semantic checking. The canonical DSL/debug format continues to use canonical IDs. Academic symbol mappings remain a separate concern.

Each scenario stores language resources in separate modules such as:

```text
features/scenarios/gaming-drone-power/
  scenario.ts
  lang/
    en.ts
    nb.ts
    index.ts
```

Every locale module implements the same typed nested resource map. Phase 1 resources include stable keys for localized quantity variable names/labels, noun forms, unit text, and semantic sentence fragments/questions. Generic puzzle UI strings use equivalent feature-level locale maps instead of being copied into each scenario.

Story generation is split into two deterministic steps:

```text
validated facts + scenario + seed
        -> StoryPlan(fragment keys, noun keys, fact references)
        -> locale resource map + interpolation
        -> rendered story
```

The seeded selection step chooses semantic fragment keys, not localized array indexes. Locale rendering therefore changes wording but preserves the selected story plan. Resource templates interpolate validated fact-ledger values and formatted noun/unit forms; they do not contain independent arithmetic or hidden answer data.

Phase 1 proves this contract with `en` and `nb`. Resource maps are checked for key/schema parity, representative stories are approval-tested in both languages, and localized named equations are tested to resolve to the same canonical AST. Exact rendered replay records locale wherever text reproduction depends on it, while locale remains outside mathematical generation.

## Consequences

- Scenario and mathematical code do not branch on language.
- Learner-facing variable names can be translated without changing semantic IDs or DSL fixtures.
- New languages require a complete same-shaped resource module and corresponding reviewed approvals.
- Supporting languages with richer grammatical requirements may require expanding the shared noun/grammar resource schema for all locales.
- Story variation remains deterministic across languages at the semantic-key level, even when translated sentence wording differs.
- Localization becomes a Phase 1 architecture boundary rather than a post-graybox concern.
