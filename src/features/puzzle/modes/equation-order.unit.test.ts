import { expect, test } from 'vitest';
import { parseNamedRelation } from '../../named-expression';
import {
  relationsHaveNormalizedStructure,
  namedEquationStructurePolicy,
} from '../../problem-model/normalized-structure';
import { totalFromPartsProblem } from '../../problem-model/total-from-parts.fixture';
import { academicNotationToNamedEquationMode } from './academic-notation-to-named-equation';
import { namedEquationToAcademicNotationMode } from './named-equation-to-academic-notation';
import { quantitiesToNamedEquationMode } from './quantities-to-named-equation';
import { createNamedEquationChoiceSeeds } from './named-equation-choices';
import type { Problem } from '../../problem-model/problem';

const droneNames = {
  basePower: 'base',
  droneCount: 'count',
  dronePower: 'unitValue',
  totalPower: 'total',
} as const;

function accept(input: string): boolean {
  const parsed = parseNamedRelation(input, droneNames);
  if (parsed.kind !== 'success') {
    throw new Error(`Expected parse success for ${JSON.stringify(input)}.`);
  }
  return relationsHaveNormalizedStructure(
    totalFromPartsProblem.relation,
    parsed.relation,
    namedEquationStructurePolicy,
  );
}

test('#37 accepts the canonical and all commutative permutations with ordered sides', () => {
  expect(accept('totalPower = basePower + droneCount * dronePower')).toBe(true);
  expect(accept('totalPower = basePower + dronePower * droneCount')).toBe(true);
});

test('#37 accepts reversed equation sides', () => {
  expect(accept('basePower + droneCount * dronePower = totalPower')).toBe(true);
  expect(accept('droneCount * dronePower + basePower = totalPower')).toBe(true);
  expect(accept('dronePower * droneCount + basePower = totalPower')).toBe(true);
  expect(accept('basePower + dronePower * droneCount = totalPower')).toBe(true);
});

test('#37 still rejects structurally incorrect models', () => {
  expect(accept('totalPower = droneCount * (basePower + dronePower)')).toBe(false);
  expect(accept('totalPower = basePower + droneCount + dronePower')).toBe(false);
  expect(accept('droneCount * (basePower + dronePower) = totalPower')).toBe(false);
});

const acceptedPermutations = [
  'totalPower = basePower + droneCount * dronePower',
  'totalPower = basePower + dronePower * droneCount',
  'basePower + droneCount * dronePower = totalPower',
  'basePower + dronePower * droneCount = totalPower',
  'droneCount * dronePower + basePower = totalPower',
  'dronePower * droneCount + basePower = totalPower',
];

test('#37 the quantities-to-named-equation mode accepts every valid permutation', () => {
  for (const input of acceptedPermutations) {
    const result = quantitiesToNamedEquationMode.submit({
      problem: totalFromPartsProblem,
      locale: 'en',
      names: droneNames,
      answer: { kind: 'text', input },
    });
    expect(result.feedback?.kind, input).toBe('accepted');
  }
  const rejected = quantitiesToNamedEquationMode.submit({
    problem: totalFromPartsProblem,
    locale: 'en',
    names: droneNames,
    answer: { kind: 'text', input: 'totalPower = droneCount * (basePower + dronePower)' },
  });
  expect(rejected.feedback?.kind).toBe('misconception');
});

test('#37 the academic-notation-to-named-equation mode accepts every valid permutation', () => {
  for (const input of acceptedPermutations) {
    const result = academicNotationToNamedEquationMode.submit({
      problem: totalFromPartsProblem,
      locale: 'en',
      names: droneNames,
      answer: { kind: 'text', input },
    });
    expect(result.feedback?.kind, input).toBe('accepted');
  }
  const rejected = academicNotationToNamedEquationMode.submit({
    problem: totalFromPartsProblem,
    locale: 'en',
    names: droneNames,
    answer: { kind: 'text', input: 'totalPower = basePower + droneCount + dronePower' },
  });
  expect(rejected.feedback?.kind).toBe('structural-mismatch');
});

test('#37 the named-equation-to-academic-notation mode accepts swapped sides', () => {
  const canonical = namedEquationToAcademicNotationMode.submit({
    problem: totalFromPartsProblem,
    locale: 'en',
    names: {},
    answer: { kind: 'text', input: '210 = 30 + 4*p' },
  });
  expect(canonical.feedback?.kind).toBe('accepted');
  const swapped = namedEquationToAcademicNotationMode.submit({
    problem: totalFromPartsProblem,
    locale: 'en',
    names: {},
    answer: { kind: 'text', input: '30 + 4*p = 210' },
  });
  expect(swapped.feedback?.kind).toBe('accepted');
  const regrouped = namedEquationToAcademicNotationMode.submit({
    problem: totalFromPartsProblem,
    locale: 'en',
    names: {},
    answer: { kind: 'text', input: '210 = 4*(30 + p)' },
  });
  expect(regrouped.feedback?.kind).toBe('structural-mismatch');
});

test('#37 distractor choices remain genuinely incorrect under the swappable-sides policy', () => {
  const seeds = createNamedEquationChoiceSeeds(totalFromPartsProblem);
  for (const seed of seeds) {
    const others = seeds.filter((candidate) => candidate.id !== seed.id);
    for (const other of others) {
      expect(
        relationsHaveNormalizedStructure(
          seed.relation,
          other.relation,
          namedEquationStructurePolicy,
        ),
        `${seed.id} must not be equivalent to ${other.id}`,
      ).toBe(false);
    }
  }
  const distractor = seeds.find((seed) => seed.id !== 'matching');
  expect(distractor).toBeDefined();
  const distractorResult = quantitiesToNamedEquationMode.submit({
    problem: totalFromPartsProblem,
    locale: 'en',
    names: droneNames,
    answer: {
      kind: 'relation-choice',
      choiceId: distractor!.id,
      label: 'distractor',
      relation: distractor!.relation,
    },
  });
  expect(distractorResult.feedback?.kind).not.toBe('accepted');
});

test('#37 reversed-sides acceptance is consistent across locales and input methods', () => {
  const norwegianNames = {
    grunnEffekt: 'base',
    droneAntall: 'count',
    droneEffekt: 'unitValue',
    totalEffekt: 'total',
  } as const;
  for (const locale of ['en', 'nb'] as const) {
    const names = locale === 'en' ? droneNames : norwegianNames;
    const input =
      locale === 'en'
        ? 'basePower + droneCount * dronePower = totalPower'
        : 'grunnEffekt + droneAntall * droneEffekt = totalEffekt';
    const result = quantitiesToNamedEquationMode.submit({
      problem: totalFromPartsProblem,
      locale,
      names,
      answer: { kind: 'text', input },
    });
    expect(result.feedback?.kind, locale).toBe('accepted');
  }
});
