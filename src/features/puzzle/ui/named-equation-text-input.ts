import { html, LitElement } from 'lit';

import type { TextEquationAnswer } from '../learner-answer';

export class NamedEquationTextInput extends LitElement {
  static properties = {
    value: { type: String },
  };

  declare value: string;

  constructor() {
    super();
    this.value = '';
  }

  render() {
    return html`
      <form @submit=${this.handleSubmit}>
        <label for="named-equation">Named equation</label>
        <input
          id="named-equation"
          name="named-equation"
          type="text"
          .value=${this.value}
          required
        />
        <button type="submit">Check</button>
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
