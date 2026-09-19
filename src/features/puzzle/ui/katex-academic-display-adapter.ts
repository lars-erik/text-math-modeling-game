import { render } from 'katex';
import katexStyles from 'katex/dist/katex.min.css?inline';
import type { AcademicDisplayAdapter } from './academic-display-adapter';

export const katexAcademicDisplayAdapter: AcademicDisplayAdapter = {
  render(source, target) {
    const style = document.createElement('style');
    style.textContent = katexStyles;
    const output = document.createElement('span');
    target.replaceChildren(style, output);
    render(source, output, {
      displayMode: true,
      output: 'htmlAndMathml',
      throwOnError: false,
    });
  },
};
