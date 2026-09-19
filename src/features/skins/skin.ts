import type { LearnerNameMap } from '../named-expression';
import type { PuzzleLocale } from '../puzzle/lang';
import type {
  Problem,
  QuantityGiven,
  QuantityRole,
} from '../problem-model/problem';
import type { QuantityId } from '../problem-model/expression';

export const skinIds = [
  'gaming.drone-power',
  'creator.followers',
] as const;

export type SkinId = (typeof skinIds)[number];

export function isSkinId(value: string): value is SkinId {
  return (skinIds as readonly string[]).includes(value);
}

export type SkinFact = {
  skinQuantityId: string;
  canonicalId: QuantityId;
  role: QuantityRole;
  visibility: QuantityGiven['kind'];
  value?: number;
  label: string;
  variableName: string;
  unit: string;
};

export type SkinPresentation = {
  skinId: SkinId;
  locale: PuzzleLocale;
  facts: readonly SkinFact[];
  story: { text: string; storySeed: number };
  learnerNames: LearnerNameMap;
};

export type Skin = {
  id: SkinId;
  present: (options: {
    problem: Problem;
    locale: PuzzleLocale;
    storySeed: number;
  }) => SkinPresentation;
};
