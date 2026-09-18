import { html, LitElement } from 'lit';

import type {
  NamedEquationChoice,
  RelationChoiceAnswer,
} from '../learner-answer';

export class NamedEquationChoiceInput extends LitElement {
  static properties = {
    choices: { attribute: false },
    selectedChoiceId: { attribute: false },
  };

  declare choices: readonly NamedEquationChoice[];
  declare selectedChoiceId: string | undefined;

  constructor() {
    super();
    this.choices = [];
    this.selectedChoiceId = undefined;
  }

  render() {
    return html`
      <form @submit=${this.handleSubmit}>
        <fieldset>
          <legend>Choose the named equation</legend>
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
        <button type="submit">Check</button>
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
