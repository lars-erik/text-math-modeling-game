import type { PuzzleLocaleResources } from './contract';

export const en = {
  language: {
    label: 'Language',
    en: 'English',
    nb: 'Norwegian Bokmål',
  },
  controls: {
    check: 'Check',
    inputMode: 'Answer method',
    textInput: 'Text input',
    multipleChoice: 'Multiple choice',
  },
  puzzleMenu: {
    label: 'Puzzle menu',
    scenario: 'Scenario',
    dronePower: 'Spaceship and drones',
    creatorFollowers: 'Creator and followers',
    task: 'Task',
    storyToQuantities: 'Story to quantities',
    quantitiesToNamedEquation: 'Quantities to named equation',
    namedEquationToAcademicNotation: 'Named equation to academic notation',
    academicNotationToNamedEquation: 'Academic notation to named equation',
    seed: 'Seed',
    show: 'Show puzzle',
    startSession: 'Start session',
  },
  common: {
    puzzle: 'Puzzle',
    source: 'Source',
    target: 'Target',
    quantities: 'Quantities',
    feedback: 'Feedback',
    replay: 'Replay information',
    seed: 'Seed',
    generatorVersion: 'Generator version',
    scenario: 'Scenario',
    storySeed: 'Story seed',
  },
  storyToQuantities: {
    heading: 'Story to quantities',
    prompt: 'Identify the known quantities and the unknown.',
    knownLegend: 'Select all known quantities',
    unknownLegend: 'Select the unknown quantity',
    accepted: 'The quantities match the story.',
    incorrect: 'Not quite. Review which values the story gives and which one it asks for.',
  },
  quantitiesToNamedEquation: {
    heading: 'Quantities to named equation',
    prompt: 'Write an equation that relates these quantities.',
    inputLabel: 'Named equation',
    choiceLegend: 'Choose the named equation',
    accepted: 'The equation matches the quantity model.',
    groupingMismatch: 'The equation grouping does not match the quantity model.',
    reversedSides: 'The equation sides are reversed; keep them in the requested order.',
    unknownIdentifier: (identifier, available) =>
      `Unknown identifier ${JSON.stringify(identifier)}. Available identifiers: ${available}.`,
  },
  namedEquationToAcademicNotation: {
    heading: 'Named equation to academic notation',
    prompt: 'Write the relationship using the academic symbols.',
    inputLabel: 'Academic notation',
    symbolKey: 'Symbol key',
    accepted: 'The academic notation matches the relationship.',
    groupingMismatch: 'The academic notation does not match the relationship.',
    unknownIdentifier: (identifier, available) =>
      `Unknown symbol ${JSON.stringify(identifier)}. Available symbols: ${available}.`,
  },
  academicNotationToNamedEquation: {
    heading: 'Academic notation to named equation',
    prompt: 'Write the relationship using the named quantities.',
    inputLabel: 'Named equation',
    symbolKey: 'Symbol key',
    accepted: 'The named equation matches the relationship.',
    groupingMismatch: 'The named equation does not match the relationship.',
    unknownIdentifier: (identifier, available) =>
      `Unknown identifier ${JSON.stringify(identifier)}. Available identifiers: ${available}.`,
  },
  misconceptions: {
    baseAppliedPerItem: (baseLabel, countLabel) =>
      `${baseLabel} is added once overall. In your equation it is multiplied by the ${countLabel}, so it is applied once per item.`,
  },
  session: {
    positionLabel: (position, total) => `Puzzle ${position} / ${total}`,
    next: 'Next puzzle',
    hint: 'Hint',
    hintText:
      'The total contains the base amount once, plus one unit value per item.',
    completionHeading: 'Session complete',
    completedTotal: (total) => `${total} puzzles completed`,
    perEdgeHeading: 'Completed representation edges',
    sessionReplayLabel: 'Session replay',
    answerLogHeading: 'Answers',
    answerLogCorrect: 'correct',
    answerLogIncorrect: 'incorrect',
    backToPuzzle: 'Back to start',
  },
} satisfies PuzzleLocaleResources;
