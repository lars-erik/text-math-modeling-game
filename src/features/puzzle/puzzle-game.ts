import { html, LitElement } from 'lit';

import { referencePuzzle } from './reference-puzzle';
import { startPuzzle, type PuzzleScreen } from './start-puzzle';
import { submitPuzzle } from './submit-puzzle';

export class MathModelingPuzzle extends LitElement {
  static properties = {
    screen: { state: true },
  };

  private declare screen: PuzzleScreen;

  constructor() {
    super();
    this.screen = startPuzzle(referencePuzzle.problem);
  }

  render() {
    return html`
      <main>
        <h1>Quantities to named equation</h1>
        <p>${this.screen.target.prompt}</p>

        <section aria-labelledby="quantities-heading">
          <h2 id="quantities-heading">Quantities</h2>
          <ul>
            ${this.screen.source.quantities.map(
              (quantity) => html`
                <li>
                  ${quantity.id} =
                  ${quantity.given.kind === 'known'
                    ? quantity.given.value
                    : '?'}
                </li>
              `,
            )}
          </ul>
        </section>

        <form @submit=${this.handleSubmit}>
          <fieldset>
            <legend>Choose the named equation</legend>
            ${referencePuzzle.choices.map(
              (choice) => html`
                <div>
                  <label>
                    <input
                      type="radio"
                      name="named-equation"
                      value=${choice.id}
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

        <p role="status" aria-live="polite">
          ${this.screen.feedback?.message ?? ''}
        </p>
      </main>
    `;
  }

  private handleSubmit(event: SubmitEvent): void {
    event.preventDefault();

    if (!(event.currentTarget instanceof HTMLFormElement)) {
      return;
    }

    const choiceId = new FormData(event.currentTarget).get('named-equation');
    const choice = referencePuzzle.choices.find(
      (candidate) => candidate.id === choiceId,
    );

    if (choice === undefined) {
      return;
    }

    this.screen = submitPuzzle(referencePuzzle.problem, choice.relation);
  }
}

if (customElements.get('math-modeling-puzzle') === undefined) {
  customElements.define('math-modeling-puzzle', MathModelingPuzzle);
}

declare global {
  interface HTMLElementTagNameMap {
    'math-modeling-puzzle': MathModelingPuzzle;
  }
}
