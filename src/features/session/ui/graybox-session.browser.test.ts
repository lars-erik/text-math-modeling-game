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

test('starts a session from the default single-puzzle view via the menu', async () => {
  document.body.innerHTML = `
    <math-modeling-puzzle
      seed="17"
      theme="gaming.drone-power"
      mode="story-to-quantities"
      locale="en"
      input-mode="text"
    ></math-modeling-puzzle>
  `;
  startMathModelingApplication({
    search: '?seed=17&scenario=gaming.drone-power&task=story-to-quantities&locale=en',
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
  expect(shellText(puzzle)).toContain('Story to quantities');
  expect(shellText(puzzle)).not.toContain('Puzzle 1 /');

  const menu = puzzle.shadowRoot?.querySelector('puzzle-menu');
  const form = menu?.shadowRoot?.querySelector('form');
  const seedInput = form?.querySelector('input[name="seed"]') as HTMLInputElement;
  seedInput.value = '918273';
  const startSessionButton = Array.from(
    form?.querySelectorAll<HTMLButtonElement>('button') ?? [],
  ).find((button) => button.textContent?.trim() === 'Start session');
  expect(startSessionButton).toBeDefined();
  form?.requestSubmit(startSessionButton!);
  await puzzle.updateComplete;
  expect(window.location.search).toBe('?session=918273&scenario=gaming.drone-power&locale=en');
  expect(shellText(puzzle)).toContain('Puzzle 1 / 10');
});

test('runs a full deterministic graybox session to the summary', async () => {
  const puzzle = await mountSession();
  expect(shellText(puzzle)).toContain('Puzzle 1 / 10');
  const total = 10;
  for (let index = 1; index <= total; index += 1) {
    if (index > 1) {
      const nextButton = page.getByRole('button', { name: 'Next puzzle' });
      await nextButton.click();
      await puzzle.updateComplete;
      expect(shellText(puzzle)).toContain(`Puzzle ${index} / ${total}`);
    }
    await answerCurrent(puzzle);
  }
  const finalNextButton = page.getByRole('button', { name: 'Next puzzle' });
  await finalNextButton.click();
  await puzzle.updateComplete;
  const summaryText = (puzzle.shadowRoot?.textContent ?? '').replace(/\s+/g, ' ');
  expect(shellText(puzzle)).toContain('Session complete');
  expect(summaryText).toContain('10 puzzles completed');
  expect(summaryText).toContain('Story to quantities: 2');
  expect(summaryText).toContain('Quantities to named equation: 2');
  expect(summaryText).toContain('Named equation to academic notation: 3');
  expect(summaryText).toContain('Academic notation to named equation: 3');
  const logItems = Array.from(
    puzzle.shadowRoot?.querySelectorAll('.answer-log-list li') ?? [],
  ).map((item) => (item.textContent ?? '').replace(/\s+/g, ' ').trim());
  expect(logItems).toHaveLength(10);
  for (const entry of logItems) {
    expect(entry).toContain('(correct)');
  }
});

test('the answer log marks a wrong answer as incorrect during the session', async () => {
  const puzzle = await mountSession();
  await submitText(puzzle, 'wrong = wrong');
  await puzzle.updateComplete;
  const logItems = Array.from(
    puzzle.shadowRoot?.querySelectorAll('.answer-log-list li') ?? [],
  ).map((item) => (item.textContent ?? '').replace(/\s+/g, ' ').trim());
  expect(logItems).toHaveLength(1);
  expect(logItems[0]).toContain('wrong = wrong');
  expect(logItems[0]).toContain('(incorrect)');
  await answerCurrent(puzzle);
  await puzzle.updateComplete;
  const correctedItems = Array.from(
    puzzle.shadowRoot?.querySelectorAll('.answer-log-list li') ?? [],
  ).map((item) => (item.textContent ?? '').replace(/\s+/g, ' ').trim());
  expect(correctedItems).toHaveLength(1);
  expect(correctedItems[0]).toContain('(correct)');
});

test('the completed session offers a way back to the single puzzle', async () => {
  const puzzle = await mountSession();
  const total = 10;
  for (let index = 1; index <= total; index += 1) {
    if (index > 1) {
      const nextButton = page.getByRole('button', { name: 'Next puzzle' });
      await nextButton.click();
      await puzzle.updateComplete;
    }
    await answerCurrent(puzzle);
  }
  const finalNextButton = page.getByRole('button', { name: 'Next puzzle' });
  await finalNextButton.click();
  await puzzle.updateComplete;
  const backButton = page.getByRole('button', { name: 'Back to start' });
  await backButton.click();
  await puzzle.updateComplete;
  expect(window.location.search).toBe(
    '?seed=17&scenario=gaming.drone-power&task=story-to-quantities&locale=en',
  );
  expect(shellText(puzzle)).toContain('Story to quantities');
  expect(shellText(puzzle)).not.toContain('Session complete');
});

test('multiple choice inside a session accepts the matching equation', async () => {
  const puzzle = await mountSession();
  let current = puzzle;
  for (let index = 1; index <= 10; index += 1) {
    if (shellText(current).includes('Quantities to named equation')) {
      const choiceButton = Array.from(
        current.shadowRoot?.querySelectorAll<HTMLButtonElement>('button') ?? [],
      ).find((button) =>
        button.textContent?.trim() === 'Multiple choice',
      );
      expect(choiceButton).toBeDefined();
      choiceButton!.click();
      await current.updateComplete;
      const choiceInput = current.shadowRoot?.querySelector(
        'named-equation-choice-input',
      ) as (HTMLElement & { updateComplete: Promise<unknown> }) | null;
      expect(choiceInput).not.toBeNull();
      await choiceInput!.updateComplete;
      const matchingRadio = Array.from(
        choiceInput!.shadowRoot?.querySelectorAll<HTMLInputElement>(
          'input[name="named-equation-choice"]',
        ) ?? [],
      ).find((radio) => radio.value === 'matching');
      expect(matchingRadio).toBeDefined();
      matchingRadio!.checked = true;
      choiceInput!.shadowRoot?.querySelector('form')?.requestSubmit();
      await current.updateComplete;
      expect(shellStatus(current)).toContain('The equation matches the quantity model.');
      return;
    }
    await answerCurrent(current);
    const nextButton = Array.from(
      current.shadowRoot?.querySelectorAll<HTMLButtonElement>('button') ?? [],
    ).find((button) => button.textContent?.trim() === 'Next puzzle');
    nextButton?.click();
    await current.updateComplete;
  }
  throw new Error('The fixed session never exposed the multiple-choice item.');
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
  expect(shellText(puzzle)).toContain('Puzzle 1 / 10');
  expect(shellStatus(puzzle)).not.toBe('');
});

test('requests the supported hint without losing input', async () => {
  const puzzle = await mountSession();
  let current = puzzle;
  for (let index = 1; index <= 10; index += 1) {
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
import approvedCompletionFragment from './graybox-session-completion-fragment.approved.txt?raw';

test('approves the semantic session completion fragment', async () => {
  const puzzle = await mountSession();
  const total = 10;
  for (let index = 1; index <= total; index += 1) {
    if (index > 1) {
      const nextButton = page.getByRole('button', { name: 'Next puzzle' });
      await nextButton.click();
      await puzzle.updateComplete;
    }
    await answerCurrent(puzzle);
  }
  const finalNextButton = page.getByRole('button', { name: 'Next puzzle' });
  await finalNextButton.click();
  await puzzle.updateComplete;
  const fragment = completionFragment(puzzle);
  expect(fragment).toBe(approvedCompletionFragment);
});

test('switching locale during an active session stays in the same session', async () => {
  const puzzle = await mountSession(
    '?session=918273&scenario=gaming.drone-power&locale=en',
  );
  expect(shellText(puzzle)).toContain('Puzzle 1 / 10');
  await submitText(puzzle, 'wrong = wrong');
  await puzzle.updateComplete;

  const localeSelect = puzzle.shadowRoot?.querySelector(
    'label.language-control select',
  ) as HTMLSelectElement;
  expect(localeSelect).not.toBeNull();
  localeSelect.value = 'nb';
  localeSelect.dispatchEvent(new Event('change'));
  await puzzle.updateComplete;

  expect(window.location.search).toBe(
    '?session=918273&scenario=gaming.drone-power&locale=nb',
  );
  expect(shellText(puzzle)).toContain('Oppgave 1 / 10');
  expect(shellText(puzzle)).not.toContain('Story to quantities');
  const logItems = Array.from(
    puzzle.shadowRoot?.querySelectorAll('.answer-log-list li') ?? [],
  ).map((item) => (item.textContent ?? '').replace(/\s+/g, ' ').trim());
  expect(logItems).toHaveLength(1);
  expect(logItems[0]).toContain('wrong = wrong');
  expect(logItems[0]).toContain('(feil)');
});

function completionFragment(puzzle: MathModelingPuzzle): string {
  const shell = puzzle.shadowRoot?.querySelector('puzzle-shell');
  const heading = shell?.shadowRoot?.querySelector('h1')?.textContent?.trim() ?? '';
  const summaryLine = Array.from(
    puzzle.shadowRoot?.querySelectorAll('div[slot="source"] p') ?? [],
  ).map((item) => (item.textContent ?? '').trim())[0];
  const edgeCounts = Array.from(
    puzzle.shadowRoot?.querySelectorAll('div[slot="source"] li') ?? [],
  ).map((item) => (item.textContent ?? '').replace(/\s+/g, ' ').trim());
  const answers = Array.from(
    puzzle.shadowRoot?.querySelectorAll('.answer-log-list li') ?? [],
  ).map((item) => (item.textContent ?? '').replace(/\s+/g, ' ').trim());
  return [
    `heading ${heading}`,
    `summary ${summaryLine}`,
    ...edgeCounts.map((line) => `edge ${line}`),
    ...answers.map((line, index) => `answer ${index + 1} ${line}`),
    '',
  ].join('\n');
}
