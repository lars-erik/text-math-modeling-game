import { html, LitElement } from 'lit';

import type {
  StoryQuantitiesScreen,
  StoryQuantitiesSelection,
} from '../story-quantities';

export class StoryQuantitiesInput extends LitElement {
  static properties = {
    screen: { attribute: false },
    knownLegend: { attribute: false },
    unknownLegend: { attribute: false },
    checkLabel: { attribute: false },
  };

  declare screen: StoryQuantitiesScreen;
  declare knownLegend: string;
  declare unknownLegend: string;
  declare checkLabel: string;

  constructor() {
    super();
    this.screen = {
      source: { kind: 'story', text: '' },
      target: { kind: 'quantities', prompt: '', choices: [] },
      input: { kind: 'quantity-selection', knownIds: [] },
    };
    this.knownLegend = '';
    this.unknownLegend = '';
    this.checkLabel = '';
  }

  render() {
    return html`
      <form @submit=${this.handleSubmit}>
        <fieldset>
          <legend>${this.knownLegend}</legend>
          ${this.screen.target.choices.map(
            (choice) => html`
              <label>
                <input
                  type="checkbox"
                  name="known-quantity"
                  value=${choice.id}
                  .checked=${this.screen.input.knownIds.includes(choice.id)}
                />
                ${choice.label}: ${choice.displayValue}
              </label>
            `,
          )}
        </fieldset>
        <fieldset>
          <legend>${this.unknownLegend}</legend>
          ${this.screen.target.choices.map(
            (choice) => html`
              <label>
                <input
                  type="radio"
                  name="unknown-quantity"
                  value=${choice.id}
                  .checked=${this.screen.input.unknownId === choice.id}
                  required
                />
                ${choice.label}
              </label>
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

    const data = new FormData(event.currentTarget);
    const unknownId = data.get('unknown-quantity');
    if (typeof unknownId !== 'string') {
      return;
    }
    const selection: StoryQuantitiesSelection = {
      knownIds: data.getAll('known-quantity').filter(
        (value): value is string => typeof value === 'string',
      ),
      unknownId,
    };

    this.dispatchEvent(
      new CustomEvent<StoryQuantitiesSelection>('puzzle-quantity-selection', {
        bubbles: true,
        composed: true,
        detail: selection,
      }),
    );
  }
}

if (customElements.get('story-quantities-input') === undefined) {
  customElements.define('story-quantities-input', StoryQuantitiesInput);
}

declare global {
  interface HTMLElementTagNameMap {
    'story-quantities-input': StoryQuantitiesInput;
  }
}
