import { html, LitElement, type PropertyValues } from 'lit';

import type { LearnerAnswer } from '../learner-answer';
import {
  findPuzzleDefinition,
  type PuzzleDefinition,
} from '../puzzle-definition';
import { startPuzzle, type PuzzleScreen } from '../start-puzzle';
import { submitPuzzle } from '../submit-puzzle';
import {
  isPuzzleInputMode,
  puzzleInputProviders,
  type PuzzleInputMode,
} from './puzzle-input-providers';

export class MathModelingPuzzle extends LitElement {
  static properties = {
    puzzleKey: { attribute: 'puzzle', type: String },
    inputMode: { attribute: 'input-mode', reflect: true, type: String },
    screen: { state: true },
  };

  declare puzzleKey: string;
  declare inputMode: string;
  private declare puzzleDefinition: PuzzleDefinition | undefined;
  private declare screen: PuzzleScreen | undefined;

  constructor() {
    super();
    this.puzzleKey = '';
    this.inputMode = 'text';
    this.puzzleDefinition = undefined;
    this.screen = undefined;
  }

  protected willUpdate(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has('puzzleKey')) {
      this.puzzleDefinition = findPuzzleDefinition(this.puzzleKey);
      this.screen = this.puzzleDefinition
        ? startPuzzle(this.puzzleDefinition.problem)
        : undefined;
    }
  }

  render() {
    if (this.puzzleDefinition === undefined || this.screen === undefined) {
      return html`<p role="alert">
        Unknown puzzle ${JSON.stringify(this.puzzleKey)}.
      </p>`;
    }

    if (!isPuzzleInputMode(this.inputMode)) {
      return html`<p role="alert">
        Unknown input mode ${JSON.stringify(this.inputMode)}.
      </p>`;
    }

    const inputProvider = puzzleInputProviders[this.inputMode];

    return html`
      <main @puzzle-answer=${this.handleAnswer}>
        <nav aria-label="Input mode">
          ${(
            Object.keys(puzzleInputProviders) as PuzzleInputMode[]
          ).map(
            (mode) => html`
              <button
                type="button"
                aria-pressed=${this.inputMode === mode}
                @click=${() => this.selectInputMode(mode)}
              >
                ${puzzleInputProviders[mode].label}
              </button>
            `,
          )}
        </nav>

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

        ${inputProvider.render({
          definition: this.puzzleDefinition,
          screen: this.screen,
        })}

        <p id="equation-feedback" role="status" aria-live="polite">
          ${this.screen.feedback?.message ?? ''}
        </p>
      </main>
    `;
  }

  private handleAnswer(event: CustomEvent<LearnerAnswer>): void {
    if (this.puzzleDefinition === undefined) {
      return;
    }

    this.screen = submitPuzzle(
      this.puzzleDefinition.problem,
      event.detail,
      this.puzzleDefinition.learnerNames,
    );
  }

  private selectInputMode(mode: PuzzleInputMode): void {
    this.inputMode = mode;
    if (this.puzzleDefinition !== undefined) {
      this.screen = startPuzzle(this.puzzleDefinition.problem);
    }
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
