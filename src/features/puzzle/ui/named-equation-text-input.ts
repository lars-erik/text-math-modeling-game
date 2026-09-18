import { html, LitElement } from 'lit';

import type { TextEquationAnswer } from '../learner-answer';

export class NamedEquationTextInput extends LitElement {
  static properties = {
    value: { type: String },
    inputLabel: { attribute: false },
    checkLabel: { attribute: false },
  };

  declare value: string;
  declare inputLabel: string;
  declare checkLabel: string;

  constructor() {
    super();
    this.value = '';
    this.inputLabel = 'Named equation';
    this.checkLabel = 'Check';
  }

  render() {
    return html`
      <form @submit=${this.handleSubmit}>
        <label for="named-equation">${this.inputLabel}</label>
        <input
          id="named-equation"
          name="named-equation"
          type="text"
          .value=${this.value}
          required
        />
        <button type="submit">${this.checkLabel}</button>
      </form>
    `;
  }

  private handleSubmit(event: SubmitEvent): void {
    event.preventDefault();
    if (!(event.currentTarget instanceof HTMLFormElement)) {
      return;
    }

    const input = new FormData(event.currentTarget).get('named-equation');
    if (typeof input !== 'string') {
      return;
    }

    this.dispatchEvent(
      new CustomEvent<TextEquationAnswer>('puzzle-answer', {
        bubbles: true,
        composed: true,
        detail: { kind: 'text', input },
      }),
    );
  }
}

if (customElements.get('named-equation-text-input') === undefined) {
  customElements.define(
    'named-equation-text-input',
    NamedEquationTextInput,
  );
}

declare global {
  interface HTMLElementTagNameMap {
    'named-equation-text-input': NamedEquationTextInput;
  }
}
