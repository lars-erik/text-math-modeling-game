import type { SourceRange } from '../../named-expression';
import type { Relation } from '../../problem-model/expression';
import type { Problem, ProblemReplay } from '../../problem-model/problem';
import type { SkinPresentation } from '../../skins';
import type { LearnerAnswer } from '../learner-answer';
import type { PuzzleLocale } from '../lang';

export const modeIds = [
  'story-to-quantities',
  'quantities-to-named-equation',
] as const;

export type ModeId = (typeof modeIds)[number];

export function isModeId(value: string): value is ModeId {
  return (modeIds as readonly string[]).includes(value);
}

export type PuzzleFeedback =
  | {
      kind: 'accepted';
      message: string;
      checkPolicy: 'normalized-structure';
      equationSides: 'ordered';
    }
  | {
      kind: 'structural-mismatch';
      message: string;
      checkPolicy: 'normalized-structure';
      equationSides: 'ordered';
    }
  | {
      kind: 'syntax-error';
      message: string;
      expected: string;
      range: SourceRange;
    }
  | {
      kind: 'unknown-identifier';
      message: string;
      identifier: string;
      availableIdentifiers: readonly string[];
      range: SourceRange;
    }
  | {
      kind: 'ambiguous-identifier';
      message: string;
      identifier: string;
      candidateIds: readonly string[];
      range: SourceRange;
    }
  | {
      kind: 'invalid-integer-literal';
      message: string;
      literal: string;
      range: SourceRange;
    }
  | { kind: 'incorrect'; message: string }
  | { kind: 'quantity-selection-accepted'; message: string };

export type ScreenQuantity = {
  id: string;
  skinQuantityId: string;
  label: string;
  variableName: string;
  displayValue: string;
  role: string;
  given: { kind: 'known'; value: number } | { kind: 'hidden' };
};

export type StoryToQuantitiesScreen = {
  modeId: 'story-to-quantities';
  source: { kind: 'story' };
  target: {
    kind: 'quantities';
    prompt: string;
    quantities: readonly ScreenQuantity[];
  };
  input: { kind: 'quantity-selection' } & QuantitySelection;
};

export type QuantitiesToNamedEquationScreen = {
  modeId: 'quantities-to-named-equation';
  source: { kind: 'quantities'; quantities: readonly ScreenQuantity[] };
  target: {
    kind: 'named-equation';
    prompt: string;
  };
  input: { kind: 'expression'; value: string };
};

export type PuzzleScreen = {
  screen: StoryToQuantitiesScreen | QuantitiesToNamedEquationScreen;
  context: {
    locale: PuzzleLocale;
    skinId: string;
    story: string;
    quantities: readonly ScreenQuantity[];
    replay?: ProblemReplay & {
      locale: PuzzleLocale;
      skinId: string;
      storySeed: number;
    };
  };
  submission?: PuzzleSubmission;
  feedback?: PuzzleFeedback;
};

export type QuantitySelection = {
  knownIds: readonly string[];
  unknownId?: string;
};

export type PuzzleSubmission =
  | { kind: 'quantity-selection' } & QuantitySelection
  | {
      kind: 'named-equation';
      answerKind: LearnerAnswer['kind'];
      input: string;
      choiceId?: string;
      relation?: Relation;
    };

export type ModeStartOptions = {
  problem: Problem;
  skin: SkinPresentation;
  locale: PuzzleLocale;
  replay?: ProblemReplay;
};

export type ModeSubmitOptions = ModeStartOptions & {
  answer: LearnerAnswer | QuantitySelection;
};

export type Mode = {
  id: ModeId;
  start: (options: ModeStartOptions) => PuzzleScreen;
  submit: (options: ModeSubmitOptions) => PuzzleScreen;
};
