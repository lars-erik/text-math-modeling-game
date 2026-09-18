import type { PuzzleLocaleResources } from './contract';

export const en = {
  language: {
    label: 'Language',
    en: 'English',
    nb: 'Norwegian Bokmål',
  },
  controls: {
    check: 'Check',
    textInput: 'Text input',
    multipleChoice: 'Multiple choice',
  },
  common: {
    source: 'Source',
    quantities: 'Quantities',
    feedback: 'Feedback',
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
} satisfies PuzzleLocaleResources;
