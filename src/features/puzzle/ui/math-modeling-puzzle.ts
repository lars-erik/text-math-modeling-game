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
  presentTheme,
  submitPuzzle,
  type PuzzleScreen,
  type PuzzleScreenTask,
} from '../compose-puzzle';
import {
  guidanceEntryForHint,
  type GrayboxSession,
} from '../../session/graybox-session';
import type { SessionRunStore } from '../../session/session-run-store';
import { modeIds, selectGuidanceForMode } from '../modes';
import type { ModeSubmission, QuantitySelection } from '../modes/mode';
import type { LearnerAnswer } from '../learner-answer';
import {
  isPuzzleLocale,
  puzzleResources,
  type PuzzleLocale,
} from '../lang';
import {
  puzzleSelectionRequestEvent,
  sessionSelectionRequestEvent,
  type PuzzleSelectionRequest,
  type SessionSelectionRequest,
} from '../puzzle-request';
import { isThemeId } from '../../themes';
import type { Problem } from '../../problem-model/problem';
import { isModeId, type ModeId } from '../modes/mode';
import {
  navigateHomeRequestEvent,
  type NavigateHomeRequest,
} from '../../navigation/navigation-request';
import { navigationResources } from '../../navigation/lang';
import {
  defaultProblemFamilyId,
  generateFamilyCase,
  isProblemFamilyId,
  problemFamilies,
  type ProblemFamilyId,
} from '../../problem-generation/problem-families';
import {
  defaultHiddenRole,
  isHiddenRole,
  type HiddenRole,
} from '../../problem-generation/hidden-role';
import {
  isPuzzleInputMode,
  puzzleInputProviders,
  type PuzzleInputMode,
} from './puzzle-input-providers';
import {
  textAcademicDisplayAdapter,
  type AcademicDisplayAdapter,
} from './academic-display-adapter';
import {
  formatNamedRelation,
  type QuantityNameMap,
} from '../../representations/named-relation';
import './story-quantities-input';
import './story-choice-input';
import './puzzle-shell';
import './puzzle-menu';
import './academic-notation-display';

export class MathModelingPuzzle extends LitElement {
  static properties = {
    seed: { type: String },
    family: { type: String },
    hiddenRole: { attribute: 'hidden-role', type: String },
    session: { type: String },
    themeId: { attribute: 'theme', type: String },
    modeId: { attribute: 'mode', type: String },
    inputMode: { attribute: 'input-mode', reflect: true, type: String },
    locale: { reflect: true, type: String },
    academicDisplayAdapter: { attribute: false },
    screen: { state: true },
    activeSession: { state: true },
  };

  static styles = css`
    :host {
      display: block;
      min-width: 0;
      padding: clamp(0rem, 3vw, 2rem);
    }
    :host([hidden]) {
      display: none;
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
    .session-next,
    .session-hint {
      min-height: 2.75rem;
      margin-block-start: 0.75rem;
      padding: 0.6rem 1rem;
      border: 1px solid #17475d;
      border-radius: 0.35rem;
      background: #285f78;
      color: #fff;
      font: inherit;
      font-weight: 700;
      cursor: pointer;
    }
    .session-hint {
      border-color: #8d969e;
      background: #fff;
      color: #202428;
    }
    .quantity-list {
      display: grid;
      gap: 0.5rem;
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .answer-log {
      margin-block: 0.5rem 1rem;
    }
    .answer-log h3 {
      margin-block: 0 0.4rem;
      font-size: 0.9rem;
    }
    .answer-log-list {
      display: grid;
      gap: 0.25rem;
      margin: 0;
      padding-inline-start: 1.25rem;
    }
    .answer-log-list li {
      overflow-wrap: anywhere;
    }
    .quantity-list li {
      padding: 0.65rem 0.75rem;
      border: 1px solid #c5cbd1;
      border-radius: 0.35rem;
      background: #f7f8f9;
      overflow-wrap: anywhere;
    }
    .equation {
      margin-block: 1rem;
      padding: 0.85rem;
      border: 1px solid #c5cbd1;
      border-radius: 0.35rem;
      background: #f7f8f9;
      font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
      overflow-wrap: anywhere;
    }
    .symbol-key {
      margin-block-start: 1rem;
    }
    .symbol-key h3 {
      margin-block: 0 0.4rem;
      font-size: 0.9rem;
    }
    .symbol-key dl {
      display: grid;
      grid-template-columns: max-content minmax(0, 1fr);
      gap: 0.25rem 0.75rem;
      margin: 0;
    }
    .symbol-key dt {
      font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
      font-weight: 700;
    }
    .symbol-key dd {
      margin: 0;
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
  declare family: string;
  declare hiddenRole: string;
  declare session: string;
  declare themeId: string;
  declare modeId: string;
  declare inputMode: string;
  declare locale: string;
  declare academicDisplayAdapter: AcademicDisplayAdapter;
  private declare screen: PuzzleScreen | undefined;
  private declare generatedProblem: Problem;
  private declare activeSession: GrayboxSession | undefined;
  declare sessionRunStore: SessionRunStore | undefined;

  constructor() {
    super();
    this.seed = '17';
    this.family = defaultProblemFamilyId;
    this.hiddenRole = defaultHiddenRole;
    this.session = '';
    this.themeId = 'gaming.drone-power';
    this.modeId = 'story-to-quantities';
    this.inputMode = 'text';
    this.locale = 'en';
    this.academicDisplayAdapter = textAcademicDisplayAdapter;
    this.screen = undefined;
    this.generatedProblem = generateCase(
      defaultProblemFamilyId,
      defaultHiddenRole,
      17,
    );
    this.activeSession = undefined;
  }

  protected willUpdate(changedProperties: PropertyValues<this>): void {
    if (
      changedProperties.has('session') ||
      changedProperties.has('themeId') ||
      changedProperties.has('locale')
    ) {
      const localeOnlyChange =
        changedProperties.has('locale') &&
        !changedProperties.has('session') &&
        !changedProperties.has('themeId') &&
        this.activeSession !== undefined;
      this.activeSession = localeOnlyChange
        ? this.recordSession(
            this.activeSession?.withLocale(this.locale as PuzzleLocale),
          )
        : this.composeCurrentSession();
    }
    if (
      changedProperties.has('seed') ||
      changedProperties.has('family') ||
      changedProperties.has('hiddenRole')
    ) {
      this.generatedProblem = generateCase(
        this.currentFamilyId(),
        this.currentHiddenRole(),
        Number(this.seed),
      );
    }
    if (
      changedProperties.has('seed') ||
      changedProperties.has('family') ||
      changedProperties.has('hiddenRole') ||
      changedProperties.has('themeId') ||
      changedProperties.has('modeId') ||
      changedProperties.has('locale') ||
      changedProperties.has('session')
    ) {
      this.screen =
        this.activeSession === undefined
          ? this.composeCurrentScreen()
          : this.activeSession.screen;
    }
  }

  private composeCurrentSession(): GrayboxSession | undefined {
    if (
      !this.session ||
      !isThemeId(this.themeId) ||
      !isPuzzleLocale(this.locale)
    ) {
      return undefined;
    }
    const session = this.sessionRunStore?.provide({
      seed: Number(this.session),
      themeId: this.themeId,
      locale: this.locale,
    });
    return session === undefined
      ? undefined
      : this.recordSession(session);
  }

  private recordSession(
    session: GrayboxSession | undefined,
  ): GrayboxSession | undefined {
    if (session !== undefined) {
      this.sessionRunStore?.record(session);
    }
    return session;
  }

  private composeCurrentScreen(): PuzzleScreen | undefined {
    if (!isThemeId(this.themeId) || !isPuzzleLocale(this.locale)) {
      return undefined;
    }
    return composePuzzle({
      problem: this.generatedProblem,
      themeId: this.themeId,
      modeId: isModeId(this.modeId) ? this.modeId : 'story-to-quantities',
      locale: this.locale,
      storySeed: Number(this.seed),
    });
  }

  render() {
    if (!isThemeId(this.themeId)) {
      return html`<p role="alert">
        Unknown scenario ${JSON.stringify(this.themeId)}.
      </p>`;
    }
    if (this.activeSession !== undefined) {
      return this.renderSession(this.activeSession);
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
    const heading = this.headingFor(screen.screen, resources);
    return this.renderShell({
      locale: this.locale,
      heading,
      prompt: screen.screen.target.prompt,
      feedback: screen.feedback?.message ?? '',
      replay: screen.context.replay,
      menuSeed: Number(this.seed),
      menuModeId: isModeId(this.modeId) ? this.modeId : 'story-to-quantities',
      source: this.renderSource(screen, resources),
      input: this.renderInput(screen, resources),
    });
  }

  private headingFor(
    task: PuzzleScreenTask,
    resources: (typeof puzzleResources)[PuzzleLocale],
  ): string {
    switch (task.modeId) {
      case 'story-to-quantities':
        return resources.storyToQuantities.heading;
      case 'quantities-to-named-equation':
        return resources.quantitiesToNamedEquation.heading;
      case 'named-equation-to-academic-notation':
        return resources.namedEquationToAcademicNotation.heading;
      case 'academic-notation-to-named-equation':
        return resources.academicNotationToNamedEquation.heading;
          case 'named-model-to-story':
        return resources.namedModelToStory.heading;}
  }

  private renderSource(
    screen: PuzzleScreen,
    resources: (typeof puzzleResources)[PuzzleLocale],
  ) {
    const story = html`<p>${screen.context.story}</p>`;
    switch (screen.screen.modeId) {
      case 'story-to-quantities':
        return story;
      case 'quantities-to-named-equation':
        return html`${story}${this.renderQuantityList(screen)}`;
      case 'named-equation-to-academic-notation':
        return html`${story}${this.renderQuantityList(screen)}
          <p class="equation">
            ${formatNamedRelation(
              screen.screen.source.relation,
              screen.screen.source.names,
            )}
          </p>
          ${this.renderSymbolKey(
            screen.screen,
            resources.namedEquationToAcademicNotation.symbolKey,
          )}`;
      case 'academic-notation-to-named-equation':
        return html`${story}${this.renderQuantityList(screen)}
          <academic-notation-display
            .relation=${screen.screen.source.relation}
            .symbols=${screen.screen.source.symbols}
            .adapter=${this.academicDisplayAdapter}
          ></academic-notation-display>
          ${this.renderSymbolKey(
            screen.screen,
            resources.academicNotationToNamedEquation.symbolKey,
          )}`;
          case 'named-model-to-story':
        return html`${this.renderQuantityList(screen)}
          <p class="equation">
            ${formatNamedRelation(screen.screen.source.relation, this.nameMapOf(screen))}
          </p>`;}
  }

  private renderQuantityList(screen: PuzzleScreen) {
    return html`<ul class="quantity-list">
      ${screen.context.quantities.map(
        (quantity) => html`<li>
          ${quantity.variableName} =
          ${quantity.given.kind === 'known' ? quantity.given.value : '?'}
        </li>`,
      )}
    </ul>`;
  }

  private nameMapOf(screen: PuzzleScreen): QuantityNameMap {
    return Object.fromEntries(
      screen.context.quantities.map((quantity) => [
        quantity.id,
        quantity.variableName,
      ]),
    );
  }
  private renderSymbolKey(
    task:
      | Extract<PuzzleScreenTask, { modeId: 'named-equation-to-academic-notation' }>
      | Extract<PuzzleScreenTask, { modeId: 'academic-notation-to-named-equation' }>,
    label: string,
  ) {
    return html`<section class="symbol-key" aria-label=${label}>
      <h3>${label}</h3>
      <dl>
        ${task.symbolKey.map(
          (entry) => html`<dt>${entry.symbol}</dt><dd>${entry.variableName}</dd>`,
        )}
      </dl>
    </section>`;
  }

  private renderInput(
    screen: PuzzleScreen,
    resources: (typeof puzzleResources)[PuzzleLocale],
  ) {
    switch (screen.screen.modeId) {
      case 'story-to-quantities':
        return html`<div @puzzle-quantity-selection=${this.handleQuantitySelection}>
          <story-quantities-input
            .screen=${screen.screen}
            .knownLegend=${resources.storyToQuantities.knownLegend}
            .unknownLegend=${resources.storyToQuantities.unknownLegend}
            .checkLabel=${resources.controls.check}
          ></story-quantities-input>
        </div>`;
      case 'quantities-to-named-equation':
        return this.renderNamedEquationInput(this.locale as PuzzleLocale);
      case 'named-equation-to-academic-notation':
        return this.renderTextExpressionInput(
          screen,
          resources.namedEquationToAcademicNotation.inputLabel,
          resources.controls.check,
        );
      case 'academic-notation-to-named-equation':
        return this.renderTextExpressionInput(
          screen,
          resources.academicNotationToNamedEquation.inputLabel,
          resources.controls.check,
        );
      case 'named-model-to-story':
        return html`<div @puzzle-answer=${this.handleAnswer}>
          <story-choice-input
            .candidates=${screen.screen.target.candidates}
            .selectedChoiceId=${screen.screen.input.selectedChoiceId}
            .legend=${resources.namedModelToStory.choiceLegend}
            .checkLabel=${resources.controls.check}
          ></story-choice-input>
        </div>`;
    }
  }

  private renderTextExpressionInput(
    screen: PuzzleScreen,
    inputLabel: string,
    checkLabel: string,
  ) {
    const input =
      screen.screen.input.kind === 'expression'
        ? screen.screen.input.value
        : '';
    const acceptedAcademicRelation =
      screen.screen.modeId === 'named-equation-to-academic-notation' &&
      screen.feedback?.kind === 'accepted' &&
      screen.submission?.kind === 'academic-notation'
        ? screen.submission.relation
        : undefined;
    return html`<div @puzzle-answer=${this.handleAnswer}>
      <named-equation-text-input
        .value=${input}
        .inputLabel=${inputLabel}
        .checkLabel=${checkLabel}
      ></named-equation-text-input>
      ${acceptedAcademicRelation === undefined ||
      screen.screen.modeId !== 'named-equation-to-academic-notation'
        ? null
        : html`<academic-notation-display
            .relation=${acceptedAcademicRelation}
            .symbols=${screen.screen.target.symbols}
            .adapter=${this.academicDisplayAdapter}
          ></academic-notation-display>`}
    </div>`;
  }

  private renderNamedEquationInput(locale: PuzzleLocale) {
    if (!isPuzzleInputMode(this.inputMode)) {
      return html`<p role="alert">
        Unknown input mode ${JSON.stringify(this.inputMode)}.
      </p>`;
    }
    const screen = this.screen;
    if (screen === undefined || !isThemeId(this.themeId)) {
      return html``;
    }
    const problem = this.currentProblemFor();
    const resources = puzzleResources[locale];
    const inputProvider = puzzleInputProviders[this.inputMode];
    const choices = createNamedEquationChoices(
      problem,
      presentTheme(
        this.themeId,
        problem,
        locale,
        screen.context.replay?.storySeed ?? Number(this.seed),
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
  startSessionFromStore(): void {
    this.activeSession = this.composeCurrentSession();
    this.screen =
      this.activeSession === undefined
        ? this.composeCurrentScreen()
        : this.activeSession.screen;
  }

  private submitAnswer(answer: LearnerAnswer | QuantitySelection): void {
    if (this.activeSession !== undefined) {
      this.activeSession = this.recordSession(
        this.activeSession.submit(answer),
      );
      this.screen = this.activeSession?.screen;
      return;
    }
    if (
      !isThemeId(this.themeId) ||
      !isModeId(this.modeId) ||
      !isPuzzleLocale(this.locale)
    ) {
      return;
    }
    this.screen = submitPuzzle({
      problem: this.generatedProblem,
      themeId: this.themeId,
      modeId: this.modeId,
      locale: this.locale,
      storySeed: Number(this.seed),
      answer,
    });
  }

  private selectInputMode(mode: PuzzleInputMode): void {
    this.inputMode = mode;
    if (this.activeSession === undefined) {
      this.screen = this.composeCurrentScreen();
    }
  }

  private currentProblemFor(): Problem {
    if (this.activeSession !== undefined) {
      return (
        this.activeSession.currentProblem ?? this.generatedProblem
      );
    }
    return this.generatedProblem;
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
      if (this.activeSession !== undefined && this.session !== '') {
        this.requestSessionState({ locale });
        return;
      }
      this.requestApplicationState({ locale });
    }
  }

  private currentFamilyId(): ProblemFamilyId {
    return isProblemFamilyId(this.family)
      ? this.family
      : defaultProblemFamilyId;
  }

  private currentHiddenRole(): HiddenRole {
    const familyId = this.currentFamilyId();
    const hiddenRoles = problemFamilies[familyId].hiddenRoles;
    if (
      this.hiddenRole !== '' &&
      isHiddenRole(this.hiddenRole) &&
      hiddenRoles.includes(this.hiddenRole)
    ) {
      return this.hiddenRole;
    }
    return defaultHiddenRole;
  }

  private requestSessionState(
    changes: Pick<SessionSelectionRequest, 'locale'>,
  ): void {
    this.dispatchEvent(
      new CustomEvent<SessionSelectionRequest>(sessionSelectionRequestEvent, {
        bubbles: true,
        composed: true,
        detail: {
          seed: Number(this.session),
          themeId: isThemeId(this.themeId)
            ? this.themeId
            : 'gaming.drone-power',
          locale: changes.locale,
        },
      }),
    );
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
          familyId: this.currentFamilyId(),
          hiddenRole: this.currentHiddenRole(),
          themeId: isThemeId(this.themeId) ? this.themeId : 'gaming.drone-power',
          modeId: isModeId(this.modeId)
            ? this.modeId
            : 'story-to-quantities',
          locale: changes.locale,
        },
      }),
    );
  }

  private renderSession(session: GrayboxSession) {
    const locale = this.locale as PuzzleLocale;
    const resources = puzzleResources[locale];
    const sessionResources = resources.session;
    if (session.status === 'complete') {
      return html`
        <puzzle-shell
          .heading=${sessionResources.completionHeading}
          .sourceLabel=${resources.common.source}
          .targetLabel=${resources.common.target}
          .feedbackLabel=${resources.common.feedback}
          .prompt=${sessionResources.completedTotal(session.summary?.total ?? 0)}
          .feedback=${''}
          .replayLabel=${resources.common.replay}
          .hasReplay=${false}
        >
          <div slot="source">
            <p>${sessionResources.completedTotal(session.summary?.total ?? 0)}</p>
            <ul class="quantity-list">
              ${modeIds.map(
                (modeId) => html`<li>
                  ${this.modeLabel(modeId, resources)}:
                  ${session.summary?.counts[modeId] ?? 0}
                </li>`,
              )}
            </ul>
          </div>
          <div slot="input">
            ${this.renderAnswerLog(session, sessionResources, resources)}
            <button
              type="button"
              class="session-next"
              @click=${this.handleNavigateHome}
            >
              ${sessionResources.backToPuzzle}
            </button>
          </div>
        </puzzle-shell>
      `;
    }
    const screen = session.screen as PuzzleScreen;
    const heading = this.headingFor(screen.screen, resources);
    const positionLabel = sessionResources.positionLabel(
      session.position,
      session.total,
    );
    const hint = session.hint;
    const hintEntry = guidanceEntryForHint(session);
    const hintMessage =
      hint === undefined || hintEntry === undefined
        ? ''
        : sessionResources.hintText(hintEntry);
    const feedbackMessage = screen.feedback?.message ?? '';
    const feedbackText =
      hintMessage !== '' && feedbackMessage === ''
        ? hintMessage
        : [feedbackMessage, hintMessage]
            .filter((part) => part !== '')
            .join(' ');
    return this.renderShell({
      locale,
      heading,
      positionLabel,
      prompt: screen.screen.target.prompt,
      feedback: feedbackText,
      replay: screen.context.replay,
      menuSeed: session.replay.seed,
      menuModeId: screen.screen.modeId,
      source: this.renderSource(screen, resources),
      input: html`
        ${this.renderInput(screen, resources)}
        ${this.renderAnswerLog(session, sessionResources, resources)}
        ${session.availableNext
          ? html`<button
              type="button"
              class="session-next"
              @click=${this.handleSessionNext}
            >
              ${sessionResources.next}
            </button>`
          : ''}
        ${this.supportsHint(session)
          ? html`<button
              type="button"
              class="session-hint"
              @click=${this.handleSessionHint}
            >
              ${sessionResources.hint}
            </button>`
          : ''}
      `,
    });
  }

  private renderAnswerLog(
    session: GrayboxSession,
    sessionResources: (typeof puzzleResources)[PuzzleLocale]['session'],
    resources: (typeof puzzleResources)[PuzzleLocale],
  ) {
    if (session.answerLog.length === 0) {
      return '';
    }
    return html`
      <section class="answer-log" aria-label=${sessionResources.answerLogHeading}>
        <h3>${sessionResources.answerLogHeading}</h3>
        <ol class="answer-log-list">
          ${session.answerLog.map(
            (entry, index) => html`<li>
              ${index + 1}.
              ${this.modeLabel(entry.modeId, resources)}:
              ${this.describeSubmission(entry.submission)}
              (${entry.accepted
                ? sessionResources.answerLogCorrect
                : sessionResources.answerLogIncorrect})
            </li>`,
          )}
        </ol>
      </section>
    `;
  }

  private describeSubmission(submission: ModeSubmission): string {
    switch (submission.kind) {
      case 'quantity-selection':
        return `known=[${submission.knownIds.join(', ')}] unknown=${
          submission.unknownId ?? 'none'
        }`;
      case 'named-equation':
      case 'academic-notation':
        return submission.input;
          case 'story-choice':
        return `choice=${submission.choiceId}`;}
  }

  private handleNavigateHome(): void {
    this.dispatchEvent(
      new CustomEvent<NavigateHomeRequest>(navigateHomeRequestEvent, {
        bubbles: true,
        composed: true,
        detail: {},
      }),
    );
  }

  private supportsHint(session: GrayboxSession): boolean {
    if (session.status !== 'active') {
      return false;
    }
    const problem = session.currentProblem;
    const item = session.plan.items[session.currentIndex];
    if (problem === undefined || item === undefined) {
      return false;
    }
    return (
      selectGuidanceForMode({
        modeId: item.modeId,
        guidance: problem.guidance ?? [],
      }) !== undefined
    );
  }

  private modeLabel(
    modeId: (typeof modeIds)[number],
    resources: (typeof puzzleResources)[PuzzleLocale],
  ): string {
    switch (modeId) {
      case 'story-to-quantities':
        return resources.storyToQuantities.heading;
      case 'quantities-to-named-equation':
        return resources.quantitiesToNamedEquation.heading;
      case 'named-equation-to-academic-notation':
        return resources.namedEquationToAcademicNotation.heading;
      case 'academic-notation-to-named-equation':
        return resources.academicNotationToNamedEquation.heading;
          case 'named-model-to-story':
        return resources.namedModelToStory.heading;}
  }

  private handleSessionNext(): void {
    if (this.activeSession === undefined) {
      return;
    }
    this.activeSession = this.recordSession(this.activeSession.next());
    this.screen = this.activeSession?.screen;
  }

  private handleSessionHint(): void {
    if (this.activeSession === undefined) {
      return;
    }
    this.activeSession = this.recordSession(
      this.activeSession.requestHint(),
    );
  }

  private renderShell({
    locale,
    heading,
    positionLabel,
    prompt,
    source,
    input,
    feedback,
    replay,
    menuSeed,
    menuModeId,
  }: {
    locale: PuzzleLocale;
    heading: string;
    positionLabel?: string;
    prompt: string;
    source: TemplateResult;
    input: TemplateResult;
    feedback: string;
    replay?: { seed: number; generatorVersion: string; themeId: string; storySeed: number };
    menuSeed: number;
    menuModeId: ModeId;
  }) {
    const resources = puzzleResources[locale];
    const menuResources =
      navigationResources[locale] ?? navigationResources.en;
    return html`
      <puzzle-shell
        .heading=${positionLabel === undefined ? heading : `${heading} — ${positionLabel}`}
        .sourceLabel=${resources.common.source}
        .targetLabel=${resources.common.target}
        .feedbackLabel=${resources.common.feedback}
        .prompt=${prompt}
        .feedback=${feedback}
        .replayLabel=${resources.common.replay}
        .hasReplay=${replay !== undefined}
      >
        <div slot="menu" class="shell-menu">
          <button type="button" @click=${this.handleNavigateHome}>
            ${menuResources.menu.homeLabel}
          </button>
        </div>
        <label slot="language" class="language-control">
          ${resources.language.label}
          <select .value=${locale} @change=${this.handleLocaleChange}>
            <option value="en">${resources.language.en}</option>
            <option value="nb">${resources.language.nb}</option>
          </select>
        </label>
        <puzzle-menu
          slot="settings"
          .seed=${menuSeed}
          .familyId=${this.currentFamilyId()}
          .themeId=${this.themeId}
          .modeId=${menuModeId}
          .locale=${locale}
          .menuLabel=${resources.puzzleMenu.label}
          .hiddenRole=${this.currentHiddenRole()}
          .familyLabel=${resources.puzzleMenu.family}
          .hiddenRoleLabel=${resources.puzzleMenu.hiddenRole}
          .perItemUnknownLabel=${resources.puzzleMenu.perItemUnknown}
          .baseUnknownLabel=${resources.puzzleMenu.baseUnknown}
          .countUnknownLabel=${resources.puzzleMenu.countUnknown}
          .totalUnknownLabel=${resources.puzzleMenu.totalUnknown}
          .totalFromPartsLabel=${resources.puzzleMenu.totalFromParts}
          .groupsTotalLabel=${resources.puzzleMenu.groupsTotal}
          .scenarioLabel=${resources.puzzleMenu.scenario}
          .dronePowerLabel=${resources.puzzleMenu.dronePower}
          .creatorFollowersLabel=${resources.puzzleMenu.creatorFollowers}
          .taskLabel=${resources.puzzleMenu.task}
          .storyToQuantitiesLabel=${resources.puzzleMenu.storyToQuantities}
          .quantitiesToNamedEquationLabel=${resources.puzzleMenu.quantitiesToNamedEquation}
          .namedEquationToAcademicNotationLabel=${resources.puzzleMenu.namedEquationToAcademicNotation}
          .academicNotationToNamedEquationLabel=${resources.puzzleMenu.academicNotationToNamedEquation}
          .namedModelToStoryLabel=${resources.puzzleMenu.namedModelToStory}
          .seedLabel=${resources.puzzleMenu.seed}
          .showLabel=${resources.puzzleMenu.show}
          .startSessionLabel=${resources.puzzleMenu.startSession}
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
              <dd>${replay.themeId}</dd>
              <dt>${resources.common.storySeed}</dt>
              <dd>${replay.storySeed}</dd>
            </dl>`}
      </puzzle-shell>
    `;
  }
}

function generateCase(
  familyId: ProblemFamilyId,
  hiddenRole: HiddenRole,
  seed: number,
): Problem {
  const parsed = Number.isSafeInteger(seed) ? seed : 17;
  return generateFamilyCase(familyId, {
    seed: parsed,
    hiddenRole,
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
