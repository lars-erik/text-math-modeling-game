export const maximumGenerationSeed = 0xffff_ffff;

export type RandomSource = {
  nextFloat(): number;
};

export type PositiveIntegerRange = {
  min: number;
  max: number;
};

export const invalidSeedError =
  'Generation seed must be a non-negative 32-bit unsigned integer.';

export const invalidRangeError =
  'Generation config range bounds must be positive safe integers with min <= max.';

export function createMulberry32Random(seed: number): RandomSource {
  let state = seed >>> 0;

  return {
    nextFloat() {
      state += 0x6d2b79f5;
      let next = state;
      next = Math.imul(next ^ (next >>> 15), next | 1);
      next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
      return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
    },
  };
}

export function nextInteger(
  randomSource: RandomSource,
  range: PositiveIntegerRange,
): number {
  const nextFloat = randomSource.nextFloat();
  if (nextFloat < 0 || nextFloat >= 1 || !Number.isFinite(nextFloat)) {
    throw new Error('Random sources must return values in [0, 1).');
  }

  return Math.floor(nextFloat * (range.max - range.min + 1)) + range.min;
}

export function validateSeed(seed: number): void {
  if (
    !Number.isSafeInteger(seed) ||
    seed < 0 ||
    seed > maximumGenerationSeed
  ) {
    throw new Error(invalidSeedError);
  }
}

export function validatePositiveIntegerRange(range: PositiveIntegerRange): void {
  if (
    !Number.isSafeInteger(range.min) ||
    !Number.isSafeInteger(range.max) ||
    range.min <= 0 ||
    range.max <= 0 ||
    range.min > range.max
  ) {
    throw new Error(invalidRangeError);
  }
}
