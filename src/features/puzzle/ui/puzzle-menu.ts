import { css, html, LitElement } from 'lit';

import { maximumTotalFromPartsSeed } from '../../problem-generation/generate-total-from-parts';
import {
  puzzleGenerationRequestEvent,
  type PuzzleGenerationRequest,
} from '../puzzle-request';
import {
  isSupportedScenarioId,
  type SupportedScenarioId,
} from '../seeded-puzzle';

export class PuzzleMenu extends LitElement {
  static properties = {
    seed: { type: Number },
    scenarioId: { attribute: 'scenario-id', type: String },
    menuLabel: { attribute: false },
    scenarioLabel: { attribute: false },
    dronePowerLabel: { attribute: false },
    creatorFollowersLabel: { attribute: false },
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
  declare menuLabel: string;
  declare scenarioLabel: string;
  declare dronePowerLabel: string;
  declare creatorFollowersLabel: string;
  declare seedLabel: string;
  declare showLabel: string;

  constructor() {
    super();
    this.seed = 17;
    this.scenarioId = 'gaming.drone-power';
    this.menuLabel = 'Puzzle menu';
    this.scenarioLabel = 'Scenario';
    this.dronePowerLabel = 'Spaceship and drones';
    this.creatorFollowersLabel = 'Creator and followers';
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
    const seed = Number(data.get('seed'));
    if (
      typeof scenarioId !== 'string' ||
      !isSupportedScenarioId(scenarioId) ||
      !Number.isInteger(seed)
    ) {
      return;
    }

    this.dispatchEvent(
      new CustomEvent<PuzzleGenerationRequest>(puzzleGenerationRequestEvent, {
        bubbles: true,
        composed: true,
        detail: { seed, scenarioId },
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
