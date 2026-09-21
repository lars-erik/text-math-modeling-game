export type NavigationLocaleResources = {
  home: {
    heading: string;
    puzzleLabel: string;
    sessionLabel: string;
    continueLabel: string;
    historyHeading: string;
    historyEntry: (entry: { seed: number; total: number }) => string;
    historyEmpty: string;
  };
  menu: {
    homeLabel: string;
  };
};
