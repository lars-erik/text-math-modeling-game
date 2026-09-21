import {
  problemFamilyIds,
  type ProblemFamilyId,
} from '../../problem-generation/problem-families';
import type { ModeId } from './mode';

const allFamilies: readonly ProblemFamilyId[] = [...problemFamilyIds];

const supportedFamiliesByMode: Readonly<
  Record<ModeId, readonly ProblemFamilyId[]>
> = {
  'story-to-quantities': allFamilies,
  'quantities-to-named-equation': allFamilies,
  'named-equation-to-academic-notation': allFamilies,
  'academic-notation-to-named-equation': allFamilies,
};

export function familySupportsMode(
  familyId: ProblemFamilyId,
  modeId: ModeId,
): boolean {
  return supportedFamiliesByMode[modeId].includes(familyId);
}

export function supportedFamilyIds(
  modeId: ModeId,
): readonly ProblemFamilyId[] {
  return supportedFamiliesByMode[modeId];
}
