import type { QuantityRole } from '../problem-model/problem';

const supportedHiddenRoles = [
  'per-item',
  'base',
  'count',
  'total'
] as const satisfies readonly QuantityRole[];

export type HiddenRole = (typeof supportedHiddenRoles)[number];

export function isHiddenRole(value: string): value is HiddenRole {
  return (supportedHiddenRoles as readonly string[]).includes(value);
}

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
