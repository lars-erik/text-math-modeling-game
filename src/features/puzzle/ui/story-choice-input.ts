import { css, html, LitElement } from 'lit';
import type {
  ScreenStoryCandidate,
} from '../compose-puzzle';
import type { StoryChoiceAnswer } from '../learner-answer';

export class StoryChoiceInput extends LitElement {
  static properties = {
    candidates: { attribute: false },
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

  declare candidates: readonly ScreenStoryCandidate[];
  declare selectedChoiceId: string | undefined;
  declare legend: string;
  declare checkLabel: string;

  constructor() {
    super();
    this.candidates = [];
    this.selectedChoiceId = undefined;
    this.legend = 'Choose the matching situation';
    this.checkLabel = 'Check';
  }

  render() {
    return html`
      <form @submit=${this.handleSubmit}>
        <fieldset>
          <legend>${this.legend}</legend>
          ${this.candidates.map(
            (candidate) => html`
              <div>
                <label>
                  <input
                    type="radio"
                    name="story-choice"
                    value=${candidate.id}
                    .checked=${candidate.id === this.selectedChoiceId}
                    required
                  />
                  ${candidate.label}
                </label>
              </div>
            `,
          )}
        </fieldset>
        <button type="submit">${this.checkLabel}</button>
      </form>
    `;
  }

  private handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (!(event.currentTarget instanceof HTMLFormElement)) {
      return;
    }
    const choiceId = new FormData(event.currentTarget).get('story-choice');
    if (typeof choiceId !== 'string') {
      return;
    }
    this.selectedChoiceId = choiceId;
    this.dispatchEvent(
      new CustomEvent<StoryChoiceAnswer>('puzzle-answer', {
        bubbles: true,
        composed: true,
        detail: { kind: 'story-choice', choiceId },
      }),
    );
  }
}

if (customElements.get('story-choice-input') === undefined) {
  customElements.define('story-choice-input', StoryChoiceInput);
}

declare global {
  interface HTMLElementTagNameMap {
    'story-choice-input': StoryChoiceInput;
  }
}
