import { expect, test } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import type { LearnerAnswer } from '../learner-answer';
import { totalFromPartsProblem } from '../../problem-model/total-from-parts.fixture';
import { NamedEquationChoiceInput } from './named-equation-choice-input';

test('dispatches the selected relation as a provider-neutral learner answer', async () => {
  document.body.innerHTML = `
    <named-equation-choice-input></named-equation-choice-input>
  `;
  const element = document.querySelector('named-equation-choice-input');
  expect(element).toBeInstanceOf(NamedEquationChoiceInput);
  const choiceInput = element as NamedEquationChoiceInput;
  choiceInput.choices = [
    {
      id: 'matching',
      label: 'total = base + count * unitValue',
      relation: totalFromPartsProblem.relation,
    },
  ];
  await choiceInput.updateComplete;

  const answers: LearnerAnswer[] = [];
  choiceInput.addEventListener('puzzle-answer', (event) => {
    answers.push((event as CustomEvent<LearnerAnswer>).detail);
  });

  await userEvent.click(
    page.getByLabelText('total = base + count * unitValue'),
  );
  await userEvent.click(page.getByRole('button', { name: 'Check' }));

  expect(answers).toEqual([
    {
      kind: 'relation-choice',
      choiceId: 'matching',
      label: 'total = base + count * unitValue',
      relation: totalFromPartsProblem.relation,
    },
  ]);
});
