import { render } from 'katex';
import katexStyles from 'katex/dist/katex.min.css?inline';
import type { Relation } from '../../problem-model/expression';
import type { AcademicSymbolMap } from '../../representations/academic-symbol-map';
import { renderToString } from '../../representations/academic-relation';
import type { AcademicDisplayAdapter } from './academic-display-adapter';

export const katexAcademicDisplayAdapter: AcademicDisplayAdapter = {
  render(relation: Relation, symbols: AcademicSymbolMap, target: HTMLElement) {
    const style = document.createElement('style');
    style.textContent = katexStyles;
    const output = document.createElement('span');
    target.replaceChildren(style, output);
    render(renderToString(relation, symbols), output, {
      displayMode: true,
      output: 'htmlAndMathml',
      throwOnError: false,
    });
  },
};
