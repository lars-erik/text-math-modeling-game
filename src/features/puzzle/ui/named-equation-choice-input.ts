import { css, html, LitElement } from 'lit';

import type {
  NamedEquationChoice,
  RelationChoiceAnswer,
} from '../learner-answer';

export class NamedEquationChoiceInput extends LitElement {
  static properties = {
    choices: { attribute: false },
    selectedChoiceId: { attribute: false },
    legend: { attribute: false },
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

    form,
    fieldset {
      display: grid;
      gap: 0.5rem;
      min-width: 0;
    }

    fieldset {
      margin: 0;
      padding: 0;
      border: 0;
    }

    legend {
      margin-block-end: 0.5rem;
      font-weight: 700;
    }

    label {
      display: flex;
      align-items: flex-start;
      gap: 0.65rem;
      min-width: 0;
      padding: 0.7rem 0.75rem;
      border: 1px solid #c5cbd1;
      border-radius: 0.35rem;
      background: #fff;
      overflow-wrap: anywhere;
      cursor: pointer;
    }

    label:has(input:checked) {
      border-color: #285f78;
      background: #edf5f8;
    }

    input {
      flex: 0 0 auto;
      width: 1.15rem;
      height: 1.15rem;
      margin: 0.15rem 0 0;
      accent-color: #285f78;
    }

    button {
      justify-self: start;
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
      button {
        width: 100%;
      }
    }
  `;

  declare choices: readonly NamedEquationChoice[];
  declare selectedChoiceId: string | undefined;
  declare legend: string;
  declare checkLabel: string;

  constructor() {
    super();
    this.choices = [];
    this.selectedChoiceId = undefined;
    this.legend = 'Choose the named equation';
    this.checkLabel = 'Check';
  }

  render() {
    return html`
      <form @submit=${this.handleSubmit}>
        <fieldset>
          <legend>${this.legend}</legend>
          ${this.choices.map(
            (choice) => html`
              <div>
                <label>
                  <input
                    type="radio"
                    name="named-equation-choice"
                    value=${choice.id}
                    .checked=${choice.id === this.selectedChoiceId}
                    required
                  />
                  ${choice.label}
                </label>
              </div>
            `,
          )}
        </fieldset>
        <button type="submit">${this.checkLabel}</button>
      </form>
    `;
  }

  private handleSubmit(event: SubmitEvent): void {
    event.preventDefault();
    if (!(event.currentTarget instanceof HTMLFormElement)) {
      return;
    }

    const choiceId = new FormData(event.currentTarget).get(
      'named-equation-choice',
    );
    const choice = this.choices.find(
      (candidate) => candidate.id === choiceId,
    );
    if (choice === undefined) {
      return;
    }

    this.selectedChoiceId = choice.id;
    this.dispatchEvent(
      new CustomEvent<RelationChoiceAnswer>('puzzle-answer', {
        bubbles: true,
        composed: true,
        detail: {
          kind: 'relation-choice',
          choiceId: choice.id,
          label: choice.label,
          relation: choice.relation,
        },
      }),
    );
  }
}

if (customElements.get('named-equation-choice-input') === undefined) {
  customElements.define(
    'named-equation-choice-input',
    NamedEquationChoiceInput,
  );
}

declare global {
  interface HTMLElementTagNameMap {
    'named-equation-choice-input': NamedEquationChoiceInput;
  }
}
