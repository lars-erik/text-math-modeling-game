import {
  createMulberry32Random,
  maximumTotalFromPartsSeed,
  type RandomSource,
} from '../problem-generation/generate-total-from-parts';
import { defaultProblemFamilyId, problemFamilies } from '../problem-generation/problem-families';
import type { HiddenRole } from '../problem-generation/hidden-role';
import { modeIds, type ModeId } from '../puzzle/modes';

export const sessionPlannerVersion = 'session-plan-v2';

const minimumSessionLength = 5;
const maximumSessionLength = 10;

export type SessionPlanRequest = {
  seed: number;
  randomSource?: RandomSource;
};

export type PlannedSessionItem = {
  index: number;
  problemSeed: number;
  modeId: ModeId;
  hiddenRole: HiddenRole;
};

export type SessionPlan = {
  seed: number;
  plannerVersion: string;
  length: number;
  items: readonly PlannedSessionItem[];
};

export function planSession(request: SessionPlanRequest): SessionPlan {
  if (
    !Number.isSafeInteger(request.seed) ||
    request.seed < 0 ||
    request.seed > maximumTotalFromPartsSeed
  ) {
    throw new Error(
      'Session seed must be a non-negative 32-bit unsigned integer.',
    );
  }
  const randomSource =
    request.randomSource ?? createMulberry32Random(request.seed);
  const length = nextSessionLength(randomSource);
  const items = planItems(request.seed, length, randomSource);
  return {
    seed: request.seed,
    plannerVersion: sessionPlannerVersion,
    length,
    items,
  };
}

function nextSessionLength(randomSource: RandomSource): number {
  return (
    minimumSessionLength +
    Math.floor(
      randomSource.nextFloat() *
        (maximumSessionLength - minimumSessionLength + 1),
    )
  );
}

function planItems(
  seed: number,
  length: number,
  randomSource: RandomSource,
): readonly PlannedSessionItem[] {
  const orderedModes = deterministicShuffle([...modeIds], randomSource);
  const orderedHiddenRoles = deterministicShuffle(
    [...problemFamilies[defaultProblemFamilyId].hiddenRoles],
    randomSource,
  );
  const items: PlannedSessionItem[] = [];
  for (let index = 0; index < length; index += 1) {
    items.push({
      index: index + 1,
      problemSeed: deriveProblemSeed(seed, index),
      modeId: orderedModes[index % orderedModes.length],
      hiddenRole: orderedHiddenRoles[index % orderedHiddenRoles.length],
    });
  }
  return items;
}

export function deriveProblemSeed(seed: number, itemIndex: number): number {
  const mixed = mix32(mix32(seed >>> 0) ^ ((itemIndex + 1) >>> 0));
  return mixed >>> 0;
}

function deterministicShuffle<T>(values: T[], randomSource: RandomSource): T[] {
  for (let index = values.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(
      randomSource.nextFloat() * (index + 1),
    );
    const temporary = values[index];
    values[index] = values[swapIndex];
    values[swapIndex] = temporary;
  }
  return values;
}

function mix32(value: number): number {
  let next = value >>> 0;
  next = Math.imul(next ^ (next >>> 16), 0x7feb352d);
  next ^= next >>> 15;
  next = Math.imul(next ^ (next >>> 15), 0x2ea68a53);
  next ^= next >>> 15;
  return next;
}
