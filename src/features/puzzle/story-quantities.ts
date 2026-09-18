import type { ProblemReplay } from '../problem-model/problem';
import type { PuzzleLocale } from './lang';

export type StoryQuantityChoice = {
  id: string;
  label: string;
  variableName: string;
  displayValue: string;
};

export type StoryQuantitiesPuzzleDefinition = {
  sourceText: string;
  prompt: string;
  choices: readonly StoryQuantityChoice[];
  facts: readonly { id: string; visibility: 'known' | 'hidden' }[];
  messages: { accepted: string; incorrect: string };
  replay?: ProblemReplay & {
    locale: PuzzleLocale;
    scenarioId: string;
    storySeed: number;
  };
};

export type StoryQuantitiesSelection = {
  knownIds: readonly string[];
  unknownId?: string;
};

export type StoryQuantitiesScreen = {
  source: { kind: 'story'; text: string };
  target: {
    kind: 'quantities';
    prompt: string;
    choices: readonly StoryQuantityChoice[];
  };
  input: { kind: 'quantity-selection' } & StoryQuantitiesSelection;
  replay?: StoryQuantitiesPuzzleDefinition['replay'];
  feedback?: { kind: 'accepted' | 'incorrect'; message: string };
};

export function startStoryQuantitiesPuzzle(
  definition: StoryQuantitiesPuzzleDefinition,
): StoryQuantitiesScreen {
  return {
    source: { kind: 'story', text: definition.sourceText },
    target: {
      kind: 'quantities',
      prompt: definition.prompt,
      choices: definition.choices.map((choice) => ({ ...choice })),
    },
    input: { kind: 'quantity-selection', knownIds: [] },
    replay: definition.replay,
  };
}

export function submitStoryQuantitiesPuzzle(
  definition: StoryQuantitiesPuzzleDefinition,
  selection: StoryQuantitiesSelection,
): StoryQuantitiesScreen {
  const screen = startStoryQuantitiesPuzzle(definition);
  const expectedKnownIds = definition.facts
    .filter((fact) => fact.visibility === 'known')
    .map((fact) => fact.id)
    .sort();
  const expectedUnknownId = definition.facts.find(
    (fact) => fact.visibility === 'hidden',
  )?.id;
  const submittedKnownIds = [...new Set(selection.knownIds)].sort();
  const accepted =
    submittedKnownIds.length === expectedKnownIds.length &&
    submittedKnownIds.every((id, index) => id === expectedKnownIds[index]) &&
    selection.unknownId === expectedUnknownId;

  return {
    ...screen,
    input: {
      kind: 'quantity-selection',
      knownIds: [...selection.knownIds],
      ...(selection.unknownId === undefined
        ? {}
        : { unknownId: selection.unknownId }),
    },
    feedback: accepted
      ? { kind: 'accepted', message: definition.messages.accepted }
      : { kind: 'incorrect', message: definition.messages.incorrect },
  };
}
