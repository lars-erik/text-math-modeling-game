import type { QuantityRole } from '../problem-model/problem';
import {
  validatePositiveIntegerRange,
  type PositiveIntegerRange
} from './random-source';

export const supportedHiddenRoles = [
  'per-item',
  'base',
  'count',
  'total'
] as const satisfies readonly QuantityRole[];

export type HiddenRole = (typeof supportedHiddenRoles)[number];

export function isHiddenRole(value: string): value is HiddenRole {
  return (supportedHiddenRoles as readonly string[]).includes(value);
}

export const hiddenRoleQuantities: Readonly<
  Record<
    HiddenRole,
    { id: string; dimension: 'amount' | 'item' | 'amountPerItem' }
  >
> = {
  'per-item': { id: 'unitValue', dimension: 'amountPerItem' },
  base: { id: 'base', dimension: 'amount' },
  count: { id: 'count', dimension: 'item' },
  total: { id: 'total', dimension: 'amount' }
};

export const defaultHiddenRole: HiddenRole = 'per-item';

export function resolveHiddenRole(
  hiddenRole: HiddenRole | undefined,
  familyHiddenRoles: readonly HiddenRole[]
): HiddenRole {
  const resolved = hiddenRole ?? defaultHiddenRole;
  if (!familyHiddenRoles.includes(resolved)) {
    throw new Error(
      `The family does not support hidden role ${JSON.stringify(resolved)}; supported hidden roles are ${familyHiddenRoles.join(', ')}.`
    );
  }
  return resolved;
}

export type IntegerParts = {
  base: number;
  count: number;
  unitValue: number;
  total: number;
};

export function generateIntegerParts(
  randomSource: { nextFloat(): number },
  config: {
    base: PositiveIntegerRange;
    count: PositiveIntegerRange;
    unitValue: PositiveIntegerRange;
  },
  hasBase: boolean
): IntegerParts {
  for (const range of [config.base, config.count, config.unitValue]) {
    validatePositiveIntegerRange(range);
  }
  const base = nextInteger(randomSource, config.base);
  const unitValue = nextInteger(randomSource, config.unitValue);
  const count = nextInteger(randomSource, config.count);
  return {
    base: hasBase ? base : 0,
    count,
    unitValue,
    total: (hasBase ? base : 0) + count * unitValue
  };
}

function nextInteger(
  randomSource: { nextFloat(): number },
  range: PositiveIntegerRange
): number {
  const nextFloat = randomSource.nextFloat();
  if (nextFloat < 0 || nextFloat >= 1 || !Number.isFinite(nextFloat)) {
    throw new Error('Random sources must return values in [0, 1).');
  }
  return Math.floor(nextFloat * (range.max - range.min + 1)) + range.min;
}
