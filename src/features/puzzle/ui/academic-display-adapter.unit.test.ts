import { describe, expect, test } from 'vitest';
import { totalFromPartsProblem } from '../../problem-model/total-from-parts.fixture';
import { createAcademicSymbolMap } from '../../representations/academic-symbol-map';
import { substituteVisibleValues } from '../../representations/substitute-visible-values';
import type { AcademicSymbolMap } from '../../representations/academic-symbol-map';
import type { Relation } from '../../problem-model/expression';
import { textAcademicDisplayAdapter } from './academic-display-adapter';

describe('academic display adapter contract', () => {
  test('adapters receive the canonical Relation AST and symbol map', () => {
    const received: {
      relation?: Relation;
      symbols?: AcademicSymbolMap;
    } = {};
    const adapter = {
      render(relation: Relation, symbols: AcademicSymbolMap, _target: HTMLElement) {
        received.relation = relation;
        received.symbols = symbols;
      },
    };
    const relation = substituteVisibleValues(totalFromPartsProblem);
    const symbols = createAcademicSymbolMap(totalFromPartsProblem);
    const target = { textContent: '' } as unknown as HTMLElement;

    adapter.render(relation, symbols, target);

    expect(received.relation).toBe(relation);
    expect(received.symbols).toBe(symbols);
  });

  test('the text adapter renders our AST visitor output', () => {
    const target = { textContent: '' } as HTMLElement;

    textAcademicDisplayAdapter.render(
      substituteVisibleValues(totalFromPartsProblem),
      createAcademicSymbolMap(totalFromPartsProblem),
      target,
    );

    expect(target.textContent).toBe('210 = 30 + 4p');
  });
});
