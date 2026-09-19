import type { LearnerNameMap } from '../named-expression';
import type { PuzzleLocale } from '../puzzle/lang';
import type {
  Problem,
  QuantityGiven,
  QuantityRole,
} from '../problem-model/problem';
import type { QuantityId } from '../problem-model/expression';

export const themeIds = [
  'gaming.drone-power',
  'creator.followers',
] as const;

export type ThemeId = (typeof themeIds)[number];

export function isThemeId(value: string): value is ThemeId {
  return (themeIds as readonly string[]).includes(value);
}

export type ThemeFact = {
  themeQuantityId: string;
  canonicalId: QuantityId;
  role: QuantityRole;
  visibility: QuantityGiven['kind'];
  value?: number;
  label: string;
  variableName: string;
  unit: string;
};

export type ThemePresentation = {
  themeId: ThemeId;
  locale: PuzzleLocale;
  facts: readonly ThemeFact[];
  story: { text: string; storySeed: number };
  learnerNames: LearnerNameMap;
};

export type Theme = {
  id: ThemeId;
  present: (options: {
    problem: Problem;
    locale: PuzzleLocale;
    storySeed: number;
  }) => ThemePresentation;
};
