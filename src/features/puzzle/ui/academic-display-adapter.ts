import type { Relation } from '../../problem-model/expression';
import type { AcademicSymbolMap } from '../../representations/academic-symbol-map';
import { renderToString } from '../../representations/academic-relation';

export type AcademicDisplayAdapter = {
  render: (
    relation: Relation,
    symbols: AcademicSymbolMap,
    target: HTMLElement,
  ) => void;
};

export const textAcademicDisplayAdapter: AcademicDisplayAdapter = {
  render(relation, symbols, target) {
    target.textContent = renderToString(relation, symbols);
  },
};
