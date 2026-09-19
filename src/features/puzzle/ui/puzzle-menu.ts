import { css, html, LitElement } from 'lit';

import { maximumTotalFromPartsSeed } from '../../problem-generation/generate-total-from-parts';
import {
  puzzleSelectionRequestEvent,
  type PuzzleSelectionRequest,
} from '../puzzle-request';
import type { PuzzleLocale } from '../lang';
import {
  isPuzzleTask,
  type PuzzleTask,
} from '../puzzle-definition';
import {
  isSupportedScenarioId,
  type SupportedScenarioId,
} from '../seeded-puzzle';

export class PuzzleMenu extends LitElement {
  static properties = {
    seed: { type: Number },
    scenarioId: { attribute: 'scenario-id', type: String },
    task: { type: String },
    locale: { type: String },
    menuLabel: { attribute: false },
    scenarioLabel: { attribute: false },
    dronePowerLabel: { attribute: false },
    creatorFollowersLabel: { attribute: false },
    taskLabel: { attribute: false },
    storyToQuantitiesLabel: { attribute: false },
    quantitiesToNamedEquationLabel: { attribute: false },
    seedLabel: { attribute: false },
    showLabel: { attribute: false },
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
  declare scenarioId: SupportedScenarioId;
  declare task: PuzzleTask;
  declare locale: PuzzleLocale;
  declare menuLabel: string;
  declare scenarioLabel: string;
  declare dronePowerLabel: string;
  declare creatorFollowersLabel: string;
  declare taskLabel: string;
  declare storyToQuantitiesLabel: string;
  declare quantitiesToNamedEquationLabel: string;
  declare seedLabel: string;
  declare showLabel: string;

  constructor() {
    super();
    this.seed = 17;
    this.scenarioId = 'gaming.drone-power';
    this.task = 'story-to-quantities';
    this.locale = 'en';
    this.menuLabel = 'Puzzle menu';
    this.scenarioLabel = 'Scenario';
    this.dronePowerLabel = 'Spaceship and drones';
    this.creatorFollowersLabel = 'Creator and followers';
    this.taskLabel = 'Task';
    this.storyToQuantitiesLabel = 'Story to quantities';
    this.quantitiesToNamedEquationLabel = 'Quantities to named equation';
    this.seedLabel = 'Seed';
    this.showLabel = 'Show puzzle';
  }

  render() {
    return html`
      <form aria-label=${this.menuLabel} @submit=${this.handleSubmit}>
        <label>
          ${this.scenarioLabel}
          <select name="scenario" .value=${this.scenarioId}>
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
          <select name="task" .value=${this.task}>
            <option value="story-to-quantities">
              ${this.storyToQuantitiesLabel}
            </option>
            <option value="quantities-to-named-equation">
              ${this.quantitiesToNamedEquationLabel}
            </option>
          </select>
        </label>
        <label>
          ${this.seedLabel}
          <input
            name="seed"
            type="number"
            min="0"
            max=${maximumTotalFromPartsSeed}
            step="1"
            .value=${String(this.seed)}
            required
          />
        </label>
        <button type="submit">${this.showLabel}</button>
      </form>
    `;
  }

  private handleSubmit(event: SubmitEvent): void {
    event.preventDefault();
    if (!(event.currentTarget instanceof HTMLFormElement)) {
      return;
    }

    const data = new FormData(event.currentTarget);
    const scenarioId = data.get('scenario');
    const task = data.get('task');
    const seed = Number(data.get('seed'));
    if (
      typeof scenarioId !== 'string' ||
      !isSupportedScenarioId(scenarioId) ||
      typeof task !== 'string' ||
      !isPuzzleTask(task) ||
      !Number.isInteger(seed)
    ) {
      return;
    }

    this.dispatchEvent(
      new CustomEvent<PuzzleSelectionRequest>(puzzleSelectionRequestEvent, {
        bubbles: true,
        composed: true,
        detail: { seed, scenarioId, task, locale: this.locale },
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
