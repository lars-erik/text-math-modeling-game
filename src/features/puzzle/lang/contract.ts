export type PuzzleLocaleResources = {
  language: {
    label: string;
    en: string;
    nb: string;
  };
  controls: {
    check: string;
    textInput: string;
    multipleChoice: string;
  };
  common: {
    source: string;
    quantities: string;
    feedback: string;
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
