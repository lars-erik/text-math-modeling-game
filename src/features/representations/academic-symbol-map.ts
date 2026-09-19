import type { QuantityId } from '../problem-model/expression';
import type { Problem, QuantityRole } from '../problem-model/problem';

export type AcademicSymbolMap = Readonly<Record<QuantityId, string>>;

const symbolsByRole = {
  base: 'b',
  count: 'n',
  'per-item': 'p',
  total: 'T',
} as const satisfies Record<QuantityRole, string>;

export function createAcademicSymbolMap(problem: Problem): AcademicSymbolMap {
  const entries = problem.quantities.map((quantity) => {
    if (quantity.role === undefined) {
      throw new Error(`Quantity ${quantity.id} has no academic symbol role.`);
    }
    return [quantity.id, symbolsByRole[quantity.role]] as const;
  });
  const symbols = Object.fromEntries(entries);
  validateAcademicSymbolMap(problem, symbols);
  return symbols;
}

export function validateAcademicSymbolMap(
  problem: Problem,
  symbols: AcademicSymbolMap,
): void {
  const seen = new Map<string, QuantityId>();
  for (const quantity of problem.quantities) {
    const symbol = symbols[quantity.id];
    if (symbol === undefined) {
      throw new Error(`Academic symbol map is missing quantity ${quantity.id}.`);
    }
    if (!/^[A-Za-z][A-Za-z0-9]*$/.test(symbol)) {
      throw new Error(`Academic symbol ${JSON.stringify(symbol)} is not a valid identifier.`);
    }
    const existing = seen.get(symbol);
    if (existing !== undefined) {
      throw new Error(
        `Academic symbol ${JSON.stringify(symbol)} is ambiguous for ${existing} and ${quantity.id}.`,
      );
    }
    seen.set(symbol, quantity.id);
  }
}
