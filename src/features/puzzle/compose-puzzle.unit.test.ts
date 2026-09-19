import { expect, test } from 'vitest';
import {
  defaultTotalFromPartsGenerationConfig,
  generateTotalFromPartsCase,
} from '../problem-generation/generate-total-from-parts';
import { composePuzzle } from './compose-puzzle';
import { createNamedEquationChoices } from './modes/named-equation-choices';
import { modes } from './modes';
import type { PuzzleScreen } from './modes/mode';
import { skins, skinIds } from '../skins';
import type { PuzzleLocale } from './lang';

const locales: readonly PuzzleLocale[] = ['en', 'nb'];
const modeIds = ['story-to-quantities', 'quantities-to-named-equation'] as const;


test('one canonical Problem, DSL, and answer key serve every skin and mode in both locales', () => {
  const generated = generateTotalFromPartsCase({
    seed: 321,
    config: defaultTotalFromPartsGenerationConfig,
  });
  for (const skinId of skinIds) {
    for (const locale of locales) {
      for (const modeId of modeIds) {
        const screen = composePuzzle({
          problem: generated.problem,
          skinId,
          modeId,
          locale,
        });
        expect(screen.screen.modeId).toBe(modeId);
        expect(screen.context.skinId).toBe(skinId);
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
      }
    }
  }
});

test('skin and mode composition is order-independent', () => {
  const generated = generateTotalFromPartsCase({
    seed: 321,
    config: defaultTotalFromPartsGenerationConfig,
  });
  for (const skinId of skinIds) {
    for (const modeId of modeIds) {
      for (const locale of locales) {
        const skinFirst = composePuzzle({
          problem: generated.problem,
          skinId,
          modeId,
          locale,
        });
        const modeFirst = modes[modeId].start({
          problem: generated.problem,
          skin: skins[skinId].present({
            problem: generated.problem,
            locale,
            storySeed: 321,
          }),
          locale,
          replay: generated.problem.replay,
        });
        expect(modeFirst).toEqual(skinFirst);
      }
    }
  }
});

test('both skins present the exact same canonical relation and bindings by role', () => {
  const generated = generateTotalFromPartsCase({
    seed: 321,
    config: defaultTotalFromPartsGenerationConfig,
  });
  const byRole = (skinId: (typeof skinIds)[number], locale: PuzzleLocale) => {
    const presentation = skins[skinId].present({
      problem: generated.problem,
      locale,
      storySeed: 321,
    });
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

test('named-equation choices share canonical math across skins and locales', () => {
  const generated = generateTotalFromPartsCase({
    seed: 321,
    config: defaultTotalFromPartsGenerationConfig,
  });
  for (const skinId of skinIds) {
    for (const locale of locales) {
      const skin = skins[skinId].present({
        problem: generated.problem,
        locale,
        storySeed: 321,
      });
      const choices = createNamedEquationChoices(
        generated.problem.relation,
        skin,
      );
      expect(choices.map((choice) => choice.id)).toEqual([
        'matching',
        'base-per-item',
      ]);
      const matching = choices.find((choice) => choice.id === 'matching');
      expect(matching?.relation).toEqual(generated.problem.relation);
      for (const choice of choices) {
        if (choice.id === 'matching') {
          continue;
        }
        expect(choice.relation).not.toEqual(generated.problem.relation);
        expect(choice.label).not.toBe(matching?.label);
      }
    }
  }
});

test('the same story text serves both modes and both input modes', () => {
  const generated = generateTotalFromPartsCase({
    seed: 321,
    config: defaultTotalFromPartsGenerationConfig,
  });
  const screenOf = (
    modeId: (typeof modeIds)[number],
  ): PuzzleScreen =>
    composePuzzle({
      problem: generated.problem,
      skinId: 'gaming.drone-power',
      modeId,
      locale: 'en',
    });
  const storyScreen = screenOf('story-to-quantities');
  const namedScreen = screenOf('quantities-to-named-equation');
  expect(storyScreen.context.story).toBe(namedScreen.context.story);
  const textSubmission = modes['quantities-to-named-equation'].submit({
    problem: generated.problem,
    skin: skins['gaming.drone-power'].present({
      problem: generated.problem,
      locale: 'en',
      storySeed: 321,
    }),
    locale: 'en',
    replay: generated.problem.replay,
    answer: { kind: 'text', input: 'total = base + count * unitValue' },
  });
  expect(textSubmission.context.story).toBe(storyScreen.context.story);
});
