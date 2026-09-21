import { expect, test } from 'vitest';
import {
  defaultTotalFromPartsGenerationConfig,
  generateTotalFromPartsCase,
} from '../problem-generation/generate-total-from-parts';
import { serializeProblem } from '../problem-dsl';
import {
  composePuzzle,
  createNamedEquationChoices,
  presentTheme,
  submitPuzzle,
  type PuzzleScreen,
} from './compose-puzzle';
import { createNamedEquationChoiceSeeds } from './modes/named-equation-choices';
import { modes, modeIds } from './modes';
import { relationsHaveNormalizedStructure } from '../problem-model/normalized-structure';
import { namedEquationStructurePolicy } from '../problem-model/normalized-structure';
import { themes, themeIds } from '../themes';
import type { PuzzleLocale } from './lang';
import { substituteVisibleValues } from '../representations/substitute-visible-values';
import { createAcademicSymbolMap } from '../representations/academic-symbol-map';

const locales: readonly PuzzleLocale[] = ['en', 'nb'];

function generateCase() {
  return generateTotalFromPartsCase({
    seed: 321,
    config: defaultTotalFromPartsGenerationConfig,
  });
}

test('one canonical Problem, DSL, and answer key serve every theme and mode in both locales', () => {
  const generated = generateCase();
  const problemBefore = structuredClone(generated.problem);
  const dslBefore = serializeProblem(generated.problem);
  let composedCount = 0;
  for (const themeId of themeIds) {
    for (const locale of locales) {
      for (const modeId of modeIds) {
        const screen = composePuzzle({
          problem: generated.problem,
          themeId,
          modeId,
          locale,
        });
        composedCount += 1;
        expect(screen.screen.modeId).toBe(modeId);
        expect(screen.context.themeId).toBe(themeId);
        expect(screen.context.locale).toBe(locale);
        expect(screen.context.replay?.seed).toBe(321);
        expect(screen.context.story.length).toBeGreaterThan(0);
        expect(
          screen.context.quantities.filter(
            (quantity) => quantity.given.kind === 'hidden',
          ),
        ).toHaveLength(1);
        expect(JSON.stringify(screen)).not.toContain(
          `"value":${generated.answerKey.bindings.unitValue}`,
        );
        const hidden = screen.context.quantities.find(
          (quantity) => quantity.given.kind === 'hidden',
        );
        expect(hidden?.displayValue).toBe('?');
        expect(hidden?.id).toBe('unitValue');
      }
    }
  }
  expect(generated.problem).toEqual(problemBefore);
  expect(serializeProblem(generated.problem)).toBe(dslBefore);
  expect(composedCount).toBe(2 * 4 * 2);
  expect(generated.problem).not.toHaveProperty('academicSymbols');
  expect(dslBefore).not.toContain('academic-symbol');
});

test('mode state depends only on the canonical Problem and locale', () => {
  const generated = generateCase();
  for (const locale of locales) {
    for (const modeId of modeIds) {
      const { state } = modes[modeId].start({
        problem: generated.problem,
        locale,
      });
      expect(JSON.stringify(state)).not.toContain('theme');
      switch (state.modeId) {
        case 'story-to-quantities':
          expect([...state.target.quantityIds]).toEqual(
            generated.problem.quantities.map((quantity) => quantity.id),
          );
          break;
        case 'quantities-to-named-equation':
          expect([...state.source.quantityIds]).toEqual(
            generated.problem.quantities.map((quantity) => quantity.id),
          );
          break;
        case 'named-equation-to-academic-notation':
          expect(state.source.relation).toEqual(
            substituteVisibleValues(generated.problem),
          );
          expect(state.target.symbols).toEqual(
            createAcademicSymbolMap(generated.problem),
          );
          break;
        case 'academic-notation-to-named-equation':
          expect(state.source.relation).toEqual(
            substituteVisibleValues(generated.problem),
          );
          expect(state.source.symbols).toEqual(
            createAcademicSymbolMap(generated.problem),
          );
          break;
      }
    }
  }
});

test('composition is order-independent: mode first, then theme', () => {
  const generated = generateCase();
  for (const themeId of themeIds) {
    for (const modeId of modeIds) {
      for (const locale of locales) {
        const modeFirstState = modes[modeId].start({
          problem: generated.problem,
          locale,
        });
        const screen = composePuzzle({
          problem: generated.problem,
          themeId,
          modeId,
          locale,
        });
        expect(modeFirstState.state.modeId).toBe(screen.screen.modeId);
        const presentation = presentTheme(
          themeId,
          generated.problem,
          locale,
          321,
        );
        expect(screen.context.story).toBe(presentation.story.text);
        expect(screen.context.quantities.map((quantity) => quantity.id)).toEqual(
          presentation.facts.map((fact) => fact.canonicalId),
        );
        expect(composePuzzle({
          problem: generated.problem,
          themeId,
          modeId,
          locale,
        })).toEqual(screen);
      }
    }
  }
});

test('both themes present the exact same canonical relation and bindings by role', () => {
  const generated = generateCase();
  const byRole = (themeId: (typeof themeIds)[number], locale: PuzzleLocale) => {
    const presentation = presentTheme(themeId, generated.problem, locale, 321);
    return presentation.facts.map((fact) => ({
      role: fact.role,
      visibility: fact.visibility,
      value: fact.value,
      canonicalId: fact.canonicalId,
    }));
  };
  for (const locale of locales) {
    expect(byRole('creator.followers', locale)).toEqual(
      byRole('gaming.drone-power', locale),
    );
  }
});

test('named-equation choice relations are canonical and identical across themes', () => {
  const generated = generateCase();
  const seeds = createNamedEquationChoiceSeeds(generated.problem);
  expect(seeds.map((seed) => seed.id)).toEqual([
    'matching',
    'factor-into-group',
    'add-instead-of-multiply',
  ]);
  const matching = seeds.find((seed) => seed.id === 'matching');
  expect(matching?.relation).toEqual(generated.problem.relation);
  const distractor = seeds.find((seed) => seed.id === 'factor-into-group');
  expect(distractor).toBeDefined();
  expect(
    relationsHaveNormalizedStructure(
      generated.problem.relation,
      distractor!.relation,
      namedEquationStructurePolicy,
    ),
  ).toBe(false);
  for (const locale of locales) {
    for (const themeId of themeIds) {
      const choices = createNamedEquationChoices(
        generated.problem,
        presentTheme(themeId, generated.problem, locale, 321),
      );
      expect(choices.map((choice) => choice.relation)).toEqual(
        seeds.map((seed) => seed.relation),
      );
      expect(new Set(choices.map((choice) => choice.label)).size).toBe(
        choices.length,
      );
    }
  }
});

test('the same story and problem serve both modes and both input providers', () => {
  const generated = generateCase();
  const problemBefore = structuredClone(generated.problem);
  const storyScreen: PuzzleScreen = composePuzzle({
    problem: generated.problem,
    themeId: 'gaming.drone-power',
    modeId: 'story-to-quantities',
    locale: 'en',
  });
  const namedScreen = composePuzzle({
    problem: generated.problem,
    themeId: 'gaming.drone-power',
    modeId: 'quantities-to-named-equation',
    locale: 'en',
  });
  expect(namedScreen.context.story).toBe(storyScreen.context.story);
  const textSubmission = submitPuzzle({
    problem: generated.problem,
    themeId: 'gaming.drone-power',
    modeId: 'quantities-to-named-equation',
    locale: 'en',
    answer: { kind: 'text', input: 'totalPower = basePower + droneCount * dronePower' },
  });
  expect(textSubmission.feedback?.kind).toBe('accepted');
  expect(textSubmission.context.story).toBe(storyScreen.context.story);
  const distractor = createNamedEquationChoiceSeeds(generated.problem).find(
    (seed) => seed.id === 'factor-into-group',
  );
  const choiceSubmission = submitPuzzle({
    problem: generated.problem,
    themeId: 'gaming.drone-power',
    modeId: 'quantities-to-named-equation',
    locale: 'en',
    answer: {
      kind: 'relation-choice',
      choiceId: 'factor-into-group',
      label: 'distractor',
      relation: distractor!.relation,
    },
  });
  expect(choiceSubmission.feedback?.kind).toBe('misconception');
  expect(choiceSubmission.context.story).toBe(storyScreen.context.story);
  expect(choiceSubmission.submission).toMatchObject({
    kind: 'named-equation',
    answerKind: 'relation-choice',
    choiceId: 'factor-into-group',
  });
  const textOnlySubmission = submitPuzzle({
    problem: generated.problem,
    themeId: 'gaming.drone-power',
    modeId: 'quantities-to-named-equation',
    locale: 'en',
    answer: { kind: 'text', input: 'totalPower = basePower + droneCount * dronePower' },
  });
  expect(textOnlySubmission.submission).toMatchObject({
    kind: 'named-equation',
    answerKind: 'text',
  });
  expect(textOnlySubmission.submission).not.toHaveProperty('choiceId');
  expect(generated.problem).toEqual(problemBefore);
});
