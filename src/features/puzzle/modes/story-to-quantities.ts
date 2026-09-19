import type { SkinPresentation } from '../../skins';
import { puzzleResources } from '../lang';
import type {
  Mode,
  ModeStartOptions,
  ModeSubmitOptions,
  PuzzleScreen,
  QuantitySelection,
  ScreenQuantity,
} from './mode';
import { toScreenQuantities } from './screen-quantities';

export const storyToQuantitiesMode: Mode = {
  id: 'story-to-quantities',
  start(options: ModeStartOptions): PuzzleScreen {
    return compose(options, { knownIds: [] });
  },
  submit(options: ModeSubmitOptions): PuzzleScreen {
    const selection = options.answer as QuantitySelection;
    const screen = compose(options, selection);
    const expectedKnownIds = options.skin.facts
      .filter((fact) => fact.visibility === 'known')
      .map((fact) => fact.skinQuantityId)
      .sort();
    const expectedUnknownId = options.skin.facts.find(
      (fact) => fact.visibility === 'hidden',
    )?.skinQuantityId;
    const submittedKnownIds = [...new Set(selection.knownIds)].sort();
    const accepted =
      submittedKnownIds.length === expectedKnownIds.length &&
      submittedKnownIds.every((id, index) => id === expectedKnownIds[index]) &&
      selection.unknownId === expectedUnknownId;
    const resources = puzzleResources[options.locale].storyToQuantities;
    return {
      ...screen,
      submission: {
        kind: 'quantity-selection',
        knownIds: [...selection.knownIds],
        ...(selection.unknownId === undefined
          ? {}
          : { unknownId: selection.unknownId }),
      },
      feedback: accepted
        ? { kind: 'quantity-selection-accepted', message: resources.accepted }
        : { kind: 'incorrect', message: resources.incorrect },
    };
  },
};

function compose(
  options: ModeStartOptions,
  selection: QuantitySelection,
): PuzzleScreen {
  const resources = puzzleResources[options.locale].storyToQuantities;
  const screenQuantities = toScreenQuantities(options.skin);
  return {
    screen: {
      modeId: 'story-to-quantities',
      source: { kind: 'story' },
      target: {
        kind: 'quantities',
        prompt: resources.prompt,
        quantities: screenQuantities,
      },
      input: {
        kind: 'quantity-selection',
        knownIds: [...selection.knownIds],
        ...(selection.unknownId === undefined
          ? {}
          : { unknownId: selection.unknownId }),
      },
    },
    context: {
      locale: options.locale,
      skinId: options.skin.skinId,
      story: options.skin.story.text,
      quantities: screenQuantities,
      replay: composeReplay(options, screenQuantities),
    },
  };
}

function composeReplay(
  options: ModeStartOptions,
  _quantities: readonly ScreenQuantity[],
) {
  return options.problem.replay
    ? {
        ...options.problem.replay,
        locale: options.locale,
        skinId: options.skin.skinId,
        storySeed: options.skin.story.storySeed,
      }
    : undefined;
}
