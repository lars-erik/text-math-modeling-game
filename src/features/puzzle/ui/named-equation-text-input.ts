import { css, html, LitElement } from 'lit';

import type { TextEquationAnswer } from '../learner-answer';

export class NamedEquationTextInput extends LitElement {
  static properties = {
    value: { type: String },
    inputLabel: { attribute: false },
    checkLabel: { attribute: false },
  };

  static styles = css`
    :host {
      display: block;
      min-width: 0;
    }

    * {
      box-sizing: border-box;
    }

    form {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 0.5rem;
      min-width: 0;
    }

    label {
      grid-column: 1 / -1;
      font-weight: 700;
    }

    input {
      width: 100%;
      min-width: 0;
      min-height: 2.75rem;
      padding: 0.55rem 0.7rem;
      border: 1px solid #8d969e;
      border-radius: 0.35rem;
      font: inherit;
    }

    button {
      min-height: 2.75rem;
      padding: 0.6rem 1rem;
      border: 1px solid #17475d;
      border-radius: 0.35rem;
      background: #285f78;
      color: #fff;
      font: inherit;
      font-weight: 700;
      cursor: pointer;
    }

    @media (max-width: 30rem) {
      form {
        grid-template-columns: minmax(0, 1fr);
      }

      button {
        width: 100%;
      }
    }
  `;

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
