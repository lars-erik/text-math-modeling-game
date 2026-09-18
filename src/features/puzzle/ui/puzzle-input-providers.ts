import { html, type TemplateResult } from 'lit';

import type { PuzzleDefinition } from '../puzzle-definition';
import type { PuzzleScreen } from '../start-puzzle';
import './named-equation-choice-input';
import './named-equation-text-input';

export type PuzzleInputMode = 'multiple-choice' | 'text';

type PuzzleInputContext = {
  definition: PuzzleDefinition;
  screen: PuzzleScreen;
};

export type PuzzleInputProvider = {
  label: string;
  render: (context: PuzzleInputContext) => TemplateResult;
};

export const puzzleInputProviders = {
  'multiple-choice': {
    label: 'Multiple choice',
    render: ({ definition, screen }) => html`
      <named-equation-choice-input
        .choices=${definition.choices}
        .selectedChoiceId=${screen.submission?.choiceId}
      ></named-equation-choice-input>
    `,
  },
  text: {
    label: 'Text input',
    render: ({ screen }) => html`
      <named-equation-text-input
        .value=${screen.submission?.answerKind === 'text'
          ? screen.input.value
          : ''}
      ></named-equation-text-input>
    `,
  },
} as const satisfies Record<PuzzleInputMode, PuzzleInputProvider>;

export function isPuzzleInputMode(value: string): value is PuzzleInputMode {
  return Object.hasOwn(puzzleInputProviders, value);
}
