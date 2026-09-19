import { css, html, LitElement, type PropertyValues } from 'lit';
import type { Relation } from '../../problem-model/expression';
import type { AcademicSymbolMap } from '../../representations/academic-symbol-map';
import { renderToString } from '../../representations/academic-relation';
import {
  textAcademicDisplayAdapter,
  type AcademicDisplayAdapter,
} from './academic-display-adapter';

export class AcademicNotationDisplay extends LitElement {
  static properties = {
    relation: { attribute: false },
    symbols: { attribute: false },
    adapter: { attribute: false },
  };

  static styles = css`
    :host {
      display: block;
      min-width: 0;
    }
    .output {
      min-width: 0;
      overflow-x: auto;
    }
  `;

  declare relation: Relation | undefined;
  declare symbols: AcademicSymbolMap;
  declare adapter: AcademicDisplayAdapter;

  constructor() {
    super();
    this.relation = undefined;
    this.symbols = {};
    this.adapter = textAcademicDisplayAdapter;
  }

  render() {
    const source = this.relation
      ? renderToString(this.relation, this.symbols)
      : '';
    return html`<div class="output" aria-label=${source}></div>`;
  }

  protected updated(_changedProperties: PropertyValues<this>): void {
    const target = this.renderRoot.querySelector<HTMLElement>('.output');
    if (target === null || this.relation === undefined) {
      return;
    }
    this.adapter.render(this.relation, this.symbols, target);
  }
}

if (customElements.get('academic-notation-display') === undefined) {
  customElements.define('academic-notation-display', AcademicNotationDisplay);
}

declare global {
  interface HTMLElementTagNameMap {
    'academic-notation-display': AcademicNotationDisplay;
  }
}
