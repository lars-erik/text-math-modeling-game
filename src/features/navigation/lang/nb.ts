import type { NavigationLocaleResources } from './contract';

export const nb: NavigationLocaleResources = {
  home: {
    heading: 'Matemodelleringsoppgaver',
    puzzleLabel: 'Start oppgave',
    sessionLabel: 'Start økt',
    continueLabel: 'Fortsett økt',
    historyHeading: 'Fullførte økter',
    historyEntry: ({ seed, total }) =>
      `Økt med frø ${seed} — ${total} oppgaver fullført`,
    historyEmpty: 'Ingen fullførte økter ennå.',
  },
  menu: {
    homeLabel: 'Hjem',
  },
};
