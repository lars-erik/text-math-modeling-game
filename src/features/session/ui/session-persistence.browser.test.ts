import { expect, test } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { startMathModelingApplication } from '../../../application';
import { MathModelingPuzzle } from '../../puzzle/ui/math-modeling-puzzle';
import { HomeScreen } from '../../navigation/ui/home-screen';
import { katexAcademicDisplayAdapter } from '../../puzzle/ui/katex-academic-display-adapter';
import { createSessionRunStore } from '../session-run-store';
import {
  createLocalStorageSessionPersistence,
  sessionStorageKeys,
} from '../persistence/local-storage-session-repository';
import { createStorageRunIdMemory } from '../persistence/browser-run-id-memory';
import { navigationResources } from '../../navigation/lang';
import type { PuzzleLocale } from '../../puzzle/lang';
import '../../puzzle/ui/math-modeling-puzzle';
import '../../navigation/ui/home-screen';

const sessionOptions = {
  seed: 918273,
  themeId: 'gaming.drone-power' as const,
  locale: 'en' as PuzzleLocale,
};

function mountApp(initialHash: string): {
  puzzle: MathModelingPuzzle;
  home: HomeScreen;
  reload: (nextHash: string) => { puzzle: MathModelingPuzzle; home: HomeScreen };
} {
  const start = (
    hash: string = initialHash,
  ): { puzzle: MathModelingPuzzle; home: HomeScreen } => {
    document.body.innerHTML = `
      <home-screen hidden></home-screen>
      <math-modeling-puzzle
        theme="gaming.drone-power"
        input-mode="text"
      ></math-modeling-puzzle>
    `;
    startMathModelingApplication({
      hash,
      root: document,
      sessionRunStore: createSessionRunStore({
        ...createLocalStorageSessionPersistence({
          storage: window.localStorage,
        }),
        runIdMemory: createStorageRunIdMemory(window.sessionStorage),
      }),
    });
    const puzzle = document.querySelector(
      'math-modeling-puzzle',
    ) as MathModelingPuzzle;
    puzzle.academicDisplayAdapter = katexAcademicDisplayAdapter;
    const home = document.querySelector('home-screen') as HomeScreen;
    return { puzzle, home };
  };
  const initial = start();
  return {
    ...initial,
    reload: (nextHash: string) => {
      const next = start(nextHash);
      return next;
    },
  };
}

function shellText(puzzle: MathModelingPuzzle): string {
  const shell = puzzle.shadowRoot?.querySelector('puzzle-shell');
  return shell?.shadowRoot?.textContent ?? '';
}

function quantityLines(puzzle: MathModelingPuzzle): string[] {
  return Array.from(
    puzzle.shadowRoot?.querySelectorAll('div[slot="source"] li') ?? [],
  ).map((item) => (item.textContent ?? '').trim());
}

function knownValue(line: string): string | undefined {
  return line.includes('?') ? undefined : line.split('=')[1]?.trim();
}

function homeText(home: HomeScreen): string {
  return home.shadowRoot?.textContent ?? '';
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

test('a session survives an application reload and Home continue restores the same run', async () => {
  localStorage.clear();
  sessionStorage.clear();
  window.location.hash =
    '#session?seed=918273&scenario=gaming.drone-power&language=en';
  const app = mountApp(window.location.hash);
  await app.puzzle.updateComplete;
  await app.home.updateComplete;
  expect(shellText(app.puzzle)).toContain('Puzzle 1 / 10');

  await answerCurrentCorrect(app.puzzle);
  const logAfterWrong = Array.from(
    app.puzzle.shadowRoot?.querySelectorAll('.answer-log-list li') ?? [],
  ).map((item) => (item.textContent ?? '').trim());
  expect(logAfterWrong.length).toBeGreaterThan(0);
  const nextButton = page.getByRole('button', { name: 'Next puzzle' });
  await nextButton.click();
  await app.puzzle.updateComplete;
  expect(shellText(app.puzzle)).toContain('Puzzle 2 / 10');
  const persisted = JSON.parse(
    window.localStorage.getItem(sessionStorageKeys.profile) ?? '{}',
  ) as { activeSession?: { answerLog?: unknown[] } };
  expect(persisted.activeSession?.answerLog?.length).toBeGreaterThan(0);

  const reloaded = app.reload(window.location.hash);
  await reloaded.puzzle.updateComplete;
  expect(shellText(reloaded.puzzle)).toContain('Puzzle 2 / 10');
  const restoredLog = Array.from(
    reloaded.puzzle.shadowRoot?.querySelectorAll('.answer-log-list li') ?? [],
  ).map((item) => (item.textContent ?? '').trim());
  expect(restoredLog.length).toBeGreaterThan(0);

  const backHome = page.getByRole('button', { name: 'Home' });
  await backHome.click();
  await reloaded.puzzle.updateComplete;
  await reloaded.home.updateComplete;
  expect(window.location.hash).toBe('#home?language=en');
  expect(reloaded.home.hidden).toBe(false);
  expect(reloaded.puzzle.hidden).toBe(true);
  expect(homeText(reloaded.home)).toContain('Continue session');
  expect(homeText(reloaded.home)).toContain('No completed sessions yet.');
  const continueButton = page.getByRole('button', {
    name: 'Continue session',
  });
  await continueButton.click();
  await reloaded.puzzle.updateComplete;
  expect(window.location.hash).toBe(
    '#session?seed=918273&scenario=gaming.drone-power&language=en',
  );
  expect(shellText(reloaded.puzzle)).toContain('Puzzle 2 / 10');
});

test('a fresh replay link starts a new run instead of resuming the saved one', async () => {
  localStorage.clear();
  sessionStorage.clear();
  window.location.hash =
    '#session?seed=918273&scenario=gaming.drone-power&language=en';
  const app = mountApp(window.location.hash);
  await app.puzzle.updateComplete;
  await answerCurrentCorrect(app.puzzle);
  const nextButton = page.getByRole('button', { name: 'Next puzzle' });
  await nextButton.click();
  await app.puzzle.updateComplete;
  expect(shellText(app.puzzle)).toContain('Puzzle 2 / 10');

  sessionStorage.removeItem('math-modeling-game:session:current-run-id');
  const replayed = app.reload(
    '#session?seed=918273&scenario=gaming.drone-power&language=en',
  );
  await replayed.puzzle.updateComplete;
  expect(shellText(replayed.puzzle)).toContain('Puzzle 1 / 10');
  expect(
    Array.from(
      replayed.puzzle.shadowRoot?.querySelectorAll('.answer-log-list li') ??
        [],
    ),
  ).toHaveLength(0);
});

test('starting a session from Home after completing a run begins a fresh run in the same mounted app', async () => {
  localStorage.clear();
  sessionStorage.clear();
  window.location.hash =
    '#session?seed=918273&scenario=gaming.drone-power&language=en';
  const app = mountApp(window.location.hash);
  await app.puzzle.updateComplete;
  const total = 10;
  for (let index = 1; index <= total; index += 1) {
    if (index > 1) {
      const next = page.getByRole('button', { name: 'Next puzzle' });
      await next.click();
      await app.puzzle.updateComplete;
    }
    await answerCurrentCorrect(app.puzzle);
  }
  const finalNext = page.getByRole('button', { name: 'Next puzzle' });
  await finalNext.click();
  await app.puzzle.updateComplete;
  expect(shellText(app.puzzle)).toContain('Session complete');
  const backHome = page.getByRole('button', { name: 'Back to start' });
  await backHome.click();
  await app.puzzle.updateComplete;
  await app.home.updateComplete;
  expect(homeText(app.home)).toContain(
    'Session seed 918273 — 10 puzzles completed',
  );
  expect(homeText(app.home)).not.toContain('Continue session');

  const startSessionButton = page.getByRole('button', {
    name: 'Start session',
  });
  await startSessionButton.click();
  await app.puzzle.updateComplete;
  expect(shellText(app.puzzle)).toContain('Puzzle 1 / 10');
  expect(
    Array.from(
      app.puzzle.shadowRoot?.querySelectorAll('.answer-log-list li') ?? [],
    ),
  ).toHaveLength(0);
  const persisted = JSON.parse(
    window.localStorage.getItem(sessionStorageKeys.profile) ?? '{}',
  ) as { activeSession?: { runId?: string; currentIndex?: number } };
  expect(persisted.activeSession?.currentIndex).toBe(0);
  const history = JSON.parse(
    window.localStorage.getItem(sessionStorageKeys.completedRuns) ?? '[]',
  ) as { runId?: string }[];
  expect(history).toHaveLength(1);
});

test('a completed session appears in history and is never offered as active', async () => {
  localStorage.clear();
  sessionStorage.clear();
  window.location.hash =
    '#session?seed=918273&scenario=gaming.drone-power&language=en';
  const app = mountApp(window.location.hash);
  await app.puzzle.updateComplete;
  expect(shellText(app.puzzle)).toContain('Puzzle 1 / 10');
  const total = 10;
  for (let index = 1; index <= total; index += 1) {
    if (index > 1) {
      const next = page.getByRole('button', { name: 'Next puzzle' });
      await next.click();
      await app.puzzle.updateComplete;
    }
    await answerCurrentCorrect(app.puzzle);
  }
  const finalNext = page.getByRole('button', { name: 'Next puzzle' });
  await finalNext.click();
  await app.puzzle.updateComplete;
  expect(shellText(app.puzzle)).toContain('Session complete');

  const backHome = page.getByRole('button', { name: 'Back to start' });
  await backHome.click();
  await app.puzzle.updateComplete;
  await app.home.updateComplete;
  const home = homeText(app.home);
  expect(home).toContain('Session seed 918273 — 10 puzzles completed');
  expect(home).not.toContain('Continue session');

  const reloaded = app.reload('#home?language=en');
  await reloaded.home.updateComplete;
  expect(homeText(reloaded.home)).not.toContain('Continue session');
  expect(homeText(reloaded.home)).toContain(
    'Session seed 918273 — 10 puzzles completed',
  );
  const startSessionButton = page.getByRole('button', {
    name: 'Start session',
  });
  await startSessionButton.click();
  await reloaded.puzzle.updateComplete;
  expect(shellText(reloaded.puzzle)).toContain('Puzzle 1 / 10');
  expect(
    Array.from(
      reloaded.puzzle.shadowRoot?.querySelectorAll('.answer-log-list li') ??
        [],
    ),
  ).toHaveLength(0);
});

test('home keeps the selected language when resuming', async () => {
  localStorage.clear();
  sessionStorage.clear();
  window.location.hash =
    '#session?seed=918273&scenario=gaming.drone-power&language=nb';
  const app = mountApp(window.location.hash);
  await app.puzzle.updateComplete;
  const languageSelect = app.puzzle.shadowRoot?.querySelector('select');
  expect(languageSelect?.value).toBe('nb');
  await answerCurrentCorrect(app.puzzle);
  const nextButton = page.getByRole('button', { name: 'Neste oppgave' });
  await nextButton.click();
  await app.puzzle.updateComplete;
  expect(shellText(app.puzzle)).toContain('Oppgave 2 / 10');

  const backHome = page.getByRole('button', { name: 'Hjem' });
  await backHome.click();
  await app.home.updateComplete;
  expect(window.location.hash).toBe('#home?language=nb');
  expect(app.home.locale).toBe('nb');
  expect(homeText(app.home)).toContain('Fortsett økt');
  const continueButton = page.getByRole('button', { name: 'Fortsett økt' });
  await continueButton.click();
  await app.puzzle.updateComplete;
  expect(app.puzzle.locale).toBe('nb');
  expect(shellText(app.puzzle)).toContain('Oppgave 2 / 10');
  expect(
    navigationResources.nb.home.continueLabel,
  ).toBe('Fortsett økt');
  void sessionOptions;
});

async function answerCurrentCorrect(puzzle: MathModelingPuzzle) {
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
  if (
    heading.includes('Named equation to academic notation') ||
    heading.includes('akademisk notasjon')
  ) {
    const knownLines = quantities.filter((quantity) => !quantity.hidden);
    const baseValue = quantities.find(
      (quantity) => quantity.name === base,
    )?.value ?? knownLines[0]?.value;
    const countValue = quantities.find(
      (quantity) => quantity.name === count,
    )?.value ?? knownLines[1]?.value;
    const totalValue = quantities.find(
      (quantity) => quantity.name === total,
    )?.value ?? knownLines[knownLines.length - 1]?.value;
    const academic = `${totalValue} = ${baseValue} + ${countValue}*p`;
    await submitText(puzzle, academic);
    return;
  }

  expect(total).not.toBe('');
  await submitText(puzzle, `${total} = ${base} + ${count} * ${perItem}`);
}

void userEvent;
