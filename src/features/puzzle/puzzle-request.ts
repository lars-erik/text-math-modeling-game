import type { PuzzleLocale } from './lang';
import type { ThemeId } from '../themes';
import { isThemeId } from '../themes';
import type { ModeId } from './modes';
import { isModeId } from './modes';
import {
  isProblemFamilyId,
  problemFamilies,
  type ProblemFamilyId,
} from '../problem-generation/problem-families';
import {
  defaultHiddenRole,
  isHiddenRole,
  type HiddenRole,
} from '../problem-generation/hidden-role';

export const puzzleSelectionRequestEvent = 'puzzle-selection-request';

export type PuzzleSelectionRequest = {
  seed: number;
  familyId: ProblemFamilyId;
  hiddenRole?: HiddenRole;
  themeId: ThemeId;
  modeId: ModeId;
  locale: PuzzleLocale;
};

export const sessionSelectionRequestEvent = 'session-selection-request';

export type SessionSelectionRequest = {
  seed: number;
  themeId: ThemeId;
  locale: PuzzleLocale;
};

export function isSessionSelectionRequest(
  value: unknown,
): value is SessionSelectionRequest {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const request = value as Partial<SessionSelectionRequest>;
  return (
    typeof request.seed === 'number' &&
    typeof request.themeId === 'string' &&
    isThemeId(request.themeId) &&
    (request.locale === 'en' || request.locale === 'nb')
  );
}

export function isPuzzleSelectionRequest(
  value: unknown,
): value is PuzzleSelectionRequest {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const request = value as Partial<PuzzleSelectionRequest>;
  return (
    typeof request.seed === 'number' &&
    typeof request.familyId === 'string' &&
    isProblemFamilyId(request.familyId) &&
    (request.hiddenRole === undefined
      ? true
      : typeof request.hiddenRole === 'string' &&
        isHiddenRole(request.hiddenRole) &&
        problemFamilies[request.familyId].hiddenRoles.includes(
          request.hiddenRole,
        )) &&
    typeof request.themeId === 'string' &&
    isThemeId(request.themeId) &&
    typeof request.modeId === 'string' &&
    isModeId(request.modeId) &&
    (request.locale === 'en' || request.locale === 'nb')
  );
}
