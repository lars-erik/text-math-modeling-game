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

export type StoryCandidateSeed = {
  id: string;
  optionPosition: number;
  relation: Relation;
};

export function createStoryCandidateSeeds(
  problem: Problem,
): readonly StoryCandidateSeed[] {
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
  const candidates: { id: string; relation: Relation }[] = [
    { id: 'matching', relation: problem.relation },
  ];
  for (const distractor of distractors) {
    const isEquivalent = candidates.some((candidate) =>
      relationsHaveNormalizedStructure(
        candidate.relation,
        distractor.relation,
        namedEquationStructurePolicy,
      ),
    );
    if (!isEquivalent) {
      candidates.push(distractor);
    }
  }
  return candidates.map((candidate, index) => ({
    id: candidate.id,
    optionPosition: index,
    relation: candidate.relation,
  }));
}
