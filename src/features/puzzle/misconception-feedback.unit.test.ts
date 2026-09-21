import { expect, test } from 'vitest';
import { totalFromPartsProblem } from '../problem-model/total-from-parts.fixture';
import { classifyMisconception } from '../problem-model/misconception';
import { parseNamedRelation } from '../named-expression';
import { parseAcademicRelation } from '../representations/parse-academic-relation';
import { createAcademicSymbolMap } from '../representations/academic-symbol-map';
import { composePuzzle, submitPuzzle } from './compose-puzzle';
import type { Misconception } from '../problem-model/misconception';

const droneNames = {
  basePower: 'base',
  droneCount: 'count',
  dronePower: 'unitValue',
  totalPower: 'total',
} as const;

const creatorNames = {
  startingFollowers: 'base',
  promotedPostCount: 'count',
  followersPerPost: 'unitValue',
  finalFollowers: 'total',
} as const;

const expectedMisconception: Misconception = {
  kind: 'base-applied-per-item',
  baseQuantityId: 'base',
  countQuantityId: 'count',
};

test('named-equation submission returns structured misconception feedback with localized explanation', () => {
  const submission = submitPuzzle({
    problem: totalFromPartsProblem,
    themeId: 'gaming.drone-power',
    modeId: 'quantities-to-named-equation',
    locale: 'en',
    storySeed: 0,
    answer: {
      kind: 'text',
      input: 'totalPower = droneCount * (basePower + dronePower)',
    },
  });
  expect(submission.feedback).toMatchObject({
    kind: 'misconception',
    misconception: expectedMisconception,
    checkPolicy: 'normalized-structure',
    equationSides: 'swappable',
  });
  expect(submission.feedback?.kind).toBe('misconception');
  if (submission.feedback?.kind === 'misconception') {
    expect(submission.feedback.message).toBe(
      'Base power is added once overall. In your equation it is multiplied by the number of drones, so it is applied once per item.',
    );
  }
  expect(
    submission.submission && submission.submission.kind === 'named-equation'
      ? submission.submission.relation
      : undefined,
  ).toEqual({
    kind: 'equation',
    left: { kind: 'quantity', id: 'total' },
    right: {
      kind: 'multiply',
      left: { kind: 'quantity', id: 'count' },
      right: {
        kind: 'add',
        left: { kind: 'quantity', id: 'base' },
        right: { kind: 'quantity', id: 'unitValue' },
      },
    },
  });
  expect(
    submission.screen.modeId === 'quantities-to-named-equation'
      ? submission.screen.input.value
      : undefined,
  ).toBe('totalPower = droneCount * (basePower + dronePower)');
});

test('the same canonical misconception is explained in Norwegian Bokmål', () => {
  const submission = submitPuzzle({
    problem: totalFromPartsProblem,
    themeId: 'gaming.drone-power',
    modeId: 'quantities-to-named-equation',
    locale: 'nb',
    storySeed: 0,
    answer: {
      kind: 'text',
      input: 'totalEffekt = droneAntall * (grunnEffekt + droneEffekt)',
    },
  });
  expect(submission.feedback?.kind).toBe('misconception');
  if (submission.feedback?.kind === 'misconception') {
    expect(submission.feedback.message).toBe(
      'Grunnleggende effekt skal legges til én gang totalt. I likningen din blir det ganget med antall droner, slik at det brukes én gang per enhet.',
    );
  }
});

test('the same misconception kind applies to the creator theme with its own labels', () => {
  const submission = submitPuzzle({
    problem: totalFromPartsProblem,
    themeId: 'creator.followers',
    modeId: 'quantities-to-named-equation',
    locale: 'en',
    storySeed: 0,
    answer: {
      kind: 'text',
      input:
        'finalFollowers = promotedPostCount * (startingFollowers + followersPerPost)',
    },
  });
  expect(submission.feedback).toMatchObject({
    kind: 'misconception',
    misconception: expectedMisconception,
  });
  if (submission.feedback?.kind === 'misconception') {
    expect(submission.feedback.message).toBe(
      'Starting followers is added once overall. In your equation it is multiplied by the number of promoted posts, so it is applied once per item.',
    );
  }
});

test('named and academic syntax converge on the same canonical misconception', () => {
  const named = parseNamedRelation(
    'totalPower = droneCount * (basePower + dronePower)',
    droneNames,
  );
  const academic = parseAcademicRelation(
    'T = n * (b + p)',
    createAcademicSymbolMap(totalFromPartsProblem),
  );
  expect(named.kind).toBe('success');
  expect(academic.kind).toBe('success');
  if (named.kind !== 'success' || academic.kind !== 'success') {
    return;
  }
  expect(academic.relation).toEqual(named.relation);
  expect(
    classifyMisconception(totalFromPartsProblem.relation, named.relation),
  ).toEqual(
    classifyMisconception(totalFromPartsProblem.relation, academic.relation),
  );
});

test('both named-equation Modes reuse the same semantic classifier', () => {
  const answer = {
    kind: 'text' as const,
    input: 'totalPower = droneCount * (basePower + dronePower)',
  };
  const fromQuantities = submitPuzzle({
    problem: totalFromPartsProblem,
    themeId: 'gaming.drone-power',
    modeId: 'quantities-to-named-equation',
    locale: 'en',
    storySeed: 0,
    answer,
  });
  const fromAcademic = submitPuzzle({
    problem: totalFromPartsProblem,
    themeId: 'gaming.drone-power',
    modeId: 'academic-notation-to-named-equation',
    locale: 'en',
    storySeed: 0,
    answer,
  });
  expect(fromQuantities.feedback?.kind).toBe('misconception');
  expect(fromAcademic.feedback?.kind).toBe('misconception');
  expect(fromQuantities.feedback).toEqual(fromAcademic.feedback);
});

test('reversed outer multiplication gets the same misconception feedback', () => {
  const submission = submitPuzzle({
    problem: totalFromPartsProblem,
    themeId: 'gaming.drone-power',
    modeId: 'quantities-to-named-equation',
    locale: 'en',
    storySeed: 0,
    answer: {
      kind: 'text',
      input: 'totalPower = (basePower + dronePower) * droneCount',
    },
  });
  expect(submission.feedback).toMatchObject({
    kind: 'misconception',
    misconception: expectedMisconception,
  });
});

test('unrelated wrong answers keep the generic structural mismatch', () => {
  const submission = submitPuzzle({
    problem: totalFromPartsProblem,
    themeId: 'gaming.drone-power',
    modeId: 'quantities-to-named-equation',
    locale: 'en',
    storySeed: 0,
    answer: {
      kind: 'text',
      input: 'totalPower = basePower + dronePower * droneCount * droneCount',
    },
  });
  expect(submission.feedback?.kind).toBe('structural-mismatch');
});

test('the creator theme learner names resolve to the same canonical distractor', () => {
  const parsed = parseNamedRelation(
    'finalFollowers = promotedPostCount * (startingFollowers + followersPerPost)',
    creatorNames,
  );
  expect(parsed.kind).toBe('success');
  if (parsed.kind !== 'success') {
    return;
  }
  expect(
    classifyMisconception(totalFromPartsProblem.relation, parsed.relation),
  ).toEqual(expectedMisconception);
});
