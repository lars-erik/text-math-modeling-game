import type { GuidanceEntry } from '../../problem-model/problem';

export type PuzzleLocaleResources = {
  home: {
    heading: string;
    puzzleLabel: string;
    sessionLabel: string;
  };
  language: {
    label: string;
    en: string;
    nb: string;
  };
  controls: {
    check: string;
    inputMode: string;
    textInput: string;
    multipleChoice: string;
  };
  puzzleMenu: {
    label: string;
    scenario: string;
    dronePower: string;
    creatorFollowers: string;
    task: string;
    storyToQuantities: string;
    quantitiesToNamedEquation: string;
    namedEquationToAcademicNotation: string;
    academicNotationToNamedEquation: string;
    seed: string;
    show: string;
    startSession: string;
  };
  common: {
    puzzle: string;
    source: string;
    target: string;
    quantities: string;
    feedback: string;
    replay: string;
    seed: string;
    generatorVersion: string;
    scenario: string;
    storySeed: string;
  };
  storyToQuantities: {
    heading: string;
    prompt: string;
    knownLegend: string;
    unknownLegend: string;
    accepted: string;
    incorrect: string;
  };
  quantitiesToNamedEquation: {
    heading: string;
    prompt: string;
    inputLabel: string;
    choiceLegend: string;
    accepted: string;
    groupingMismatch: string;
    reversedSides: string;
    unknownIdentifier: (identifier: string, available: string) => string;
  };
  namedEquationToAcademicNotation: {
    heading: string;
    prompt: string;
    inputLabel: string;
    symbolKey: string;
    accepted: string;
    groupingMismatch: string;
    unknownIdentifier: (identifier: string, available: string) => string;
  };
  academicNotationToNamedEquation: {
    heading: string;
    prompt: string;
    inputLabel: string;
    symbolKey: string;
    accepted: string;
    groupingMismatch: string;
    unknownIdentifier: (identifier: string, available: string) => string;
  };
  misconceptions: {
    baseAppliedPerItem: (baseLabel: string, countLabel: string) => string;
  };

  session: {
    positionLabel: (position: number, total: number) => string;
    next: string;
    hint: string;
    hintText: (guidance: GuidanceEntry) => string;
    completionHeading: string;
    completedTotal: (total: number) => string;
    perEdgeHeading: string;
    sessionReplayLabel: string;
    answerLogHeading: string;
    answerLogCorrect: string;
    answerLogIncorrect: string;
    backToPuzzle: string;
  };
};
