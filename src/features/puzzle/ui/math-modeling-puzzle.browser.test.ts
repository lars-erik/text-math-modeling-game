import { expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { startMathModelingApplication } from '../../../application';
import { MathModelingPuzzle } from './math-modeling-puzzle';
import { katexAcademicDisplayAdapter } from './katex-academic-display-adapter';
import './math-modeling-puzzle';
import '../../navigation/ui/home-screen';

function mountPuzzle(hash: string): MathModelingPuzzle {
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
    hash,
    root: document,
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

function quantityLinesOf(puzzle: MathModelingPuzzle): string[] {
  return Array.from(
    puzzle.shadowRoot?.querySelectorAll('div[slot="source"] li') ?? [],
  ).map((item) => (item.textContent ?? '').replace(/\s+/g, ' ').trim());
}

async function submitCorrectGroupsTotalEquation(puzzle: MathModelingPuzzle) {
  const inputComponent = puzzle.shadowRoot?.querySelector(
    'named-equation-text-input',
  ) as (HTMLElement & { updateComplete: Promise<unknown> }) | null;
  expect(inputComponent).not.toBeNull();
  await inputComponent!.updateComplete;
  const input = inputComponent!.shadowRoot?.querySelector(
    'input[type="text"]',
  ) as HTMLInputElement | null;
  expect(input).not.toBeNull();
  input!.value = 'totalPower = droneCount * dronePower';
  inputComponent!.shadowRoot?.querySelector('form')?.requestSubmit();
  await puzzle.updateComplete;
  expect(shellText(puzzle)).toContain(
    'The equation matches the quantity model.',
  );
}

test('switches tasks and input modes while the story stays visible and the math is identical', async () => {
  const puzzle = mountPuzzle(
    '#puzzle?seed=17&scenario=gaming.drone-power&task=story-to-quantities&language=en',
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
    'totalPower = basePower + droneCount + dronePower',
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
    'Base power is added once overall. In your equation it is multiplied by the number of drones, so it is applied once per item.',
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

test('the puzzle header offers a persistent way back to home', async () => {
  const puzzle = mountPuzzle(
    '#puzzle?seed=17&scenario=gaming.drone-power&task=story-to-quantities&language=en',
  );
  await puzzle.updateComplete;
  const homeButton = page.getByRole('button', { name: 'Home' });
  await homeButton.click();
  await puzzle.updateComplete;
  expect(window.location.hash).toBe('#home?language=en');
  const home = document.querySelector('home-screen');
  expect(home?.hidden ?? true).toBe(false);
  expect(puzzle.hidden).toBe(true);
});

test('varies the hidden role from the route while the values stay identical', async () => {
  const baseHash =
    '#puzzle?seed=17&scenario=gaming.drone-power&task=quantities-to-named-equation&language=en';
  const perItem = mountPuzzle(baseHash);
  await perItem.updateComplete;
  const perItemLines = quantityLinesOf(perItem);
  expect(perItemLines.join('\n')).toContain('dronePower = ?');
  expect(perItemLines.join('\n')).not.toContain('droneCount = ?');

  const countHidden = mountPuzzle(
    '#puzzle?seed=17&hidden-role=count&scenario=gaming.drone-power&task=quantities-to-named-equation&language=en',
  );
  await countHidden.updateComplete;
  const countHiddenLines = quantityLinesOf(countHidden);
  expect(countHiddenLines.join('\n')).toContain('droneCount = ?');
  expect(countHiddenLines.join('\n')).not.toContain('dronePower = ?');
  const valuesOf = (
    lines: string[],
  ): Record<string, string | '?'> =>
    Object.fromEntries(
      lines.map((line) => {
        const [name, rawValue] = line.split('=').map((part) => part.trim());
        return [name, rawValue === '?' ? '?' : rawValue] as [string, string | '?'];
      }),
    );
  const perItemValues = valuesOf(perItemLines);
  const countHiddenValues = valuesOf(countHiddenLines);
  for (const [name, value] of Object.entries(perItemValues)) {
    const other = countHiddenValues[name];
    if (value === '?' || other === '?') {
      continue;
    }
    expect(other, `known value of ${name} must be role-independent`).toBe(value);
  }
  expect(countHiddenValues.droneCount).toBe('?');
  expect(perItemValues.droneCount).not.toBe('?');
  expect(countHiddenValues.dronePower).not.toBe('?');
  expect(perItemValues.dronePower).toBe('?');
  expect(countHiddenValues.totalPower).toBe(perItemValues.totalPower);

  const totalHidden = mountPuzzle(
    '#puzzle?seed=17&hidden-role=per-item&scenario=gaming.drone-power&task=quantities-to-named-equation&language=en',
  );
  await totalHidden.updateComplete;
  const menu = totalHidden.shadowRoot?.querySelector('puzzle-menu');
  const hiddenRoleSelect = menu?.shadowRoot?.querySelector(
    'select[name="hidden-role"]',
  ) as HTMLSelectElement | null;
  expect(hiddenRoleSelect).not.toBeNull();
  expect(
    Array.from(hiddenRoleSelect!.options).map((option) => option.value),
  ).toEqual(['per-item', 'base', 'count', 'total']);
  hiddenRoleSelect!.value = 'total';
  menu?.shadowRoot?.querySelector('form')?.requestSubmit();
  await totalHidden.updateComplete;
  expect(window.location.hash).toBe(
    '#puzzle?seed=17&family=total-from-parts&hidden-role=total&scenario=gaming.drone-power&task=quantities-to-named-equation&language=en',
  );
  expect(quantityLinesOf(totalHidden).join('\n')).toContain('totalPower = ?');
});

test('changing the family normalizes an unsupported hidden role and still submits', async () => {
  const puzzle = mountPuzzle(
    '#puzzle?seed=17&family=total-from-parts&hidden-role=base&scenario=gaming.drone-power&task=quantities-to-named-equation&language=en',
  );
  await puzzle.updateComplete;
  expect(puzzle.family).toBe('total-from-parts');
  expect(puzzle.hiddenRole).toBe('base');
  expect(quantityLinesOf(puzzle).join('\n')).toContain('basePower = ?');

  const menu = puzzle.shadowRoot?.querySelector('puzzle-menu');
  const familySelect = menu?.shadowRoot?.querySelector(
    'select[name="family"]',
  ) as HTMLSelectElement | null;
  expect(familySelect).not.toBeNull();
  familySelect!.value = 'groups-total';
  familySelect!.dispatchEvent(new Event('change'));
  const menuElement = menu as (HTMLElement & {
    updateComplete: Promise<unknown>;
  }) | null;
  await menuElement?.updateComplete;
  menu?.shadowRoot?.querySelector('form')?.requestSubmit();
  await puzzle.updateComplete;
  await new Promise((resolve) => setTimeout(resolve, 250));

  expect(globalThis.location.hash).toContain('family=groups-total');
  expect(globalThis.location.hash).toContain('hidden-role=per-item');
  expect(puzzle.family).toBe('groups-total');
  const hiddenRoleSelect = menu?.shadowRoot?.querySelector(
    'select[name="hidden-role"]',
  ) as HTMLSelectElement | null;
  expect(hiddenRoleSelect).not.toBeNull();
  expect(
    Array.from(hiddenRoleSelect!.options).map((option) => option.value),
  ).toEqual(['per-item', 'count', 'total']);
  expect(hiddenRoleSelect!.value).toBe('per-item');

  const quantities = quantityLinesOf(puzzle);
  expect(quantities).toEqual([
    'droneCount = 9',
    'dronePower = ?',
    'totalPower = 63',
  ]);
  await submitCorrectGroupsTotalEquation(puzzle);
});

test('replays the same problem from the URL state', async () => {
  const hash = '#puzzle?seed=321&scenario=creator.followers&task=quantities-to-named-equation&language=en';
  const first = mountPuzzle(hash);
  await first.updateComplete;
  const firstStory = storyOf(first);
  const firstQuantities = Array.from(
    first.shadowRoot?.querySelectorAll('div[slot="source"] li') ?? [],
  ).map((item) => item.textContent);

  const second = mountPuzzle(hash);
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
    '#puzzle?seed=321&scenario=creator.followers&task=named-equation-to-academic-notation&language=nb',
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
  input!.value = '67 = 25 + 6p';
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
  const hash = '#puzzle?seed=321&scenario=creator.followers&task=academic-notation-to-named-equation&language=nb';
  const puzzle = mountPuzzle(hash);
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

test('explains the base-applied-per-item misconception and preserves the learner input', async () => {
  const puzzle = mountPuzzle(
    '#puzzle?seed=17&scenario=gaming.drone-power&task=quantities-to-named-equation&language=en',
  );
  await puzzle.updateComplete;
  const inputComponent = puzzle.shadowRoot?.querySelector(
    'named-equation-text-input',
  ) as (HTMLElement & { updateComplete: Promise<unknown> }) | null;
  expect(inputComponent).not.toBeNull();
  await inputComponent!.updateComplete;
  const input = inputComponent!.shadowRoot?.querySelector('input');
  expect(input).not.toBeNull();
  input!.value = 'totalPower = droneCount * (basePower + dronePower)';
  inputComponent!.shadowRoot?.querySelector('form')?.requestSubmit();
  await puzzle.updateComplete;
  expect(shellText(puzzle)).toContain(
    'Base power is added once overall. In your equation it is multiplied by the number of drones, so it is applied once per item.',
  );
  const preservedInput = puzzle.shadowRoot?.querySelector(
    'named-equation-text-input',
  ) as (HTMLElement & { value: string }) | null;
  expect(preservedInput?.value).toBe(
    'totalPower = droneCount * (basePower + dronePower)',
  );
  const preservedField = (
    preservedInput as (HTMLElement & { shadowRoot: ShadowRoot }) | null
  )?.shadowRoot?.querySelector('input');
  expect(preservedField?.value).toBe(
    'totalPower = droneCount * (basePower + dronePower)',
  );
  expect(preservedField?.hasAttribute('disabled')).toBe(false);
  expect(preservedField?.getAttribute('readonly')).toBeNull();
  preservedField!.value = 'totalPower = basePower + droneCount * dronePower';
  inputComponent!.shadowRoot?.querySelector('form')?.requestSubmit();
  await puzzle.updateComplete;
  expect(shellText(puzzle)).toContain(
    'The equation matches the quantity model.',
  );
});


test('accepts mixed-case named equation identifiers', async () => {
  const puzzle = mountPuzzle(
    '#puzzle?seed=17&scenario=gaming.drone-power&task=quantities-to-named-equation&language=en',
  );
  await puzzle.updateComplete;

  const inputComponent = puzzle.shadowRoot?.querySelector(
    'named-equation-text-input',
  ) as (HTMLElement & { updateComplete: Promise<unknown> }) | null;
  expect(inputComponent).not.toBeNull();
  await inputComponent!.updateComplete;

  const input = inputComponent!.shadowRoot?.querySelector('input');
  expect(input).not.toBeNull();
  input!.value =
    'TOTALPOWER = basepower + DRONECOUNT * DronePower';
  inputComponent!.shadowRoot?.querySelector('form')?.requestSubmit();
  await puzzle.updateComplete;

  expect(shellText(puzzle)).toContain(
    'The equation matches the quantity model.',
  );
});
