import { css, html, LitElement } from 'lit';

import type { StoryToQuantitiesScreen } from '../compose-puzzle';
import type { QuantitySelection } from '../modes/mode';

export class StoryQuantitiesInput extends LitElement {
  static properties = {
    screen: { attribute: false },
    knownLegend: { attribute: false },
    unknownLegend: { attribute: false },
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
      gap: 1rem;
      min-width: 0;
    }

    fieldset {
      display: grid;
      gap: 0.5rem;
      min-width: 0;
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

  declare screen: StoryToQuantitiesScreen;
  declare knownLegend: string;
  declare unknownLegend: string;
  declare checkLabel: string;

  constructor() {
    super();
    this.screen = {
      modeId: 'story-to-quantities',
      source: { kind: 'story' },
      target: { kind: 'quantities', prompt: '', quantities: [] },
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
          ${this.screen.target.quantities.map(
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
          ${this.screen.target.quantities.map(
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
    const selection: QuantitySelection = {
      knownIds: data.getAll('known-quantity').filter(
        (value): value is string => typeof value === 'string',
      ),
      unknownId,
    };

    this.dispatchEvent(
      new CustomEvent<QuantitySelection>('puzzle-quantity-selection', {
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
