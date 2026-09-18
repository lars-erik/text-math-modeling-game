import {
  css,
  html,
  LitElement,
  type PropertyValues,
  type TemplateResult,
} from 'lit';

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
import './puzzle-shell';

export class MathModelingPuzzle extends LitElement {
  static properties = {
    puzzleKey: { attribute: 'puzzle', type: String },
    inputMode: { attribute: 'input-mode', reflect: true, type: String },
    locale: { reflect: true, type: String },
    screen: { state: true },
    storyScreen: { state: true },
  };

  static styles = css`
    :host {
      display: block;
      min-width: 0;
      padding: clamp(0rem, 3vw, 2rem);
    }

    * {
      box-sizing: border-box;
    }

    label,
    nav,
    ul,
    dl {
      min-width: 0;
    }

    .language-control {
      display: grid;
      gap: 0.25rem;
      color: #596168;
      font-size: 0.875rem;
      font-weight: 600;
    }

    select {
      min-height: 2.75rem;
      max-width: 100%;
      padding: 0.55rem 2rem 0.55rem 0.75rem;
      border: 1px solid #8d969e;
      border-radius: 0.35rem;
      background: #fff;
      color: #202428;
      font: inherit;
    }

    nav {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-block-end: 1rem;
    }

    nav button {
      min-height: 2.75rem;
      padding: 0.55rem 0.85rem;
      border: 1px solid #8d969e;
      border-radius: 0.35rem;
      background: #fff;
      color: #202428;
      font: inherit;
      cursor: pointer;
    }

    nav button[aria-pressed='true'] {
      border-color: #285f78;
      background: #dcebf2;
      font-weight: 700;
    }

    .quantity-list {
      display: grid;
      gap: 0.5rem;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .quantity-list li {
      padding: 0.65rem 0.75rem;
      border: 1px solid #c5cbd1;
      border-radius: 0.35rem;
      background: #f7f8f9;
      overflow-wrap: anywhere;
    }

    .replay-list {
      display: grid;
      grid-template-columns: max-content minmax(0, 1fr);
      gap: 0.25rem 0.75rem;
      margin-block-end: 0;
    }

    .replay-list dt {
      font-weight: 600;
    }

    .replay-list dd {
      min-width: 0;
      margin: 0;
      overflow-wrap: anywhere;
    }

    @media (max-width: 47.99rem) {
      :host {
        padding: 0;
      }
    }
  `;

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

    return this.renderShell({
      locale: this.locale,
      heading: resources.quantitiesToNamedEquation.heading,
      prompt: this.screen.target.prompt,
      feedback: this.screen.feedback?.message ?? '',
      replay: this.screen.replay,
      source: html`
        <ul class="quantity-list">
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
      `,
      input: html`
        <div @puzzle-answer=${this.handleAnswer}>
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
          ${inputProvider.render({
            definition: localizedPuzzleDefinition,
            screen: this.screen,
            resources,
          })}
        </div>
      `,
    });
  }

  private renderStoryQuantities(locale: PuzzleLocale) {
    const resources = puzzleResources[locale];
    const screen = this.storyScreen;
    if (screen === undefined) {
      return html``;
    }

    return this.renderShell({
      locale,
      heading: resources.storyToQuantities.heading,
      prompt: screen.target.prompt,
      feedback: screen.feedback?.message ?? '',
      replay: screen.replay,
      source: html`<p>${screen.source.text}</p>`,
      input: html`
        <div @puzzle-quantity-selection=${this.handleQuantitySelection}>
          <story-quantities-input
            .screen=${screen}
            .knownLegend=${resources.storyToQuantities.knownLegend}
            .unknownLegend=${resources.storyToQuantities.unknownLegend}
            .checkLabel=${resources.controls.check}
          ></story-quantities-input>
        </div>
      `,
    });
  }

  private renderShell({
    locale,
    heading,
    prompt,
    source,
    input,
    feedback,
    replay,
  }: {
    locale: PuzzleLocale;
    heading: string;
    prompt: string;
    source: TemplateResult;
    input: TemplateResult;
    feedback: string;
    replay:
      | {
          seed: number;
          generatorVersion: string;
          scenarioId?: string;
          storySeed?: number;
        }
      | undefined;
  }) {
    const resources = puzzleResources[locale];

    return html`
      <puzzle-shell
        .heading=${heading}
        .sourceLabel=${resources.common.source}
        .targetLabel=${resources.common.target}
        .feedbackLabel=${resources.common.feedback}
        .prompt=${prompt}
        .feedback=${feedback}
        .replayLabel=${resources.common.replay}
        .hasReplay=${replay !== undefined}
      >
        <label slot="language" class="language-control">
          ${resources.language.label}
          <select .value=${locale} @change=${this.handleLocaleChange}>
            <option value="en">${resources.language.en}</option>
            <option value="nb">${resources.language.nb}</option>
          </select>
        </label>
        <div slot="source">${source}</div>
        <div slot="input">${input}</div>
        ${replay === undefined
          ? null
          : html`
              <dl slot="replay" class="replay-list">
                <dt>${resources.common.seed}</dt>
                <dd>${replay.seed}</dd>
                <dt>${resources.common.generatorVersion}</dt>
                <dd>${replay.generatorVersion}</dd>
                ${replay.scenarioId === undefined
                  ? null
                  : html`
                      <dt>${resources.common.scenario}</dt>
                      <dd>${replay.scenarioId}</dd>
                    `}
                ${replay.storySeed === undefined
                  ? null
                  : html`
                      <dt>${resources.common.storySeed}</dt>
                      <dd>${replay.storySeed}</dd>
                    `}
              </dl>
            `}
      </puzzle-shell>
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
