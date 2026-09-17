import { expect, test } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { MathModelingPuzzle } from './puzzle-game';

test('completes the fixed quantities-to-named-equation interaction', async () => {
  document.body.innerHTML = '<math-modeling-puzzle></math-modeling-puzzle>';

  const element = document.querySelector('math-modeling-puzzle');
  expect(element).toBeInstanceOf(MathModelingPuzzle);

  const puzzle = element as MathModelingPuzzle;
  await puzzle.updateComplete;

  await expect.element(page.getByText('unitValue = ?')).toBeVisible();
  expect(puzzle.shadowRoot?.textContent).not.toContain('45');

  await userEvent.click(
    page.getByLabelText('total = count * (base + unitValue)'),
  );
  await userEvent.click(page.getByRole('button', { name: 'Check' }));
  await expect
    .element(page.getByRole('status'))
    .toHaveTextContent('The equation does not match the quantity model.');

  await userEvent.click(
    page.getByLabelText('total = base + count * unitValue'),
  );
  await userEvent.click(page.getByRole('button', { name: 'Check' }));
  await expect
    .element(page.getByRole('status'))
    .toHaveTextContent('The equation matches the quantity model.');

  expect(puzzle.shadowRoot?.textContent).not.toContain('45');
});
