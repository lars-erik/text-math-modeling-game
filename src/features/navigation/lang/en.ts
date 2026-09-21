import type { NavigationLocaleResources } from './contract';

export const en: NavigationLocaleResources = {
  home: {
    heading: 'Math modeling puzzles',
    puzzleLabel: 'Start puzzle',
    sessionLabel: 'Start session',
    continueLabel: 'Continue session',
    historyHeading: 'Completed sessions',
    historyEntry: ({ seed, total }) =>
      `Session seed ${seed} — ${total} puzzles completed`,
    historyEmpty: 'No completed sessions yet.',
  },
  menu: {
    homeLabel: 'Home',
  },
};
