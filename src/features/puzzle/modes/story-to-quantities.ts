import { puzzleResources } from '../lang';
import type {
  Mode,
  ModeResult,
  ModeStartOptions,
  ModeSubmitOptions,
  QuantitySelection,
  StoryToQuantitiesState,
} from './mode';

export const storyToQuantitiesMode: Mode = {
  id: 'story-to-quantities',
  start(options: ModeStartOptions): ModeResult {
    return { state: composeState(options, { knownIds: [] }) };
  },
  submit(options: ModeSubmitOptions): ModeResult {
    const selection = options.answer as QuantitySelection;
    const expectedKnownIds = options.problem.quantities
      .filter((quantity) => quantity.given.kind === 'known')
      .map((quantity) => quantity.id)
      .sort();
    const expectedUnknownId = options.problem.quantities.find(
      (quantity) => quantity.given.kind === 'hidden',
    )?.id;
    const submittedKnownIds = [...new Set(selection.knownIds)].sort();
    const accepted =
      submittedKnownIds.length === expectedKnownIds.length &&
      submittedKnownIds.every((id, index) => id === expectedKnownIds[index]) &&
      selection.unknownId === expectedUnknownId;
    const resources = puzzleResources[options.locale].storyToQuantities;
    return {
      state: composeState(options, selection),
      feedback: accepted
        ? { kind: 'quantity-selection-accepted', message: resources.accepted }
        : { kind: 'incorrect', message: resources.incorrect },
    };
  },
};

function composeState(
  options: ModeStartOptions,
  selection: QuantitySelection,
): StoryToQuantitiesState {
  return {
    modeId: 'story-to-quantities',
    source: { kind: 'story' },
    target: {
      kind: 'quantities',
      quantityIds: options.problem.quantities.map((quantity) => quantity.id),
    },
    input: {
      kind: 'quantity-selection',
      knownIds: [...new Set(selection.knownIds)],
      ...(selection.unknownId === undefined
        ? {}
        : { unknownId: selection.unknownId }),
    },
  };
}
