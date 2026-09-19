import { expect, test } from 'vitest';
import { startMathModelingApplication } from '../../../application';
import { MathModelingPuzzle } from './math-modeling-puzzle';
import { katexAcademicDisplayAdapter } from './katex-academic-display-adapter';
import './math-modeling-puzzle';

function mountPuzzle(search: string): MathModelingPuzzle {
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
    search,
    root: document,
    replaceSearch: (next) => {
      window.history.replaceState(null, '', next);
    },
  });
  const element = document.querySelector('math-modeling-puzzle');
  expect(element).toBeInstanceOf(MathModelingPuzzle);
  const puzzle = element as MathModelingPuzzle;
  puzzle.academicDisplayAdapter = katexAcademicDisplayAdapter;
  return puzzle;
}

function shellText(puzzle: MathModelingPuzzle): string {
  const shell = puzzle.shadowRoot?.querySelector('puzzle-shell');
  return shell?.shadowRoot?.textContent ?? '';
}

function storyOf(puzzle: MathModelingPuzzle): string {
  return (
    puzzle.shadowRoot?.querySelector('div[slot="source"] p')?.textContent ?? ''
  );
}

test('switches tasks and input modes while the story stays visible and the math is identical', async () => {
  const puzzle = mountPuzzle(
    '?seed=17&scenario=gaming.drone-power&task=story-to-quantities',
  );
  await puzzle.updateComplete;

  expect(shellText(puzzle)).toContain('Story to quantities');
  const story = storyOf(puzzle);
  expect(story.length).toBeGreaterThan(0);
  expect(puzzle.shadowRoot?.textContent).toContain('?');

  const menu = puzzle.shadowRoot?.querySelector('puzzle-menu');
  const taskSelect = menu?.shadowRoot?.querySelector(
    'select[name="task"]',
  ) as HTMLSelectElement | null;
  expect(taskSelect).not.toBeNull();
  taskSelect!.value = 'quantities-to-named-equation';
  menu?.shadowRoot?.querySelector('form')?.requestSubmit();
  await puzzle.updateComplete;
  await new Promise((resolve) => setTimeout(resolve, 50));

  expect(shellText(puzzle)).toContain('Quantities to named equation');
  expect(storyOf(puzzle)).toBe(story);

  const textInput = puzzle.shadowRoot?.querySelector(
    'named-equation-text-input',
  ) as (HTMLElement & { updateComplete: Promise<unknown> }) | null;
  expect(textInput).not.toBeNull();
  await textInput!.updateComplete;

  const multipleChoiceButton = Array.from(
    puzzle.shadowRoot?.querySelectorAll<HTMLButtonElement>('nav button') ?? [],
  ).find((button) => button.textContent?.trim() === 'Multiple choice');
  expect(multipleChoiceButton).toBeDefined();
  multipleChoiceButton!.click();
  await puzzle.updateComplete;

  expect(storyOf(puzzle)).toBe(story);
  const choiceInput = puzzle.shadowRoot?.querySelector(
    'named-equation-choice-input',
  ) as (HTMLElement & { updateComplete: Promise<unknown> }) | null;
  expect(choiceInput).not.toBeNull();
  await choiceInput!.updateComplete;
  const labels = Array.from(
    choiceInput!.shadowRoot?.querySelectorAll('label') ?? [],
  ).map((label) => label.textContent?.trim());
  expect(labels).toEqual([
    'totalPower = basePower + droneCount * dronePower',
    'totalPower = droneCount * (basePower + dronePower)',
  ]);

  const distractorRadio = choiceInput!.shadowRoot?.querySelector(
    'input[value="factor-into-group"]',
  ) as HTMLInputElement | null;
  expect(distractorRadio).not.toBeNull();
  distractorRadio!.checked = true;
  choiceInput!.shadowRoot?.querySelector('form')?.requestSubmit();
  await Promise.all([
    puzzle.updateComplete,
    choiceInput!.updateComplete,
    new Promise((resolve) => setTimeout(resolve, 50)),
  ]);
  await puzzle.updateComplete;
  expect(shellText(puzzle)).toContain(
    'The equation grouping does not match the quantity model.',
  );
  const checkedRadio = choiceInput!.shadowRoot?.querySelector(
    'input[value="factor-into-group"]',
  ) as HTMLInputElement | null;
  expect(checkedRadio?.checked).toBe(true);
  const textButton = Array.from(
    puzzle.shadowRoot?.querySelectorAll<HTMLButtonElement>('nav button') ?? [],
  ).find((button) => button.textContent?.trim() === 'Text input');
  expect(textButton).toBeDefined();
  textButton!.click();
  await puzzle.updateComplete;
  expect(
    puzzle.shadowRoot?.querySelector('named-equation-text-input'),
  ).not.toBeNull();
  expect(storyOf(puzzle)).toBe(story);
});

test('replays the same problem from the URL state', async () => {
  const search =
    '?seed=321&scenario=creator.followers&task=quantities-to-named-equation&locale=en';
  const first = mountPuzzle(search);
  await first.updateComplete;
  const firstStory = storyOf(first);
  const firstQuantities = Array.from(
    first.shadowRoot?.querySelectorAll('div[slot="source"] li') ?? [],
  ).map((item) => item.textContent);

  const second = mountPuzzle(search);
  await second.updateComplete;
  expect(storyOf(second)).toBe(firstStory);
  expect(
    Array.from(
      second.shadowRoot?.querySelectorAll('div[slot="source"] li') ?? [],
    ).map((item) => item.textContent),
  ).toEqual(firstQuantities);
  expect(second.shadowRoot?.textContent).toContain('67');
});

test('completes named equation to academic notation and renders the accepted relation with KaTeX', async () => {
  const puzzle = mountPuzzle(
    '?seed=321&scenario=creator.followers&task=named-equation-to-academic-notation&locale=nb',
  );
  await puzzle.updateComplete;

  expect(shellText(puzzle)).toContain(
    'Fra navngitt likning til akademisk notasjon',
  );
  expect(storyOf(puzzle).length).toBeGreaterThan(0);
  expect(puzzle.shadowRoot?.textContent).toContain(
    '67 = 25 + 6 * foelgerePerInnlegg',
  );
  expect(puzzle.shadowRoot?.textContent).toContain('foelgerePerInnlegg');

  const inputComponent = puzzle.shadowRoot?.querySelector(
    'named-equation-text-input',
  ) as (HTMLElement & { updateComplete: Promise<unknown> }) | null;
  expect(inputComponent).not.toBeNull();
  await inputComponent!.updateComplete;
  const input = inputComponent!.shadowRoot?.querySelector('input');
  expect(input).not.toBeNull();
  input!.value = '67 = 25 + 6*p';
  inputComponent!.shadowRoot?.querySelector('form')?.requestSubmit();
  await puzzle.updateComplete;

  expect(shellText(puzzle)).toContain(
    'Den akademiske notasjonen stemmer med sammenhengen.',
  );
  const display = puzzle.shadowRoot?.querySelector(
    'academic-notation-display',
  ) as (HTMLElement & { updateComplete: Promise<unknown> }) | null;
  expect(display).not.toBeNull();
  await display!.updateComplete;
  expect(display!.shadowRoot?.querySelector('.katex')).not.toBeNull();
  expect(display!.shadowRoot?.querySelector('.output')?.getAttribute('aria-label')).toBe(
    '67 = 25 + 6p',
  );
});

test('replays academic notation to named equation and accepts Theme-localized names', async () => {
  const search =
    '?seed=321&scenario=creator.followers&task=academic-notation-to-named-equation&locale=nb';
  const puzzle = mountPuzzle(search);
  await puzzle.updateComplete;

  expect(shellText(puzzle)).toContain(
    'Fra akademisk notasjon til navngitt likning',
  );
  expect(storyOf(puzzle).length).toBeGreaterThan(0);
  const sourceDisplay = puzzle.shadowRoot?.querySelector(
    'academic-notation-display',
  ) as (HTMLElement & { updateComplete: Promise<unknown> }) | null;
  expect(sourceDisplay).not.toBeNull();
  await sourceDisplay!.updateComplete;
  expect(sourceDisplay!.shadowRoot?.querySelector('.katex')).not.toBeNull();
  expect(sourceDisplay!.shadowRoot?.querySelector('.output')?.getAttribute('aria-label')).toBe(
    '67 = 25 + 6p',
  );

  const inputComponent = puzzle.shadowRoot?.querySelector(
    'named-equation-text-input',
  ) as (HTMLElement & { updateComplete: Promise<unknown> }) | null;
  expect(inputComponent).not.toBeNull();
  await inputComponent!.updateComplete;
  const input = inputComponent!.shadowRoot?.querySelector('input');
  expect(input).not.toBeNull();
  input!.value =
    'sluttFoelgere = startFoelgere + promoterteInnlegg * foelgerePerInnlegg';
  inputComponent!.shadowRoot?.querySelector('form')?.requestSubmit();
  await puzzle.updateComplete;

  expect(shellText(puzzle)).toContain(
    'Den navngitte likningen stemmer med sammenhengen.',
  );
});
