import { describe, expect, test } from 'vitest';
import {
  maximumTotalFromPartsSeed,
  generateTotalFromPartsCase,
  defaultTotalFromPartsGenerationConfig,
} from '../problem-generation/generate-total-from-parts';
import { modeIds } from '../puzzle/modes';
import {
  planSession,
  sessionPlannerVersion,
  type SessionPlan,
} from './plan-session';

const exampleSeed = 918273;

function planOf(seed: number): SessionPlan {
  return planSession({ seed });
}

test('reproduces the identical item plan for the same session seed', () => {
  expect(planOf(exampleSeed)).toEqual(planOf(exampleSeed));
});

test('plans a session of at least five and at most ten items', () => {
  for (let seed = 0; seed < 1000; seed += 1) {
    const plan = planOf(seed);
    expect(plan.items.length).toBeGreaterThanOrEqual(5);
    expect(plan.items.length).toBeLessThanOrEqual(10);
    expect(plan.items.length).toBe(plan.length);
  }
});

test('plans items with contiguous one-based indexes and deterministic problem seeds', () => {
  const plan = planOf(exampleSeed);
  plan.items.forEach((item, index) => {
    expect(item.index).toBe(index + 1);
    expect(Number.isSafeInteger(item.problemSeed)).toBe(true);
    expect(item.problemSeed).toBeGreaterThanOrEqual(0);
    expect(item.problemSeed).toBeLessThanOrEqual(maximumTotalFromPartsSeed);
  });
});

test('exercises every registered mode at least once', () => {
  const plan = planOf(exampleSeed);
  const plannedModes = new Set(plan.items.map((item) => item.modeId));
  for (const modeId of modeIds) {
    expect(plannedModes.has(modeId), `missing mode ${modeId}`).toBe(true);
  }
});

test('derives every problem seed deterministically from the session seed', () => {
  const first = planOf(exampleSeed);
  const second = planOf(exampleSeed);
  expect(first.items.map((item) => item.problemSeed)).toEqual(
    second.items.map((item) => item.problemSeed),
  );
});

test('can plan a different valid plan from a different seed', () => {
  const first = planOf(exampleSeed);
  const second = planOf(exampleSeed + 1);
  expect(second.items.map((item) => item.modeId)).not.toEqual(
    first.items.map((item) => item.modeId),
  );
  for (const item of second.items) {
    expect(item.modeId).toBeOneOf([...modeIds]);
  }
});

test('generates a validated problem for every planned item', () => {
  const plan = planOf(exampleSeed);
  for (const item of plan.items) {
    expect(() =>
      generateTotalFromPartsCase({
        seed: item.problemSeed,
        config: defaultTotalFromPartsGenerationConfig,
      }),
    ).not.toThrow();
  }
});

test('stamps the plan with the planner version', () => {
  expect(planOf(exampleSeed).plannerVersion).toBe(sessionPlannerVersion);
});

test('rejects invalid session seeds', () => {
  expect(() => planOf(-1)).toThrowError(/seed/i);
  expect(() => planOf(Number.MAX_SAFE_INTEGER + 1)).toThrowError(/seed/i);
  expect(() => planOf(1.5)).toThrowError(/seed/i);
});

describe('problem seed derivation', () => {
  test('keeps items reproducible from the recorded session seed and position', () => {
    const plan = planOf(exampleSeed);
    const firstItem = plan.items[0];
    const replayed = planSession({ seed: exampleSeed }).items[0];
    expect(firstItem.problemSeed).toBe(replayed.problemSeed);
  });
});
