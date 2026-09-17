import type {
  Problem,
  ProblemReplay,
  QuantityGiven,
  QuantityRole,
} from '../problem-model/problem';
import type { Relation } from '../problem-model/expression';

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
    relation: Relation;
  };
  feedback?:
    | {
        kind: 'accepted';
        message: string;
      }
    | {
        kind: 'structural-mismatch';
        message: string;
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
