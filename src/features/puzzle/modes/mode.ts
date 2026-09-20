import type {
  LearnerNameSource,
  SourceRange,
} from '../../named-expression';
import type { Problem } from '../../problem-model/problem';
import type { QuantityId, Relation } from '../../problem-model/expression';
import type { Misconception } from '../../problem-model/misconception';
import type { LearnerAnswer } from '../learner-answer';
import type { PuzzleLocale } from '../lang';
import type { AcademicSymbolMap } from '../../representations/academic-symbol-map';

export const modeIds = [
  'story-to-quantities',
  'quantities-to-named-equation',
  'named-equation-to-academic-notation',
  'academic-notation-to-named-equation',
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
      kind: 'misconception';
      misconception: Misconception;
      message?: string;
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

export type QuantitySelection = {
  knownIds: readonly QuantityId[];
  unknownId?: QuantityId;
};

export type ModeSubmission =
  | ({ kind: 'quantity-selection' } & QuantitySelection)
  | {
      kind: 'named-equation';
      answerKind: 'text' | 'relation-choice';
      input: string;
      choiceId?: string;
      relation?: Relation;
    }
  | {
      kind: 'academic-notation';
      input: string;
      relation?: Relation;
    };

export type StoryToQuantitiesState = {
  modeId: 'story-to-quantities';
  source: { kind: 'story' };
  target: {
    kind: 'quantities';
    quantityIds: readonly QuantityId[];
  };
  input: { kind: 'quantity-selection' } & QuantitySelection;
};

export type QuantitiesToNamedEquationState = {
  modeId: 'quantities-to-named-equation';
  source: {
    kind: 'quantities';
    quantityIds: readonly QuantityId[];
  };
  target: {
    kind: 'named-equation';
    prompt: string;
  };
  input: { kind: 'expression'; value: string };
};

export type NamedEquationToAcademicNotationState = {
  modeId: 'named-equation-to-academic-notation';
  source: { kind: 'named-equation'; relation: Relation };
  target: {
    kind: 'academic-notation';
    prompt: string;
    symbols: AcademicSymbolMap;
  };
  input: { kind: 'expression'; value: string };
};

export type AcademicNotationToNamedEquationState = {
  modeId: 'academic-notation-to-named-equation';
  source: {
    kind: 'academic-notation';
    relation: Relation;
    symbols: AcademicSymbolMap;
  };
  target: { kind: 'named-equation'; prompt: string };
  input: { kind: 'expression'; value: string };
};

export type ModeState =
  | StoryToQuantitiesState
  | QuantitiesToNamedEquationState
  | NamedEquationToAcademicNotationState
  | AcademicNotationToNamedEquationState;

export type ModeResult = {
  state: ModeState;
  feedback?: PuzzleFeedback;
  submission?: ModeSubmission;
};

export type ModeStartOptions = {
  problem: Problem;
  locale: PuzzleLocale;
};

export type ModeSubmitOptions = ModeStartOptions & {
  answer: LearnerAnswer | QuantitySelection;
  names: LearnerNameSource;
};

export type Mode = {
  id: ModeId;
  start: (options: ModeStartOptions) => ModeResult;
  submit: (options: ModeSubmitOptions) => ModeResult;
};
