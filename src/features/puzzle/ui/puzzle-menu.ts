import { css, html, LitElement } from 'lit';
import {
  problemFamilyIds,
  problemFamilies,
  type ProblemFamilyId,
} from '../../problem-generation/problem-families';
import {
  isHiddenRole,
  type HiddenRole,
} from '../../problem-generation/hidden-role';
import { maximumGenerationSeed } from '../../problem-generation/random-source';
import {
  puzzleSelectionRequestEvent,
  sessionSelectionRequestEvent,
  type PuzzleSelectionRequest,
  type SessionSelectionRequest,
} from '../puzzle-request';
import type { PuzzleLocale } from '../lang';
import { isModeId, type ModeId } from '../modes/mode';
import { isThemeId, type ThemeId } from '../../themes';

export class PuzzleMenu extends LitElement {
  static properties = {
    seed: { type: Number },
    familyId: { attribute: 'family-id', type: String },
    hiddenRole: { attribute: 'hidden-role', type: String },
    themeId: { attribute: 'theme-id', type: String },
    modeId: { attribute: 'mode-id', type: String },
    locale: { type: String },
    menuLabel: { attribute: false },
    familyLabel: { attribute: false },
    hiddenRoleLabel: { attribute: false },
    perItemUnknownLabel: { attribute: false },
    baseUnknownLabel: { attribute: false },
    countUnknownLabel: { attribute: false },
    totalUnknownLabel: { attribute: false },
    totalFromPartsLabel: { attribute: false },
    groupsTotalLabel: { attribute: false },
    scenarioLabel: { attribute: false },
    dronePowerLabel: { attribute: false },
    creatorFollowersLabel: { attribute: false },
    taskLabel: { attribute: false },
    storyToQuantitiesLabel: { attribute: false },
    quantitiesToNamedEquationLabel: { attribute: false },
    namedEquationToAcademicNotationLabel: { attribute: false },
    academicNotationToNamedEquationLabel: { attribute: false },
    seedLabel: { attribute: false },
    showLabel: { attribute: false },
    startSessionLabel: { attribute: false },
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
      display: flex;
      align-items: end;
      gap: 0.75rem;
      min-width: 0;
    }
    label {
      display: grid;
      flex: 1 1 12rem;
      gap: 0.25rem;
      min-width: 0;
      color: #596168;
      font-size: 0.875rem;
      font-weight: 600;
    }
    select,
    input,
    button {
      min-height: 2.75rem;
      border-radius: 0.35rem;
      font: inherit;
    }
    select,
    input {
      width: 100%;
      min-width: 0;
      padding: 0.55rem 0.7rem;
      border: 1px solid #8d969e;
      background: #fff;
      color: #202428;
    }
    button {
      flex: 0 0 auto;
      padding: 0.6rem 1rem;
      border: 1px solid #17475d;
      background: #285f78;
      color: #fff;
      font-weight: 700;
      cursor: pointer;
    }
    @media (max-width: 40rem) {
      form {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
      }
      button {
        width: 100%;
      }
    }
  `;

  declare seed: number;
  declare familyId: ProblemFamilyId;
  declare hiddenRole: HiddenRole;
  declare themeId: ThemeId;
  declare modeId: ModeId;
  declare locale: PuzzleLocale;
  declare menuLabel: string;
  declare familyLabel: string;
  declare hiddenRoleLabel: string;
  declare perItemUnknownLabel: string;
  declare baseUnknownLabel: string;
  declare countUnknownLabel: string;
  declare totalUnknownLabel: string;
  declare totalFromPartsLabel: string;
  declare groupsTotalLabel: string;
  declare scenarioLabel: string;
  declare dronePowerLabel: string;
  declare creatorFollowersLabel: string;
  declare taskLabel: string;
  declare storyToQuantitiesLabel: string;
  declare quantitiesToNamedEquationLabel: string;
  declare namedEquationToAcademicNotationLabel: string;
  declare academicNotationToNamedEquationLabel: string;
  declare seedLabel: string;
  declare showLabel: string;
  declare startSessionLabel: string;

  constructor() {
    super();
    this.seed = 17;
    this.familyId = 'total-from-parts';
    this.hiddenRole = 'per-item';
    this.themeId = 'gaming.drone-power';
    this.modeId = 'story-to-quantities';
    this.locale = 'en';
    this.menuLabel = 'Puzzle menu';
    this.familyLabel = 'Problem family';
    this.hiddenRoleLabel = 'Unknown quantity';
    this.perItemUnknownLabel = 'Value per item';
    this.baseUnknownLabel = 'Base value';
    this.countUnknownLabel = 'Number of items';
    this.totalUnknownLabel = 'Total';
    this.totalFromPartsLabel = 'Total from base and parts';
    this.groupsTotalLabel = 'Equal groups';
    this.scenarioLabel = 'Scenario';
    this.dronePowerLabel = 'Spaceship and drones';
    this.creatorFollowersLabel = 'Creator and followers';
    this.taskLabel = 'Task';
    this.storyToQuantitiesLabel = 'Story to quantities';
    this.quantitiesToNamedEquationLabel = 'Quantities to named equation';
    this.namedEquationToAcademicNotationLabel =
      'Named equation to academic notation';
    this.academicNotationToNamedEquationLabel =
      'Academic notation to named equation';
    this.seedLabel = 'Seed';
    this.showLabel = 'Show puzzle';
    this.startSessionLabel = 'Start session';
  }

  render() {
    return html`
      <form aria-label=${this.menuLabel} @submit=${this.handleSubmit}>
        <label>
          ${this.familyLabel}
          <select name="family" .value=${this.familyId}>
            <option value="total-from-parts">
              ${this.totalFromPartsLabel}
            </option>
            <option value="groups-total">
              ${this.groupsTotalLabel}
            </option>
          </select>
        </label>
        <label>
          ${this.hiddenRoleLabel}
          <select name="hidden-role" .value=${this.hiddenRole}>
            ${problemFamilies[this.familyId].hiddenRoles.map(
              (hiddenRole) =>
                html`<option value=${hiddenRole} ?selected=${hiddenRole === this.hiddenRole}>
                  ${this.labelForHiddenRole(hiddenRole)}
                </option>`,
            )}
          </select>
        </label>
        <label>
          ${this.scenarioLabel}
          <select name="scenario" .value=${this.themeId}>
            <option value="gaming.drone-power">
              ${this.dronePowerLabel}
            </option>
            <option value="creator.followers">
              ${this.creatorFollowersLabel}
            </option>
          </select>
        </label>
        <label>
          ${this.taskLabel}
          <select name="task" .value=${this.modeId}>
            <option value="story-to-quantities">
              ${this.storyToQuantitiesLabel}
            </option>
            <option value="quantities-to-named-equation">
              ${this.quantitiesToNamedEquationLabel}
            </option>
            <option value="named-equation-to-academic-notation">
              ${this.namedEquationToAcademicNotationLabel}
            </option>
            <option value="academic-notation-to-named-equation">
              ${this.academicNotationToNamedEquationLabel}
            </option>
          </select>
        </label>
        <label>
          ${this.seedLabel}
          <input
            name="seed"
            type="number"
            min="0"
            max=${maximumGenerationSeed}
            step="1"
            .value=${String(this.seed)}
            required
          />
        </label>
        <button type="submit" name="action" value="puzzle">
          ${this.showLabel}
        </button>
        <button type="submit" name="action" value="session">
          ${this.startSessionLabel}
        </button>
      </form>
    `;
  }

  private labelForHiddenRole(hiddenRole: HiddenRole): string {
    switch (hiddenRole) {
      case 'per-item':
        return this.perItemUnknownLabel;
      case 'base':
        return this.baseUnknownLabel;
      case 'count':
        return this.countUnknownLabel;
      case 'total':
        return this.totalUnknownLabel;
    }
  }

  private handleSubmit(event: SubmitEvent): void {
    event.preventDefault();
    if (!(event.currentTarget instanceof HTMLFormElement)) {
      return;
    }
    const data = new FormData(event.currentTarget);
    const familyId = data.get('family');
    const hiddenRole = data.get('hidden-role');
    const themeId = data.get('scenario');
    const modeId = data.get('task');
    const seed = Number(data.get('seed'));
    const action =
      event.submitter instanceof HTMLButtonElement
        ? event.submitter.value
        : undefined;
    if (
      typeof familyId !== 'string' ||
      !(problemFamilyIds as readonly string[]).includes(familyId) ||
      typeof hiddenRole !== 'string' ||
      !isHiddenRole(hiddenRole) ||
      !problemFamilies[familyId as ProblemFamilyId].hiddenRoles.includes(
        hiddenRole,
      ) ||
      typeof themeId !== 'string' ||
      !isThemeId(themeId) ||
      typeof modeId !== 'string' ||
      !isModeId(modeId) ||
      !Number.isInteger(seed)
    ) {
      return;
    }
    if (action === 'session') {
      this.dispatchEvent(
        new CustomEvent<SessionSelectionRequest>(sessionSelectionRequestEvent, {
          bubbles: true,
          composed: true,
          detail: { seed, themeId, locale: this.locale },
        }),
      );
      return;
    }
    this.dispatchEvent(
      new CustomEvent<PuzzleSelectionRequest>(puzzleSelectionRequestEvent, {
        bubbles: true,
        composed: true,
        detail: {
          seed,
          familyId: familyId as ProblemFamilyId,
          hiddenRole,
          themeId,
          modeId,
          locale: this.locale,
        },
      }),
    );
  }
}

if (customElements.get('puzzle-menu') === undefined) {
  customElements.define('puzzle-menu', PuzzleMenu);
}

declare global {
  interface HTMLElementTagNameMap {
    'puzzle-menu': PuzzleMenu;
  }
}
