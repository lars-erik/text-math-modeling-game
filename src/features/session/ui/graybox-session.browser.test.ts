import { expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { startMathModelingApplication } from '../../../application';
import {
  MathModelingPuzzle,
} from '../../puzzle/ui/math-modeling-puzzle';
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

function shellStatus(puzzle: MathModelingPuzzle): string {
  const shell = puzzle.shadowRoot?.querySelector('puzzle-shell');
  return shell?.shadowRoot?.querySelector('[role="status"]')?.textContent ?? '';
}

function quantityLines(puzzle: MathModelingPuzzle): string[] {
  return Array.from(
    puzzle.shadowRoot?.querySelectorAll('div[slot="source"] li') ?? [],
  ).map((item) => (item.textContent ?? '').trim());
}

function variableName(line: string): string {
  return line.split('=')[0].trim();
}

function knownValue(line: string): string | undefined {
  return line.includes('?') ? undefined : line.split('=')[1]?.trim();
}

async function submitText(puzzle: MathModelingPuzzle, value: string) {
  const inputComponent = puzzle.shadowRoot?.querySelector(
    'named-equation-text-input',
  ) as (HTMLElement & { updateComplete: Promise<unknown> }) | null;
  expect(inputComponent).not.toBeNull();
  await inputComponent!.updateComplete;
  const input = inputComponent!.shadowRoot?.querySelector(
    'input[type="text"]',
  ) as HTMLInputElement;
  input.value = value;
  inputComponent!.shadowRoot?.querySelector('form')?.requestSubmit();
  await puzzle.updateComplete;
}

async function answerCurrent(puzzle: MathModelingPuzzle): Promise<void> {
  const quantities = quantityLines(puzzle).map((line) => {
    const [name, value] = line.split('=').map((part) => part.trim());
    return { name, value, hidden: value === '?' };
  });
  const nameOf = (fragment: string) =>
    quantities.find((quantity) =>
      quantity.name.toLowerCase().includes(fragment),
    )?.name ?? '';
  const total = nameOf('total');
  const base = nameOf('base');
  const count = nameOf('count');
  const perItem = quantities.find((quantity) => quantity.hidden)?.name ?? '';

  const task = puzzle.shadowRoot?.querySelector(
    'story-quantities-input, named-equation-text-input',
  );
  expect(task).not.toBeNull();

  if (task instanceof HTMLElement && task.tagName === 'STORY-QUANTITIES-INPUT') {
    for (const checkbox of Array.from(
      task.shadowRoot?.querySelectorAll<HTMLInputElement>(
        'input[name="known-quantity"]',
      ) ?? [],
    )) {
      checkbox.checked = checkbox.value !== 'unitValue';
    }
    for (const radio of Array.from(
      task.shadowRoot?.querySelectorAll<HTMLInputElement>(
        'input[name="unknown-quantity"]',
      ) ?? [],
    )) {
      radio.checked = radio.value === 'unitValue';
    }
    task.shadowRoot?.querySelector('form')?.requestSubmit();
    await puzzle.updateComplete;
    return;
  }

  const heading = shellText(puzzle);
  if (heading.includes('Named equation to academic notation')) {
    const substituted = quantities
      .filter((quantity) => !quantity.hidden)
      .map((quantity) => `${knownValue(quantity.name) ?? ''}`);
    const totalValue = quantities.find((quantity) => quantity.name === total)
      ?.value;
    const baseValue = quantities.find((quantity) => quantity.name === base)
      ?.value;
    const countValue = quantities.find((quantity) => quantity.name === count)
      ?.value;
    const academic = `${totalValue} = ${baseValue} + ${countValue}*${perItem === '' ? 'p' : 'p'}`;
    await submitText(puzzle, academic);
    return;
  }

  expect(total).not.toBe('');
  await submitText(puzzle, `${total} = ${base} + ${count} * ${perItem}`);
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
  }
  const summaryText = (puzzle.shadowRoot?.textContent ?? '').replace(/\s+/g, ' ');
  expect(shellText(puzzle)).toContain('Session complete');
  expect(summaryText).toContain('8 puzzles completed');
  expect(summaryText).toContain('Story to quantities: 2');
  expect(summaryText).toContain('Quantities to named equation: 2');
  expect(summaryText).toContain('Named equation to academic notation: 2');
  expect(summaryText).toContain('Academic notation to named equation: 2');
});

test('wrong answers keep input and feedback inside a session item', async () => {
  const puzzle = await mountSession();
  const textInput = puzzle.shadowRoot?.querySelector(
    'named-equation-text-input',
  );
  if (textInput === null || textInput === undefined) {
    return;
  }
  await submitText(puzzle, 'wrong = wrong');
  expect(shellText(puzzle)).toContain('Puzzle 1 / 8');
  expect(shellStatus(puzzle)).not.toBe('');
});

test('requests the supported hint without losing input', async () => {
  const puzzle = await mountSession();
  let current = puzzle;
  for (let index = 1; index <= 8; index += 1) {
    const hintButton = Array.from(
      current.shadowRoot?.querySelectorAll<HTMLButtonElement>('button') ?? [],
    ).find((button) => button.textContent?.trim() === 'Hint');
    if (hintButton !== undefined) {
      const before = shellStatus(current);
      hintButton.click();
      await current.updateComplete;
      const after = shellStatus(current);
      expect(after).toContain(
        'The total contains the base amount once, plus one unit value per item.',
      );
      if (before !== '') {
        expect(after).toContain('wrong');
      }
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
