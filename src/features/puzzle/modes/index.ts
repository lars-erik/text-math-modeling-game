export {
  isModeId,
  modeIds,
  type Mode,
  type ModeId,
  type ModeStartOptions,
  type ModeSubmitOptions,
  type PuzzleFeedback,
  type PuzzleScreen,
  type PuzzleSubmission,
  type QuantitySelection,
  type ScreenQuantity,
  type StoryToQuantitiesScreen,
  type QuantitiesToNamedEquationScreen,
} from './mode';
export { storyToQuantitiesMode } from './story-to-quantities';
export { quantitiesToNamedEquationMode } from './quantities-to-named-equation';
export { createNamedEquationChoices } from './named-equation-choices';
export { toScreenQuantities } from './screen-quantities';
import type { Mode, ModeId } from './mode';
import { storyToQuantitiesMode } from './story-to-quantities';
import { quantitiesToNamedEquationMode } from './quantities-to-named-equation';

export const modes: Readonly<Record<ModeId, Mode>> = {
  'story-to-quantities': storyToQuantitiesMode,
  'quantities-to-named-equation': quantitiesToNamedEquationMode,
};
