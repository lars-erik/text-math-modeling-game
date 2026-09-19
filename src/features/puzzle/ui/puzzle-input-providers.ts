import { html, type TemplateResult } from 'lit';

import type { NamedEquationChoice } from '../learner-answer';
import type { PuzzleScreen } from '../start-puzzle';
import type { PuzzleLocaleResources } from '../lang/contract';
import './named-equation-choice-input';
import './named-equation-text-input';

export type PuzzleInputMode = 'multiple-choice' | 'text';

type PuzzleInputContext = {
  definition: { choices: readonly NamedEquationChoice[] };
  screen: PuzzleScreen;
  resources: PuzzleLocaleResources;
};

export type PuzzleInputProvider = {
  label: string;
  render: (context: PuzzleInputContext) => TemplateResult;
};

export const puzzleInputProviders = {
  'multiple-choice': {
    label: 'Multiple choice',
    render: ({ definition, screen, resources }) => html`
      <named-equation-choice-input
        .choices=${definition.choices}
        .selectedChoiceId=${screen.submission?.choiceId}
        .legend=${resources.quantitiesToNamedEquation.choiceLegend}
        .checkLabel=${resources.controls.check}
      ></named-equation-choice-input>
    `,
  },
  text: {
    label: 'Text input',
    render: ({ screen, resources }) => html`
      <named-equation-text-input
        .value=${screen.submission?.answerKind === 'text'
          ? screen.input.value
          : ''}
        .inputLabel=${resources.quantitiesToNamedEquation.inputLabel}
        .checkLabel=${resources.controls.check}
      ></named-equation-text-input>
    `,
  },
} as const satisfies Record<PuzzleInputMode, PuzzleInputProvider>;

export function isPuzzleInputMode(value: string): value is PuzzleInputMode {
  return Object.hasOwn(puzzleInputProviders, value);
}
