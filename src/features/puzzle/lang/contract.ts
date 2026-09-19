export type PuzzleLocaleResources = {
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
    seed: string;
    show: string;
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
};
