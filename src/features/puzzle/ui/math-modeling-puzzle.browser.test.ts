import { beforeEach, expect, test } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import type { Problem } from '../../problem-model/problem';
import type { PuzzleRegistry } from '../puzzle-definition';
import { referencePuzzle } from '../reference-puzzle';
import { MathModelingPuzzle } from './math-modeling-puzzle';

const browserGlobal = globalThis as typeof globalThis & {
  mathModelingPuzzles: PuzzleRegistry;
};

beforeEach(() => {
  browserGlobal.mathModelingPuzzles = { reference: referencePuzzle };
});

test('loads its puzzle from the global registry key in the puzzle attribute', async () => {
  const configuredProblem: Problem = {
    ...referencePuzzle.problem,
    quantities: referencePuzzle.problem.quantities.map((quantity) =>
      quantity.id === 'base'
        ? { ...quantity, given: { kind: 'known' as const, value: 99 } }
        : quantity,
    ),
  };
  browserGlobal.mathModelingPuzzles = {
    configured: { ...referencePuzzle, problem: configuredProblem },
  };
  document.body.innerHTML = `
    <math-modeling-puzzle
      puzzle="configured"
      input-mode="text"
    ></math-modeling-puzzle>
  `;

  const puzzle = document.querySelector('math-modeling-puzzle');
  expect(puzzle).toBeInstanceOf(MathModelingPuzzle);
  await (puzzle as MathModelingPuzzle).updateComplete;

  await expect.element(page.getByText('base = 99')).toBeVisible();
});

test('edits and resubmits a typed equation', async () => {
  document.body.innerHTML = `
    <math-modeling-puzzle
      puzzle="reference"
      input-mode="text"
    ></math-modeling-puzzle>
  `;

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

test('completes the puzzle with the multiple-choice input provider', async () => {
  document.body.innerHTML = `
    <math-modeling-puzzle
      puzzle="reference"
      input-mode="multiple-choice"
    ></math-modeling-puzzle>
  `;

  await userEvent.click(
    page.getByLabelText('total = count * (base + unitValue)'),
  );
  await userEvent.click(page.getByRole('button', { name: 'Check' }));
  await expect
    .element(page.getByRole('status'))
    .toHaveTextContent('The equation grouping does not match the quantity model.');

  await userEvent.click(
    page.getByLabelText('total = base + count * unitValue'),
  );
  await userEvent.click(page.getByRole('button', { name: 'Check' }));
  await expect
    .element(page.getByRole('status'))
    .toHaveTextContent('The equation matches the quantity model.');
});

test('switches input providers from the mode menu and reflects the attribute', async () => {
  document.body.innerHTML = `
    <math-modeling-puzzle
      puzzle="reference"
      input-mode="multiple-choice"
    ></math-modeling-puzzle>
  `;
  const puzzle = document.querySelector('math-modeling-puzzle');

  await userEvent.click(page.getByRole('button', { name: 'Text input' }));

  await expect.element(page.getByLabelText('Named equation')).toBeVisible();
  expect(puzzle?.getAttribute('input-mode')).toBe('text');

  await userEvent.click(
    page.getByRole('button', { name: 'Multiple choice' }),
  );
  await expect
    .element(page.getByLabelText('total = base + count * unitValue'))
    .toBeVisible();
  expect(puzzle?.getAttribute('input-mode')).toBe('multiple-choice');
});
