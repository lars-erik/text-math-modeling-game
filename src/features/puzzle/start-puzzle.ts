import type {
  Problem,
  ProblemReplay,
  QuantityGiven,
  QuantityRole,
} from '../problem-model/problem';
import type { Relation } from '../problem-model/expression';
import type { SourceRange } from '../named-expression';
import type { LearnerAnswer } from './learner-answer';

export type ScreenQuantity = {
  id: string;
  role: QuantityRole;
  given: QuantityGiven;
};

export type PuzzleScreen = {
  source: {
    kind: 'quantities';
    quantities: readonly ScreenQuantity[];
  };
  target: {
    kind: 'named-equation';
    prompt: string;
  };
  input: {
    kind: 'expression';
    value: string;
  };
  replay: ProblemReplay;
  submission?: {
    kind: 'named-equation';
    answerKind: LearnerAnswer['kind'];
    input: string;
    choiceId?: string;
    relation?: Relation;
  };
  feedback?:
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
      };
};

export function startPuzzle(problem: Problem): PuzzleScreen {
  return {
    source: {
      kind: 'quantities',
      quantities: problem.quantities.map((quantity) => ({
        id: quantity.id,
        role: quantity.role,
        given:
          quantity.given.kind === 'known'
            ? { kind: 'known', value: quantity.given.value }
            : { kind: 'hidden' },
      })),
    },
    target: {
      kind: 'named-equation',
      prompt: 'Write an equation that relates these quantities.',
    },
    input: {
      kind: 'expression',
      value: '',
    },
    replay: { ...problem.replay },
  };
}
