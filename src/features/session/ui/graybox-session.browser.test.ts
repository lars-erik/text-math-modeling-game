import { expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { startMathModelingApplication } from '../../../application';
import { MathModelingPuzzle } from '../../puzzle/ui/math-modeling-puzzle';
import { katexAcademicDisplayAdapter } from '../../puzzle/ui/katex-academic-display-adapter';
import '../../puzzle/ui/math-modeling-puzzle';

async function mountSession(
  search = '?session=918273&scenario=gaming.drone-power&locale=en',
): Promise<MathModelingPuzzle> {
  document.body.innerHTML = `
    <math-modeling-puzzle
      theme="gaming.drone-power"
      locale="en"
      input-mode="text"
    ></math-modeling-puzzle>
  `;
  startMathModelingApplication({
    search,
    root: document,
    replaceSearch: (next: string) => {
      window.history.replaceState(null, '', next);
    },
  });
  const element = document.querySelector('math-modeling-puzzle');
  expect(element).toBeInstanceOf(MathModelingPuzzle);
  const puzzle = element as MathModelingPuzzle;
  puzzle.academicDisplayAdapter = katexAcademicDisplayAdapter;
  await puzzle.updateComplete;
  return puzzle;
}

function shellText(puzzle: MathModelingPuzzle): string {
  const shell = puzzle.shadowRoot?.querySelector('puzzle-shell');
  return shell?.shadowRoot?.textContent ?? '';
}

async function answerCurrent(puzzle: MathModelingPuzzle): Promise<void> {
  const task = puzzle.shadowRoot?.querySelector(
    'story-quantities-input, named-equation-text-input, named-equation-choice-input',
  );
  expect(task).not.toBeNull();
  if (task instanceof HTMLElement && task.tagName === 'STORY-QUANTITIES-INPUT') {
    const form = task.shadowRoot?.querySelector('form');
    const checkboxes = Array.from(
      task.shadowRoot?.querySelectorAll<HTMLInputElement>(
        'input[name="known-quantity"]',
      ) ?? [],
    );
    for (const checkbox of checkboxes) {
      checkbox.checked = checkbox.value !== 'unitValue';
    }
    const radios = Array.from(
      task.shadowRoot?.querySelectorAll<HTMLInputElement>(
        'input[name="unknown-quantity"]',
      ) ?? [],
    );
    for (const radio of radios) {
      radio.checked = radio.value === 'unitValue';
    }
    form?.requestSubmit();
    await puzzle.updateComplete;
    return;
  }
  const input = task?.shadowRoot?.querySelector('input[type="text"]');
  expect(input).not.toBeNull();
  const heading = shellText(puzzle);
  const quantities = Array.from(
    puzzle.shadowRoot?.querySelectorAll('div[slot="source"] li') ?? [],
  ).map((item) => item.textContent ?? '');
  const nameOf = (fragment: string) =>
    quantities
      .find((quantity) => quantity.toLowerCase().includes(fragment))
      ?.split('=')[0]
      .trim() ?? '';
  const total = nameOf('total');
  const base = nameOf('base');
  const count = nameOf('count');
  const perItem = nameOf('?');
  let equation: string;
  if (heading.includes('academic notation')) {
    equation = perItem === '' ? 'T = b + n*p' : 'T = b + n*p';
  } else {
    expect(total).not.toBe('');
    equation = `${total} = ${base} + ${count} * ${perItem}`;
  }
  (input as HTMLInputElement).value = equation;
  (task as HTMLElement)?.shadowRoot
    ?.querySelector('form')
    ?.requestSubmit();
  await puzzle.updateComplete;
}

test('runs a full deterministic graybox session to the summary', async () => {
  const puzzle = await mountSession();
  expect(shellText(puzzle)).toContain('Puzzle 1 / 8');
  const total = 8;
  for (let index = 1; index <= total; index += 1) {
    if (index > 1) {
      const nextButton = page.getByRole('button', { name: 'Next puzzle' });
      await nextButton.click();
      await puzzle.updateComplete;
      expect(shellText(puzzle)).toContain(`Puzzle ${index} / ${total}`);
    }
    await answerCurrent(puzzle);
    if (index < total) {
      expect(shellText(puzzle)).toContain('Puzzle');
    }
  }
  expect(shellText(puzzle)).toContain('Session complete');
  expect(shellText(puzzle)).toContain('8 puzzles completed');
  expect(shellText(puzzle)).toContain('Story to quantities: 2');
  expect(shellText(puzzle)).toContain('Quantities to named equation: 2');
  expect(shellText(puzzle)).toContain('Named equation to academic notation: 2');
  expect(shellText(puzzle)).toContain('Academic notation to named equation: 2');
});

test('wrong answers keep input and feedback inside a session item', async () => {
  const puzzle = await mountSession();
  const input = puzzle.shadowRoot?.querySelector('named-equation-text-input');
  if (input === null || input === undefined) {
    return;
  }
  const textInput = input.shadowRoot?.querySelector(
    'input[type="text"]',
  ) as HTMLInputElement;
  expect(textInput).not.toBeNull();
  textInput.value = 'wrong = wrong';
  input.shadowRoot?.querySelector('form')?.requestSubmit();
  await puzzle.updateComplete;
  expect(shellText(puzzle)).toContain('Puzzle 1 / 8');
  const feedback = puzzle.shadowRoot?.querySelector('[role="status"]');
  expect(feedback?.textContent ?? '').not.toBe('');
});

test('requests the supported hint without losing input', async () => {
  const puzzle = await mountSession(
    '?session=918273&scenario=gaming.drone-power&locale=en',
  );
  let current = puzzle;
  for (let index = 1; index <= 8; index += 1) {
    const hintButton = Array.from(
      current.shadowRoot?.querySelectorAll<HTMLButtonElement>('button') ?? [],
    ).find((button) => button.textContent?.trim() === 'Hint');
    if (hintButton !== undefined) {
      hintButton.click();
      await current.updateComplete;
      expect(shellText(current)).toContain(
        'The total contains the base amount once, plus one unit value per item.',
      );
      return;
    }
    await answerCurrent(current);
    const nextButton = Array.from(
      current.shadowRoot?.querySelectorAll<HTMLButtonElement>('button') ?? [],
    ).find((button) => button.textContent?.trim() === 'Next puzzle');
    nextButton?.click();
    await current.updateComplete;
  }
  throw new Error('The fixed session never exposed the hint action.');
});
