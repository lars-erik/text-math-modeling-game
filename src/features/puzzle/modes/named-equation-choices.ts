import type { Relation } from '../../problem-model/expression';
import type { Problem } from '../../problem-model/problem';
import {
  namedEquationStructurePolicy,
  relationsHaveNormalizedStructure,
} from '../../problem-model/normalized-structure';
import {
  flattenMultiplyToAddRelation,
  regroupRelation,
} from '../../problem-model/structural-distractors';

export type NamedEquationChoiceSeed = {
  id: string;
  relation: Relation;
};

export function createNamedEquationChoiceSeeds(
  problem: Problem,
): readonly NamedEquationChoiceSeed[] {
  const distractors = [
    {
      id: 'factor-into-group',
      relation: regroupRelation(problem.relation),
    },
    {
      id: 'add-instead-of-multiply',
      relation: flattenMultiplyToAddRelation(problem.relation),
    },
  ];
  const seeds: NamedEquationChoiceSeed[] = [
    { id: 'matching', relation: problem.relation },
  ];
  for (const distractor of distractors) {
    const isEquivalent = seeds.some((seed) =>
      relationsHaveNormalizedStructure(
        seed.relation,
        distractor.relation,
        namedEquationStructurePolicy,
      ),
    );
    if (!isEquivalent) {
      seeds.push(distractor);
    }
  }
  return seeds;
}
