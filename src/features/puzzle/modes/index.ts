import type { GuidanceEntry } from '../../problem-model/problem';

export {
  isModeId,
  modeIds,
  type Mode,
  type ModeId,
  type ModeResult,
  type ModeStartOptions,
  type ModeSubmitOptions,
  type ModeState,
  type ModeSubmission,
  type PuzzleFeedback,
  type QuantitySelection,
  type StoryToQuantitiesState,
  type QuantitiesToNamedEquationState,
  type NamedEquationToAcademicNotationState,
  type AcademicNotationToNamedEquationState,
} from './mode';
export { storyToQuantitiesMode } from './story-to-quantities';
export { quantitiesToNamedEquationMode } from './quantities-to-named-equation';
export { namedEquationToAcademicNotationMode } from './named-equation-to-academic-notation';
export { academicNotationToNamedEquationMode } from './academic-notation-to-named-equation';
export {
  createNamedEquationChoiceSeeds,
  type NamedEquationChoiceSeed,
} from './named-equation-choices';
import type { Mode, ModeId } from './mode';
import { storyToQuantitiesMode } from './story-to-quantities';
import { quantitiesToNamedEquationMode } from './quantities-to-named-equation';
import { namedEquationToAcademicNotationMode } from './named-equation-to-academic-notation';
import { academicNotationToNamedEquationMode } from './academic-notation-to-named-equation';

export const modes: Readonly<Record<ModeId, Mode>> = {
  'story-to-quantities': storyToQuantitiesMode,
  'quantities-to-named-equation': quantitiesToNamedEquationMode,
  'named-equation-to-academic-notation': namedEquationToAcademicNotationMode,
  'academic-notation-to-named-equation': academicNotationToNamedEquationMode,
};

export function selectGuidanceForMode({
  modeId,
  guidance,
}: {
  modeId: ModeId;
  guidance: readonly GuidanceEntry[];
}): GuidanceEntry | undefined {
  return modes[modeId].selectGuidance?.(guidance);
}
