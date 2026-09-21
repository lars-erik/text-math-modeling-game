import { isPuzzleLocale, type PuzzleLocale } from '../localization/locale';
import { isThemeId, type ThemeId } from '../themes';
import { isModeId, type ModeId } from '../puzzle/modes';
import type {
  PuzzleSelectionRequest,
  SessionSelectionRequest,
} from '../puzzle/puzzle-request';
import {
  defaultProblemFamilyId,
  isProblemFamilyId,
  problemFamilies,
  type ProblemFamilyId,
} from '../problem-generation/problem-families';
import {
  defaultHiddenRole,
  isHiddenRole,
  type HiddenRole,
} from '../problem-generation/hidden-role';
import { maximumGenerationSeed } from '../problem-generation/random-source';
import type { Route } from './hash-route';

export type HomeSelection = {
  language: PuzzleLocale;
};

export function homeSelectionFromRoute(route: Route): HomeSelection {
  if (route.name !== 'home') {
    throw new Error(`Expected home route, received ${JSON.stringify(route.name)}.`);
  }
  return { language: parseLanguage(route.routeParams.get('language')) };
}

export function routeFromHomeSelection(selection: HomeSelection): Route {
  return { name: 'home', routeParams: new Map([['language', selection.language]]) };
}

export function puzzleSelectionFromRoute(route: Route): PuzzleSelectionRequest {
  if (route.name !== 'puzzle') {
    throw new Error(`Expected puzzle route, received ${JSON.stringify(route.name)}.`);
  }
  const familyId = parseFamilyId(route.routeParams.get('family'));
  return {
    seed: parseRequiredSeed(route.routeParams.get('seed')),
    familyId,
    hiddenRole: parseHiddenRole(
      route.routeParams.get('hidden-role'),
      familyId,
    ),
    themeId: parseRequiredThemeId(route.routeParams.get('scenario')),
    modeId: parseRequiredModeId(route.routeParams.get('task')),
    locale: parseLanguage(route.routeParams.get('language')),
  };
}

export function routeFromPuzzleSelection(
  selection: PuzzleSelectionRequest,
): Route {
  return {
    name: 'puzzle',
    routeParams: new Map<string, string | number | boolean>([
      ['seed', selection.seed],
      ['family', selection.familyId],
      ...(selection.hiddenRole !== undefined
        ? ([['hidden-role', selection.hiddenRole]] as const)
        : []),
      ['scenario', selection.themeId],
      ['task', selection.modeId],
      ['language', selection.locale],
    ]),
  };
}

export function sessionSelectionFromRoute(route: Route): SessionSelectionRequest {
  if (route.name !== 'session') {
    throw new Error(`Expected session route, received ${JSON.stringify(route.name)}.`);
  }
  return {
    seed: parseRequiredSeed(route.routeParams.get('seed')),
    themeId: parseRequiredThemeId(route.routeParams.get('scenario')),
    locale: parseLanguage(route.routeParams.get('language')),
  };
}

export function routeFromSessionSelection(
  selection: SessionSelectionRequest,
): Route {
  return {
    name: 'session',
    routeParams: new Map<string, string | number | boolean>([
      ['seed', selection.seed],
      ['scenario', selection.themeId],
      ['language', selection.locale],
    ]),
  };
}

function parseLanguage(value: unknown): PuzzleLocale {
  if (value === undefined) {
    return 'en';
  }
  if (typeof value !== 'string' || !isPuzzleLocale(value)) {
    throw new Error(`Unknown language ${JSON.stringify(value)}.`);
  }
  return value;
}

function parseRequiredSeed(value: unknown): number {
  if (value === undefined || value === null || value === '') {
    throw new Error('Route is missing the required seed.');
  }
  const seedText = String(value);
  if (!/^(0|[1-9]\d*)$/.test(seedText)) {
    throw new Error('URL seed must be an unsigned 32-bit decimal integer.');
  }
  const seed = Number(seedText);
  if (!Number.isSafeInteger(seed) || seed > maximumGenerationSeed) {
    throw new Error('URL seed must be an unsigned 32-bit decimal integer.');
  }
  return seed;
}

function parseFamilyId(value: unknown): ProblemFamilyId {
  if (value === undefined || value === null || value === '') {
    return defaultProblemFamilyId;
  }
  if (typeof value !== 'string' || !isProblemFamilyId(value)) {
    throw new Error(`Unknown problem family ${JSON.stringify(value)}.`);
  }
  return value;
}

function parseHiddenRole(
  value: unknown,
  familyId: ProblemFamilyId,
): HiddenRole {
  const hiddenRole =
    value === undefined || value === null || value === ''
      ? defaultHiddenRole
      : value;
  if (typeof value === 'string' && !isHiddenRole(value)) {
    throw new Error(`Unknown hidden role ${JSON.stringify(value)}.`);
  }
  const resolved = hiddenRole as HiddenRole;
  if (!problemFamilies[familyId].hiddenRoles.includes(resolved)) {
    throw new Error(
      `Problem family ${JSON.stringify(familyId)} does not support hidden role ${JSON.stringify(resolved)}.`,
    );
  }
  return resolved;
}

function parseRequiredThemeId(value: unknown): ThemeId {
  if (value === undefined || value === null || value === '') {
    throw new Error('Route is missing the required scenario.');
  }
  if (typeof value !== 'string' || !isThemeId(value)) {
    throw new Error(`Unknown scenario ${JSON.stringify(value)}.`);
  }
  return value;
}

function parseRequiredModeId(value: unknown): ModeId {
  if (value === undefined || value === null || value === '') {
    throw new Error('Route is missing the required task.');
  }
  if (typeof value !== 'string' || !isModeId(value)) {
    throw new Error(`Unknown puzzle task ${JSON.stringify(value)}.`);
  }
  return value;
}
