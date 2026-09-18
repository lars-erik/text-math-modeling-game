import { html, LitElement, type PropertyValues } from 'lit';

import type { LearnerAnswer } from '../learner-answer';
import {
  findPuzzleDefinition,
  type NamedEquationLocaleDefinition,
  type PuzzleDefinition,
} from '../puzzle-definition';
import { startPuzzle, type PuzzleScreen } from '../start-puzzle';
import { submitPuzzle } from '../submit-puzzle';
import { puzzleResources, type PuzzleLocale } from '../lang';
import {
  startStoryQuantitiesPuzzle,
  submitStoryQuantitiesPuzzle,
  type StoryQuantitiesPuzzleDefinition,
  type StoryQuantitiesScreen,
  type StoryQuantitiesSelection,
} from '../story-quantities';
import {
  isPuzzleInputMode,
  puzzleInputProviders,
  type PuzzleInputMode,
} from './puzzle-input-providers';
import './story-quantities-input';

export class MathModelingPuzzle extends LitElement {
  static properties = {
    puzzleKey: { attribute: 'puzzle', type: String },
    inputMode: { attribute: 'input-mode', reflect: true, type: String },
    locale: { reflect: true, type: String },
    screen: { state: true },
    storyScreen: { state: true },
  };

  declare puzzleKey: string;
  declare inputMode: string;
  declare locale: string;
  private declare puzzleDefinition: PuzzleDefinition | undefined;
  private declare screen: PuzzleScreen | undefined;
  private declare storyDefinition: StoryQuantitiesPuzzleDefinition | undefined;
  private declare storyScreen: StoryQuantitiesScreen | undefined;
  private declare namedDefinition: NamedEquationLocaleDefinition | undefined;

  constructor() {
    super();
    this.puzzleKey = '';
    this.inputMode = 'text';
    this.locale = 'en';
    this.puzzleDefinition = undefined;
    this.screen = undefined;
    this.storyDefinition = undefined;
    this.storyScreen = undefined;
    this.namedDefinition = undefined;
  }

  protected willUpdate(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has('puzzleKey') || changedProperties.has('locale')) {
      this.puzzleDefinition = findPuzzleDefinition(this.puzzleKey);
      if (
        this.puzzleDefinition?.kind === 'story-to-quantities' &&
        this.puzzleDefinition.storyQuantities !== undefined &&
        isPuzzleLocale(this.locale)
      ) {
        this.storyDefinition =
          this.puzzleDefinition.storyQuantities.createDefinition(this.locale);
        this.storyScreen = startStoryQuantitiesPuzzle(this.storyDefinition);
        this.screen = undefined;
        this.namedDefinition = undefined;
      } else {
        this.storyDefinition = undefined;
        this.storyScreen = undefined;
        this.namedDefinition =
          this.puzzleDefinition && isPuzzleLocale(this.locale)
            ? (this.puzzleDefinition.namedEquation?.createDefinition(
                this.locale,
              ) ?? {
                learnerNames: this.puzzleDefinition.learnerNames,
                quantityNames: Object.fromEntries(
                  this.puzzleDefinition.problem.quantities.map((quantity) => [
                    quantity.id,
                    quantity.id,
                  ]),
                ),
                choices: this.puzzleDefinition.choices,
              })
            : undefined;
        this.screen =
          this.puzzleDefinition && isPuzzleLocale(this.locale)
            ? startPuzzle(
                this.puzzleDefinition.problem,
                puzzleResources[this.locale].quantitiesToNamedEquation.prompt,
              )
            : undefined;
      }
    }
  }

  render() {
    if (this.puzzleDefinition === undefined) {
      return html`<p role="alert">
        Unknown puzzle ${JSON.stringify(this.puzzleKey)}.
      </p>`;
    }

    if (!isPuzzleLocale(this.locale)) {
      return html`<p role="alert">
        Unknown locale ${JSON.stringify(this.locale)}.
      </p>`;
    }

    if (
      this.puzzleDefinition.kind === 'story-to-quantities' &&
      this.storyDefinition !== undefined &&
      this.storyScreen !== undefined
    ) {
      return this.renderStoryQuantities(this.locale);
    }

    if (this.screen === undefined) {
      return html`<p role="alert">Puzzle screen is unavailable.</p>`;
    }

    if (!isPuzzleInputMode(this.inputMode)) {
      return html`<p role="alert">
        Unknown input mode ${JSON.stringify(this.inputMode)}.
      </p>`;
    }

    const inputProvider = puzzleInputProviders[this.inputMode];
    const resources = puzzleResources[this.locale];
    const namedDefinition = this.namedDefinition;
    if (namedDefinition === undefined) {
      return html`<p role="alert">Named-equation definition is unavailable.</p>`;
    }
    const localizedPuzzleDefinition = {
      ...this.puzzleDefinition,
      learnerNames: namedDefinition.learnerNames,
      choices: namedDefinition.choices,
    };

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
                ${mode === 'text'
                  ? resources.controls.textInput
                  : resources.controls.multipleChoice}
              </button>
            `,
          )}
        </nav>

        <h1>${resources.quantitiesToNamedEquation.heading}</h1>
        <p>${this.screen.target.prompt}</p>

        <section aria-labelledby="quantities-heading">
          <h2 id="quantities-heading">${resources.common.quantities}</h2>
          <ul>
            ${this.screen.source.quantities.map(
              (quantity) => html`
                <li>
                  ${namedDefinition.quantityNames[quantity.id] ?? quantity.id} =
                  ${quantity.given.kind === 'known'
                    ? quantity.given.value
                    : '?'}
                </li>
              `,
            )}
          </ul>
        </section>

        ${inputProvider.render({
          definition: localizedPuzzleDefinition,
          screen: this.screen,
          resources,
        })}

        <p id="equation-feedback" role="status" aria-live="polite">
          ${this.screen.feedback?.message ?? ''}
        </p>
      </main>
    `;
  }

  private renderStoryQuantities(locale: PuzzleLocale) {
    const resources = puzzleResources[locale];
    const screen = this.storyScreen;
    if (screen === undefined) {
      return html``;
    }

    return html`
      <main @puzzle-quantity-selection=${this.handleQuantitySelection}>
        <label>
          ${resources.language.label}
          <select .value=${locale} @change=${this.handleLocaleChange}>
            <option value="en">${resources.language.en}</option>
            <option value="nb">${resources.language.nb}</option>
          </select>
        </label>
        <h1>${resources.storyToQuantities.heading}</h1>
        <section aria-labelledby="story-source-heading">
          <h2 id="story-source-heading">${resources.common.source}</h2>
          <p>${screen.source.text}</p>
        </section>
        <p>${screen.target.prompt}</p>
        <story-quantities-input
          .screen=${screen}
          .knownLegend=${resources.storyToQuantities.knownLegend}
          .unknownLegend=${resources.storyToQuantities.unknownLegend}
          .checkLabel=${resources.controls.check}
        ></story-quantities-input>
        <p role="status" aria-live="polite">
          ${screen.feedback?.message ?? ''}
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
      this.namedDefinition?.learnerNames ?? this.puzzleDefinition.learnerNames,
      isPuzzleLocale(this.locale)
        ? {
            prompt:
              puzzleResources[this.locale].quantitiesToNamedEquation.prompt,
            accepted:
              puzzleResources[this.locale].quantitiesToNamedEquation.accepted,
            groupingMismatch:
              puzzleResources[this.locale].quantitiesToNamedEquation
                .groupingMismatch,
            reversedSides:
              puzzleResources[this.locale].quantitiesToNamedEquation
                .reversedSides,
            unknownIdentifier:
              puzzleResources[this.locale].quantitiesToNamedEquation
                .unknownIdentifier,
          }
        : {},
    );
  }

  private selectInputMode(mode: PuzzleInputMode): void {
    this.inputMode = mode;
    if (this.puzzleDefinition !== undefined) {
      this.screen = startPuzzle(
        this.puzzleDefinition.problem,
        isPuzzleLocale(this.locale)
          ? puzzleResources[this.locale].quantitiesToNamedEquation.prompt
          : undefined,
      );
    }
  }

  private handleQuantitySelection(
    event: CustomEvent<StoryQuantitiesSelection>,
  ): void {
    if (this.storyDefinition === undefined) {
      return;
    }
    this.storyScreen = submitStoryQuantitiesPuzzle(
      this.storyDefinition,
      event.detail,
    );
  }

  private handleLocaleChange(event: Event): void {
    if (event.currentTarget instanceof HTMLSelectElement) {
      this.locale = event.currentTarget.value;
    }
  }
}

function isPuzzleLocale(value: string): value is PuzzleLocale {
  return value === 'en' || value === 'nb';
}

if (customElements.get('math-modeling-puzzle') === undefined) {
  customElements.define('math-modeling-puzzle', MathModelingPuzzle);
}

declare global {
  interface HTMLElementTagNameMap {
    'math-modeling-puzzle': MathModelingPuzzle;
  }
}
