import { beforeEach, expect, test } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { startMathModelingApplication } from '../../../application';
import {
  defaultTotalFromPartsGenerationConfig,
  generateTotalFromPartsCase,
} from '../../problem-generation/generate-total-from-parts';
import type { Problem } from '../../problem-model/problem';
import type { PuzzleRegistry } from '../puzzle-definition';
import { referencePuzzle } from '../reference-puzzle';
import { createSeededPuzzle } from '../seeded-puzzle';
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

test('starts the real application with a generated puzzle from the URL seed', async () => {
  const generated = generateTotalFromPartsCase({
    seed: 17,
    config: defaultTotalFromPartsGenerationConfig,
  });
  document.body.innerHTML = `
    <math-modeling-puzzle
      puzzle="reference"
      input-mode="text"
    ></math-modeling-puzzle>
  `;

  startMathModelingApplication({ search: '?seed=17', root: document });

  const puzzle = document.querySelector('math-modeling-puzzle');
  expect(puzzle?.getAttribute('puzzle')).toBe('generated');
  expect(browserGlobal.mathModelingPuzzles.reference).toBe(referencePuzzle);
  expect(browserGlobal.mathModelingPuzzles.generated?.problem.replay).toEqual({
    seed: 17,
    generatorVersion: 'total-from-parts-v1',
  });
  expect(browserGlobal.mathModelingPuzzles.generated).not.toHaveProperty(
    'answerKey',
  );

  await expect
    .element(
      page.getByText(
        new RegExp(`uses ${generated.answerKey.bindings.base} MW`),
      ),
    )
    .toBeVisible();
  await expect
    .element(page.getByText(/How much power does one drone draw/))
    .toBeVisible();

  expect(document.body.textContent).not.toContain(
    String(generated.answerKey.bindings.unitValue),
  );
});

test('renders the generated story as a Story-to-Quantities interaction', async () => {
  browserGlobal.mathModelingPuzzles = {
    generated: createSeededPuzzle({ seed: 17 }),
  };
  document.body.innerHTML = `
    <math-modeling-puzzle
      puzzle="generated"
      locale="en"
    ></math-modeling-puzzle>
  `;

  const puzzle = document.querySelector('math-modeling-puzzle');
  expect(puzzle).toBeInstanceOf(MathModelingPuzzle);
  await (puzzle as MathModelingPuzzle).updateComplete;

  await expect
    .element(page.getByRole('heading', { name: 'Story to quantities' }))
    .toBeVisible();
  await expect
    .element(page.getByText(/A ship uses \d+ MW for basic systems/))
    .toBeVisible();
  await expect
    .element(page.getByRole('radio', { name: 'power per drone' }))
    .toBeVisible();
  expect(puzzle?.shadowRoot?.textContent).not.toContain('dronePower =');
});

test('preserves an incorrect quantity selection and accepts its keyboard-submitted revision', async () => {
  browserGlobal.mathModelingPuzzles = {
    generated: createSeededPuzzle({ seed: 17 }),
  };
  document.body.innerHTML = `
    <math-modeling-puzzle puzzle="generated" locale="en"></math-modeling-puzzle>
  `;

  const baseKnown = page.getByRole('checkbox', { name: 'base power: 30 MW' });
  const countKnown = page.getByRole('checkbox', { name: 'number of drones: 3 drones' });
  const totalKnown = page.getByRole('checkbox', { name: 'total power: 66 MW' });
  const wrongUnknown = page.getByRole('radio', { name: 'total power' });
  const correctUnknown = page.getByRole('radio', { name: 'power per drone' });
  const check = page.getByRole('button', { name: 'Check' });

  await userEvent.click(baseKnown);
  await userEvent.click(countKnown);
  await userEvent.click(wrongUnknown);
  await userEvent.click(check);
  await expect
    .element(page.getByRole('status'))
    .toHaveTextContent(
      'Not quite. Review which values the story gives and which one it asks for.',
    );
  await expect.element(baseKnown).toBeChecked();
  await expect.element(countKnown).toBeChecked();
  await expect.element(wrongUnknown).toBeChecked();

  await userEvent.click(totalKnown);
  await userEvent.click(correctUnknown);
  await userEvent.click(check);
  await userEvent.keyboard('{Enter}');
  await expect
    .element(page.getByRole('status'))
    .toHaveTextContent('The quantities match the story.');

  expect(document.body.textContent).not.toContain('12');
});

test('switches story language and learner names without regenerating the problem', async () => {
  const definition = createSeededPuzzle({ seed: 17 });
  const originalProblem = definition.problem;
  browserGlobal.mathModelingPuzzles = { generated: definition };
  document.body.innerHTML = `
    <math-modeling-puzzle puzzle="generated" locale="en"></math-modeling-puzzle>
  `;

  await userEvent.selectOptions(page.getByRole('combobox'), 'nb');

  await expect
    .element(page.getByRole('heading', { name: 'Fra fortelling til størrelser' }))
    .toBeVisible();
  await expect
    .element(page.getByText(/Et skip bruker 30 MW til grunnleggende systemer/))
    .toBeVisible();
  await expect
    .element(page.getByRole('radio', { name: 'effekt per drone' }))
    .toBeVisible();
  expect(document.querySelector('math-modeling-puzzle')?.getAttribute('locale')).toBe('nb');
  expect(definition.problem).toBe(originalProblem);
  expect(definition.problem.replay).toEqual({
    seed: 17,
    generatorVersion: 'total-from-parts-v1',
  });
});

test('keeps the named-equation puzzle consistent with the selected locale', async () => {
  const generated = createSeededPuzzle({ seed: 17 });
  browserGlobal.mathModelingPuzzles = {
    named: { ...generated, kind: 'quantities-to-named-equation' },
  };
  document.body.innerHTML = `
    <math-modeling-puzzle
      puzzle="named"
      locale="nb"
      input-mode="text"
    ></math-modeling-puzzle>
  `;

  await expect.element(page.getByText('grunnEffekt = 30')).toBeVisible();
  const input = page.getByLabelText('Navngitt likning');
  await userEvent.click(input);
  await userEvent.keyboard(
    'totalEffekt = grunnEffekt + droneAntall * droneEffekt',
  );
  await userEvent.click(page.getByRole('button', { name: 'Sjekk' }));
  await expect
    .element(page.getByRole('status'))
    .toHaveTextContent('Likningen stemmer med modellen for størrelsene.');
});
