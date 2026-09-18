import fc from 'fast-check';
import { expect, test } from 'vitest';

import type { Expression, Relation } from '../problem-model/expression';
import { namedEquationStructurePolicy, relationsHaveNormalizedStructure } from '../problem-model/normalized-structure';
import {
  defaultTotalFromPartsGenerationConfig,
  generateTotalFromPartsCase,
} from '../problem-generation/generate-total-from-parts';
import { renderCreatorFollowersStory } from './creator-followers/render-story';
import {
  bindCreatorFollowersAnswerKey,
  bindCreatorFollowersScenario,
  planCreatorFollowersStory,
} from './creator-followers/scenario';
import { renderDronePowerStory } from './gaming-drone-power/render-story';
import {
  bindDronePowerAnswerKey,
  bindDronePowerScenario,
  planDronePowerStory,
} from './gaming-drone-power/scenario';

test('scenario and locale choices preserve generated mathematics across seeds', () => {
  fc.assert(
    fc.property(fc.integer({ min: 0, max: 1_000_000 }), (seed) => {
      const gamingCase = generateTotalFromPartsCase({
        seed,
        config: defaultTotalFromPartsGenerationConfig,
      });
      const creatorCase = generateTotalFromPartsCase({
        seed,
        config: {
          ...defaultTotalFromPartsGenerationConfig,
          scenarioId: 'creator.followers',
        },
      });

      expect(creatorCase.answerKey).toEqual(gamingCase.answerKey);
      expect(creatorCase.problem).toEqual({
        ...gamingCase.problem,
        scenarioId: 'creator.followers',
      });

      const gaming = bindDronePowerScenario(gamingCase.problem);
      const creator = bindCreatorFollowersScenario(creatorCase.problem);
      const gamingAnswer = bindDronePowerAnswerKey(gamingCase.answerKey, gaming);
      const creatorAnswer = bindCreatorFollowersAnswerKey(
        creatorCase.answerKey,
        creator,
      );

      expect(
        relationsHaveNormalizedStructure(
          gamingCase.problem.relation,
          restoreSourceIds(gaming.problem.relation, gaming.facts),
          namedEquationStructurePolicy,
        ),
      ).toBe(true);
      expect(
        relationsHaveNormalizedStructure(
          creatorCase.problem.relation,
          restoreSourceIds(creator.problem.relation, creator.facts),
          namedEquationStructurePolicy,
        ),
      ).toBe(true);
      expect(valuesByRole(gaming.facts, gamingAnswer.bindings)).toEqual(
        valuesByRole(creator.facts, creatorAnswer.bindings),
      );

      const gamingPlan = planDronePowerStory(gaming, seed);
      const creatorPlan = planCreatorFollowersStory(creator, seed);
      const gamingProblemBeforeLocale = structuredClone(gaming.problem);
      const creatorProblemBeforeLocale = structuredClone(creator.problem);

      for (const locale of ['en', 'nb'] as const) {
        renderDronePowerStory(gaming, gamingPlan, locale);
        renderCreatorFollowersStory(creator, creatorPlan, locale);
      }

      expect(gaming.problem).toEqual(gamingProblemBeforeLocale);
      expect(creator.problem).toEqual(creatorProblemBeforeLocale);
      expect(planDronePowerStory(gaming, seed)).toEqual(gamingPlan);
      expect(planCreatorFollowersStory(creator, seed)).toEqual(creatorPlan);
    }),
    { numRuns: 100 },
  );
});

type ScenarioFact = {
  id: string;
  sourceId: string;
  role: string;
};

function restoreSourceIds(
  relation: Relation,
  facts: readonly ScenarioFact[],
): Relation {
  const sourceIds = new Map(facts.map((fact) => [fact.id, fact.sourceId]));

  return {
    kind: 'equation',
    left: restoreExpressionSourceIds(relation.left, sourceIds),
    right: restoreExpressionSourceIds(relation.right, sourceIds),
  };
}

function restoreExpressionSourceIds(
  expression: Expression,
  sourceIds: ReadonlyMap<string, string>,
): Expression {
  switch (expression.kind) {
    case 'literal':
      return expression;
    case 'quantity':
      return {
        kind: 'quantity',
        id: sourceIds.get(expression.id) ?? expression.id,
      };
    case 'add':
    case 'multiply':
      return {
        kind: expression.kind,
        left: restoreExpressionSourceIds(expression.left, sourceIds),
        right: restoreExpressionSourceIds(expression.right, sourceIds),
      };
  }
}

function valuesByRole(
  facts: readonly ScenarioFact[],
  bindings: Readonly<Record<string, number>>,
): Readonly<Record<string, number | undefined>> {
  return Object.fromEntries(
    facts.map((fact) => [fact.role, bindings[fact.id]]),
  );
}
