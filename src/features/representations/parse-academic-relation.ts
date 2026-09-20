import {
  createLearnerNameResolver,
  parseNamedRelation,
  type LearnerNameMap,
  type ParseNamedRelationResult,
} from '../named-expression';
import type { QuantityId } from '../problem-model/expression';
import type { AcademicSymbolMap } from './academic-symbol-map';

export function parseAcademicRelation(
  input: string,
  symbols: AcademicSymbolMap,
): ParseNamedRelationResult {
  return parseNamedRelation(
    input,
    createLearnerNameResolver(invertSymbols(symbols)),
  );
}

function invertSymbols(symbols: AcademicSymbolMap): LearnerNameMap {
  const identifiers = new Map<string, QuantityId[]>();
  for (const [quantityId, symbol] of Object.entries(symbols)) {
    const ids = identifiers.get(symbol) ?? [];
    ids.push(quantityId);
    identifiers.set(symbol, ids);
  }
  return Object.fromEntries(
    [...identifiers].map(([symbol, ids]) => [
      symbol,
      ids.length === 1 ? ids[0] : ids,
    ]),
  );
}
