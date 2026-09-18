import { expect, test } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import type { LearnerAnswer } from '../learner-answer';
import { NamedEquationTextInput } from './named-equation-text-input';

test('dispatches typed input as a provider-neutral learner answer', async () => {
  document.body.innerHTML = `
    <named-equation-text-input></named-equation-text-input>
  `;
  const element = document.querySelector('named-equation-text-input');
  expect(element).toBeInstanceOf(NamedEquationTextInput);

  const answers: LearnerAnswer[] = [];
  element?.addEventListener('puzzle-answer', (event) => {
    answers.push((event as CustomEvent<LearnerAnswer>).detail);
  });

  await userEvent.click(page.getByLabelText('Named equation'));
  await userEvent.keyboard('total = base + count * unitValue');
  await userEvent.click(page.getByRole('button', { name: 'Check' }));

  expect(answers).toEqual([
    { kind: 'text', input: 'total = base + count * unitValue' },
  ]);
});
