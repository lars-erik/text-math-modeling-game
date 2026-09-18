import { expect, test } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { MathModelingPuzzle } from './puzzle-game';

test('edits and resubmits a typed equation', async () => {
  document.body.innerHTML = '<math-modeling-puzzle></math-modeling-puzzle>';

  const element = document.querySelector('math-modeling-puzzle');
  expect(element).toBeInstanceOf(MathModelingPuzzle);

  const puzzle = element as MathModelingPuzzle;
  await puzzle.updateComplete;

  await expect.element(page.getByText('unitValue = ?')).toBeVisible();
  expect(puzzle.shadowRoot?.textContent).not.toContain('45');

  const input = page.getByLabelText('Named equation');

  await userEvent.click(input);
  await userEvent.keyboard('total = count * (base + unitValue)');
  await userEvent.click(page.getByRole('button', { name: 'Check' }));
  await expect
    .element(page.getByRole('status'))
    .toHaveTextContent('The equation grouping does not match the quantity model.');
  await expect.element(input).toHaveValue(
    'total = count * (base + unitValue)',
  );

  await userEvent.clear(input);
  await userEvent.keyboard('total = unitValue * count + base');
  await userEvent.click(page.getByRole('button', { name: 'Check' }));
  await expect
    .element(page.getByRole('status'))
    .toHaveTextContent('The equation matches the quantity model.');
  await expect.element(input).toHaveValue(
    'total = unitValue * count + base',
  );

  expect(puzzle.shadowRoot?.textContent).not.toContain('45');
});
