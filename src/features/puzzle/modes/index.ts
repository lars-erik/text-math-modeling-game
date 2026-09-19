export {
  isModeId,
  modeIds,
  type Mode,
  type ModeId,
  type ModeResult,
  type ModeStartOptions,
  type ModeSubmitOptions,
  type ModeState,
  type PuzzleFeedback,
  type QuantitySelection,
  type StoryToQuantitiesState,
  type QuantitiesToNamedEquationState,
} from './mode';
export { storyToQuantitiesMode } from './story-to-quantities';
export { quantitiesToNamedEquationMode } from './quantities-to-named-equation';
export {
  createNamedEquationChoiceSeeds,
  type NamedEquationChoiceSeed,
} from './named-equation-choices';
import type { Mode, ModeId } from './mode';
import { storyToQuantitiesMode } from './story-to-quantities';
import { quantitiesToNamedEquationMode } from './quantities-to-named-equation';

export const modes: Readonly<Record<ModeId, Mode>> = {
  'story-to-quantities': storyToQuantitiesMode,
  'quantities-to-named-equation': quantitiesToNamedEquationMode,
};
