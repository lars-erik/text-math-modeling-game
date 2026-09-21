import { expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { startMathModelingApplication } from '../../../application';
import {
  MathModelingPuzzle,
} from '../../puzzle/ui/math-modeling-puzzle';
import { katexAcademicDisplayAdapter } from '../../puzzle/ui/katex-academic-display-adapter';
import '../../puzzle/ui/math-modeling-puzzle';
import '../../navigation/ui/home-screen';

async function mountSession(
  hash = '#session?seed=918273&scenario=gaming.drone-power&language=en',
): Promise<MathModelingPuzzle> {
  document.body.innerHTML = `
    <home-screen hidden></home-screen>
    <math-modeling-puzzle
      theme="gaming.drone-power"
      locale="en"
      input-mode="text"
    ></math-modeling-puzzle>
  `;
  startMathModelingApplication({
    hash,
    root: document,
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

async function submitWrongStoryChoice(puzzle: MathModelingPuzzle) {
  const storyChoiceInput = puzzle.shadowRoot?.querySelector(
    'story-choice-input',
  ) as (HTMLElement & { updateComplete: Promise<unknown> }) | null;
  if (storyChoiceInput === null) {
    throw new Error('The session item exposes no story choice input.');
  }
  const distractorRadio = Array.from(
    storyChoiceInput.shadowRoot?.querySelectorAll<HTMLInputElement>(
      'input[name="story-choice"]',
    ) ?? [],
  ).find((radio) => radio.value !== 'matching');
  expect(distractorRadio).toBeDefined();
  distractorRadio!.checked = true;
  storyChoiceInput.shadowRoot?.querySelector('form')?.requestSubmit();
  await puzzle.updateComplete;
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

type TestScreenQuantity = {
  id: string;
  label: string;
  variableName: string;
  displayValue: string;
  role: string;
  given: { kind: string };
};

function screenQuantities(
  puzzle: MathModelingPuzzle,
): ReadonlyArray<TestScreenQuantity> {
  const storyInput = puzzle.shadowRoot?.querySelector(
    'story-quantities-input',
  ) as (HTMLElement & { screen?: { target?: { quantities?: unknown } } }) | null;
  const storyQuantities =
    storyInput?.screen?.target?.quantities ?? undefined;
  if (storyQuantities !== undefined) {
    return storyQuantities as ReadonlyArray<TestScreenQuantity>;
  }
  const lines = quantityLines(puzzle).map((line) => ({
    name: line.split('=')[0].trim(),
    hidden: line.includes('?'),
  }));
  if (lines.length !== roleByPosition.length) {
    throw new Error('The session item exposes no readable quantity list.');
  }
  return lines.map((line, index) => ({
    id: '',
    label: line.name,
    variableName: line.name,
    displayValue: line.hidden ? '?' : '',
    role: roleByPosition[index],
    given: { kind: line.hidden ? 'hidden' : 'known' },
  }));
}

const roleByPosition = ['base', 'count', 'per-item', 'total'] as const;

function roleNames(puzzle: MathModelingPuzzle): Record<string, string> {
  return Object.fromEntries(
    screenQuantities(puzzle).map((quantity) => [
      quantity.role,
      quantity.variableName,
    ]),
  );
}

function hiddenIdOf(puzzle: MathModelingPuzzle): string {
  const hidden = screenQuantities(puzzle).find(
    (quantity) => quantity.given.kind === 'hidden',
  );
  if (hidden === undefined) {
    throw new Error('The session item has no hidden quantity.');
  }
  return hidden.id;
}

async function answerCurrent(puzzle: MathModelingPuzzle): Promise<void> {
  const names = roleNames(puzzle);
  const hiddenId = hiddenIdOf(puzzle);

  const storyChoiceInput = puzzle.shadowRoot?.querySelector(
    'story-choice-input',
  ) as (HTMLElement & { updateComplete: Promise<unknown> }) | null;
  if (storyChoiceInput !== null) {
    const matchingRadio = Array.from(
      storyChoiceInput.shadowRoot?.querySelectorAll<HTMLInputElement>(
        'input[name="story-choice"]',
      ) ?? [],
    ).find((radio) => radio.value === 'matching');
    expect(matchingRadio).toBeDefined();
    matchingRadio!.checked = true;
    storyChoiceInput.shadowRoot?.querySelector('form')?.requestSubmit();
    await puzzle.updateComplete;
    return;
  }
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
      checkbox.checked = checkbox.value !== hiddenId;
    }
    for (const radio of Array.from(
      task.shadowRoot?.querySelectorAll<HTMLInputElement>(
        'input[name="unknown-quantity"]',
      ) ?? [],
    )) {
      radio.checked = radio.value === hiddenId;
    }
    task.shadowRoot?.querySelector('form')?.requestSubmit();
    await puzzle.updateComplete;
    return;
  }

  const heading = shellText(puzzle);
  if (heading.includes('Named equation to academic notation')) {
    const lines = quantityLines(puzzle).map((line) => {
      const [name, value] = line.split('=').map((part) => part.trim());
      return { name, value, hidden: value === '?' };
    });
    const known = Object.fromEntries(
      lines.filter((line) => !line.hidden).map((line) => [line.name, line.value]),
    );
    const symbols: Record<string, string> = {
      base: 'b',
      count: 'n',
      'per-item': 'p',
      total: 'T',
    };
    const termOf = (role: string): string =>
      known[names[role]] ?? symbols[role];
    const academic = `${termOf('total')} = ${
      names.base === undefined ? '' : `${termOf('base')} + `
    }${termOf('count')}*${termOf('per-item')}`;
    await submitText(puzzle, academic);
    return;
  }

  expect(names.total).toBeDefined();
  const baseTerm = names.base === undefined ? '' : `${names.base} + `;
  await submitText(
    puzzle,
    `${names.total} = ${baseTerm}${names.count} * ${names['per-item']}`,
  );
}

test('starts a session from the default single-puzzle view via the menu', async () => {
  document.body.innerHTML = `
    <home-screen hidden></home-screen>
    <math-modeling-puzzle
      seed="17"
      theme="gaming.drone-power"
      mode="story-to-quantities"
      locale="en"
      input-mode="text"
    ></math-modeling-puzzle>
  `;
  startMathModelingApplication({
    hash: '#puzzle?seed=17&scenario=gaming.drone-power&task=story-to-quantities&language=en',
    root: document,
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
  expect(window.location.hash).toBe(
    '#session?seed=918273&scenario=gaming.drone-power&language=en',
  );
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
  expect(summaryText).toContain('Named equation to academic notation: 2');
  expect(summaryText).toContain('Academic notation to named equation: 2');
  expect(summaryText).toContain('Named model to matching story: 2');
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
  const isStoryChoiceItem =
    puzzle.shadowRoot?.querySelector('story-choice-input') !== null;
  if (isStoryChoiceItem) {
    await submitWrongStoryChoice(puzzle);
  } else {
    await submitText(puzzle, 'wrong = wrong');
  }
  await puzzle.updateComplete;
  const logItems = Array.from(
    puzzle.shadowRoot?.querySelectorAll('.answer-log-list li') ?? [],
  ).map((item) => (item.textContent ?? '').replace(/\s+/g, ' ').trim());
  expect(logItems).toHaveLength(1);
  if (!isStoryChoiceItem) {
    expect(logItems[0]).toContain('wrong = wrong');
  }
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
  expect(window.location.hash).toBe('#home?language=en');
  const home = document.querySelector('home-screen');
  expect(home?.hidden ?? true).toBe(false);
  expect(puzzle.hidden).toBe(true);
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

test('the active session menu shows the session seed and the current task', async () => {
  const puzzle = await mountSession(
    '#session?seed=918273&scenario=gaming.drone-power&language=en',
  );
  await puzzle.updateComplete;
  const menu = puzzle.shadowRoot?.querySelector('puzzle-menu');
  expect(menu).not.toBeNull();
  const seedInput = menu!.shadowRoot?.querySelector(
    'input[name="seed"]',
  ) as HTMLInputElement | null;
  expect(seedInput).not.toBeNull();
  expect(seedInput!.value).toBe('918273');
  const taskSelect = menu!.shadowRoot?.querySelector(
    'select[name="task"]',
  ) as HTMLSelectElement | null;
  expect(taskSelect).not.toBeNull();
  expect(taskSelect!.selectedOptions[0]?.textContent?.trim()).toBe(
    'Named model to matching story',
  );
  await answerCurrent(puzzle);
  const nextButton = page.getByRole('button', { name: 'Next puzzle' });
  await nextButton.click();
  await puzzle.updateComplete;
  expect(taskSelect!.selectedOptions[0]?.textContent?.trim()).toBe(
    'Academic notation to named equation',
  );
  expect(seedInput!.value).toBe('918273');
});

test('the active session header offers a persistent way back to home', async () => {
  const puzzle = await mountSession();
  const homeButton = page.getByRole('button', { name: 'Home' });
  await homeButton.click();
  await puzzle.updateComplete;
  expect(window.location.hash).toBe('#home?language=en');
  const home = document.querySelector('home-screen');
  expect(home?.hidden ?? true).toBe(false);
  expect(puzzle.hidden).toBe(true);
});

test('switching locale during an active session stays in the same session', async () => {
  const puzzle = await mountSession(
    '#session?seed=918273&scenario=gaming.drone-power&language=en',
  );
  expect(shellText(puzzle)).toContain('Puzzle 1 / 10');
  const hasTextInput =
    puzzle.shadowRoot?.querySelector('named-equation-text-input') !== null;
  if (hasTextInput) {
    await submitText(puzzle, 'wrong = wrong');
  } else {
    await submitWrongStoryChoice(puzzle);
  }
  await puzzle.updateComplete;

  const localeSelect = puzzle.shadowRoot?.querySelector(
    'label.language-control select',
  ) as HTMLSelectElement;
  expect(localeSelect).not.toBeNull();
  localeSelect.value = 'nb';
  localeSelect.dispatchEvent(new Event('change'));
  await puzzle.updateComplete;

  expect(window.location.hash).toBe(
    '#session?seed=918273&scenario=gaming.drone-power&language=nb',
  );
  expect(shellText(puzzle)).toContain('Oppgave 1 / 10');
  expect(shellText(puzzle)).not.toContain('Story to quantities');
  const logItems = Array.from(
    puzzle.shadowRoot?.querySelectorAll('.answer-log-list li') ?? [],
  ).map((item) => (item.textContent ?? '').replace(/\s+/g, ' ').trim());
  expect(logItems).toHaveLength(1);
  expect(logItems[0]).toContain(
    hasTextInput ? 'wrong = wrong' : 'choice=factor-into-group',
  );
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
