import {
  css,
  html,
  LitElement,
  type PropertyValues,
  type TemplateResult,
} from 'lit';
import {
  composePuzzle,
  createNamedEquationChoices,
  presentSkin,
  submitPuzzle,
  type PuzzleScreen,
} from '../compose-puzzle';
import type { QuantitySelection } from '../modes/mode';
import type { LearnerAnswer } from '../learner-answer';
import {
  isPuzzleLocale,
  puzzleResources,
  type PuzzleLocale,
} from '../lang';
import {
  puzzleSelectionRequestEvent,
  type PuzzleSelectionRequest,
} from '../puzzle-request';
import { isSkinId } from '../../skins';
import type { Problem } from '../../problem-model/problem';
import { isModeId, type ModeId } from '../modes/mode';
import {
  generateTotalFromPartsCase,
  defaultTotalFromPartsGenerationConfig,
} from '../../problem-generation/generate-total-from-parts';
import {
  isPuzzleInputMode,
  puzzleInputProviders,
  type PuzzleInputMode,
} from './puzzle-input-providers';
import './story-quantities-input';
import './puzzle-shell';
import './puzzle-menu';

export class MathModelingPuzzle extends LitElement {
  static properties = {
    seed: { type: String },
    skinId: { attribute: 'skin', type: String },
    modeId: { attribute: 'mode', type: String },
    inputMode: { attribute: 'input-mode', reflect: true, type: String },
    locale: { reflect: true, type: String },
    screen: { state: true },
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

  declare seed: string;
  declare skinId: string;
  declare modeId: string;
  declare inputMode: string;
  declare locale: string;
  private declare screen: PuzzleScreen | undefined;
  private declare generatedProblem: Problem;

  constructor() {
    super();
    this.seed = '17';
    this.skinId = 'gaming.drone-power';
    this.modeId = 'story-to-quantities';
    this.inputMode = 'text';
    this.locale = 'en';
    this.screen = undefined;
    this.generatedProblem = generateCase(17);
  }

  protected willUpdate(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has('seed')) {
      this.generatedProblem = generateCase(Number(this.seed));
    }
    if (
      changedProperties.has('seed') ||
      changedProperties.has('skinId') ||
      changedProperties.has('modeId') ||
      changedProperties.has('locale')
    ) {
      this.screen = this.composeCurrentScreen();
    }
  }

  private composeCurrentScreen(): PuzzleScreen | undefined {
    if (!isSkinId(this.skinId) || !isPuzzleLocale(this.locale)) {
      return undefined;
    }
    return composePuzzle({
      problem: this.generatedProblem,
      skinId: this.skinId,
      modeId: isModeId(this.modeId) ? this.modeId : 'story-to-quantities',
      locale: this.locale,
      storySeed: Number(this.seed),
    });
  }

  render() {
    if (!isSkinId(this.skinId)) {
      return html`<p role="alert">
        Unknown scenario ${JSON.stringify(this.skinId)}.
      </p>`;
    }
    if (!isModeId(this.modeId)) {
      return html`<p role="alert">
        Unknown task ${JSON.stringify(this.modeId)}.
      </p>`;
    }
    if (!isPuzzleLocale(this.locale)) {
      return html`<p role="alert">
        Unknown locale ${JSON.stringify(this.locale)}.
      </p>`;
    }
    if (this.screen === undefined) {
      return html`<p role="alert">Puzzle screen is unavailable.</p>`;
    }
    const screen = this.screen;
    const resources = puzzleResources[this.locale];
    const heading =
      screen.screen.modeId === 'story-to-quantities'
        ? resources.storyToQuantities.heading
        : resources.quantitiesToNamedEquation.heading;
    return this.renderShell({
      locale: this.locale,
      heading,
      prompt: screen.screen.target.prompt,
      feedback: screen.feedback?.message ?? '',
      replay: screen.context.replay,
      source:
        screen.screen.modeId === 'story-to-quantities'
          ? html`<p>${screen.context.story}</p>`
          : html`<p>${screen.context.story}</p>
              <ul class="quantity-list">
                ${screen.context.quantities.map(
                  (quantity) => html`<li>
                    ${quantity.variableName} =
                    ${quantity.given.kind === 'known'
                      ? quantity.given.value
                      : '?'}
                  </li>`,
                )}
              </ul>`,
      input:
        screen.screen.modeId === 'story-to-quantities'
          ? html`<div @puzzle-quantity-selection=${this.handleQuantitySelection}>
              <story-quantities-input
                .screen=${screen.screen}
                .knownLegend=${resources.storyToQuantities.knownLegend}
                .unknownLegend=${resources.storyToQuantities.unknownLegend}
                .checkLabel=${resources.controls.check}
              ></story-quantities-input>
            </div>`
          : this.renderNamedEquationInput(this.locale),
    });
  }

  private renderNamedEquationInput(locale: PuzzleLocale) {
    if (!isPuzzleInputMode(this.inputMode)) {
      return html`<p role="alert">
        Unknown input mode ${JSON.stringify(this.inputMode)}.
      </p>`;
    }
    const screen = this.screen;
    if (screen === undefined || !isSkinId(this.skinId)) {
      return html``;
    }
    const resources = puzzleResources[locale];
    const inputProvider = puzzleInputProviders[this.inputMode];
    const choices = createNamedEquationChoices(
      this.generatedProblem,
      presentSkin(
        this.skinId,
        this.generatedProblem,
        locale,
        Number(this.seed),
      ),
    );
    return html`<div @puzzle-answer=${this.handleAnswer}>
      <nav aria-label=${resources.controls.inputMode}>
        ${(Object.keys(puzzleInputProviders) as PuzzleInputMode[]).map(
          (mode) => html`<button
            type="button"
            aria-pressed=${this.inputMode === mode}
            @click=${() => this.selectInputMode(mode)}
          >
            ${mode === 'text'
              ? resources.controls.textInput
              : resources.controls.multipleChoice}
          </button>`,
        )}
      </nav>
      ${inputProvider.render({
        definition: { choices },
        screen: { ...screen, submission: screen.submission },
        resources,
      })}
    </div>`;
  }

  private handleAnswer(event: CustomEvent<LearnerAnswer>): void {
    this.submitAnswer(event.detail);
  }

  private submitAnswer(answer: LearnerAnswer | QuantitySelection): void {
    if (
      !isSkinId(this.skinId) ||
      !isModeId(this.modeId) ||
      !isPuzzleLocale(this.locale)
    ) {
      return;
    }
    this.screen = submitPuzzle({
      problem: this.generatedProblem,
      skinId: this.skinId,
      modeId: this.modeId,
      locale: this.locale,
      storySeed: Number(this.seed),
      answer,
    });
  }

  private selectInputMode(mode: PuzzleInputMode): void {
    this.inputMode = mode;
    this.screen = this.composeCurrentScreen();
  }

  private handleQuantitySelection(
    event: CustomEvent<QuantitySelection>,
  ): void {
    this.submitAnswer(event.detail);
  }

  private handleLocaleChange(event: Event): void {
    if (
      event.currentTarget instanceof HTMLSelectElement &&
      isPuzzleLocale(event.currentTarget.value)
    ) {
      const locale = event.currentTarget.value;
      this.locale = locale;
      this.requestApplicationState({ locale });
    }
  }

  private requestApplicationState(
    changes: Pick<PuzzleSelectionRequest, 'locale'>,
  ): void {
    this.dispatchEvent(
      new CustomEvent<PuzzleSelectionRequest>(puzzleSelectionRequestEvent, {
        bubbles: true,
        composed: true,
        detail: {
          seed: Number(this.seed),
          skinId: isSkinId(this.skinId) ? this.skinId : 'gaming.drone-power',
          modeId: isModeId(this.modeId)
            ? this.modeId
            : 'story-to-quantities',
          locale: changes.locale,
        },
      }),
    );
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
    replay?: { seed: number; generatorVersion: string; skinId: string; storySeed: number };
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
        <puzzle-menu
          slot="settings"
          .seed=${Number(this.seed)}
          .skinId=${this.skinId}
          .modeId=${this.modeId}
          .locale=${locale}
          .menuLabel=${resources.puzzleMenu.label}
          .scenarioLabel=${resources.puzzleMenu.scenario}
          .dronePowerLabel=${resources.puzzleMenu.dronePower}
          .creatorFollowersLabel=${resources.puzzleMenu.creatorFollowers}
          .taskLabel=${resources.puzzleMenu.task}
          .storyToQuantitiesLabel=${resources.puzzleMenu.storyToQuantities}
          .quantitiesToNamedEquationLabel=${resources.puzzleMenu.quantitiesToNamedEquation}
          .seedLabel=${resources.puzzleMenu.seed}
          .showLabel=${resources.puzzleMenu.show}
        ></puzzle-menu>
        <div slot="source">${source}</div>
        <div slot="input">${input}</div>
        ${replay === undefined
          ? null
          : html`<dl slot="replay" class="replay-list">
              <dt>${resources.common.seed}</dt>
              <dd>${replay.seed}</dd>
              <dt>${resources.common.generatorVersion}</dt>
              <dd>${replay.generatorVersion}</dd>
              <dt>${resources.common.scenario}</dt>
              <dd>${replay.skinId}</dd>
              <dt>${resources.common.storySeed}</dt>
              <dd>${replay.storySeed}</dd>
            </dl>`}
      </puzzle-shell>
    `;
  }
}

function generateCase(seed: number): Problem {
  const parsed = Number.isSafeInteger(seed) ? seed : 17;
  return generateTotalFromPartsCase({
    seed: parsed,
    config: defaultTotalFromPartsGenerationConfig,
  }).problem;
}

if (customElements.get('math-modeling-puzzle') === undefined) {
  customElements.define('math-modeling-puzzle', MathModelingPuzzle);
}

declare global {
  interface HTMLElementTagNameMap {
    'math-modeling-puzzle': MathModelingPuzzle;
  }
}
