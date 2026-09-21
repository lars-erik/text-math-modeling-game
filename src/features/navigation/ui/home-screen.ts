import { css, html, LitElement } from 'lit';
import { navigationResources } from '../lang';
import type { PuzzleLocale } from '../../puzzle/lang';
import type { CompletedSessionSummaryView } from '../../session/persistence/session-snapshot';
import {
  navigatePuzzleRequestEvent,
  navigateResumeSessionRequestEvent,
  navigateSessionRequestEvent,
  type NavigatePuzzleRequest,
  type NavigateResumeSessionRequest,
  type NavigateSessionRequest,
} from '../navigation-request';

export class HomeScreen extends LitElement {
  static properties = {
    locale: { reflect: true, type: String },
    activeRun: { state: true },
    completedRuns: { state: true },
  };

  declare locale: string;
  declare activeRun: { seed: number; position: number; total: number } | undefined;
  declare completedRuns: readonly CompletedSessionSummaryView[];

  constructor() {
    super();
    this.locale = 'en';
    this.activeRun = undefined;
    this.completedRuns = [];
  }

  static styles = css`
    :host {
      display: block;
      padding: clamp(0rem, 3vw, 2rem);
    }
    :host([hidden]) {
      display: none;
    }
    section {
      display: grid;
      gap: 1rem;
      max-width: 30rem;
      margin-inline: auto;
      padding: 1.5rem;
      border: 1px solid #8d969e;
      border-radius: 0.5rem;
      background: #fff;
    }
    h1 {
      margin: 0;
      font-size: 1.5rem;
    }
    h2 {
      margin: 0;
      font-size: 1rem;
    }
    button {
      min-height: 2.75rem;
      padding: 0.55rem 0.85rem;
      border: 1px solid #8d969e;
      border-radius: 0.35rem;
      background: #fff;
      color: #202428;
      font: inherit;
      cursor: pointer;
    }
    button:hover {
      background: #eef1f4;
    }
    .session-history {
      display: grid;
      gap: 0.5rem;
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .session-history li {
      padding: 0.5rem 0.6rem;
      border: 1px solid #c5cbd1;
      border-radius: 0.35rem;
      background: #f7f8f9;
      font-size: 0.9rem;
    }
  `;

  render() {
    const resources =
      navigationResources[this.locale as PuzzleLocale] ??
      navigationResources.en;
    return html`
      <section>
        <h1>${resources.home.heading}</h1>
        <button
          type="button"
          @click=${() =>
            this.dispatchEvent(
              new CustomEvent<NavigatePuzzleRequest>(
                navigatePuzzleRequestEvent,
                {
                  bubbles: true,
                  composed: true,
                  detail: {},
                },
              ),
            )}
        >
          ${resources.home.puzzleLabel}
        </button>
        ${this.activeRun === undefined
          ? html`<button
              type="button"
              @click=${() =>
                this.dispatchEvent(
                  new CustomEvent<NavigateSessionRequest>(
                    navigateSessionRequestEvent,
                    {
                      bubbles: true,
                      composed: true,
                      detail: {},
                    },
                  ),
                )}
            >
              ${resources.home.sessionLabel}
            </button>`
          : html`<button
              type="button"
              @click=${() =>
                this.dispatchEvent(
                  new CustomEvent<NavigateResumeSessionRequest>(
                    navigateResumeSessionRequestEvent,
                    {
                      bubbles: true,
                      composed: true,
                      detail: {},
                    },
                  ),
                )}
            >
              ${resources.home.continueLabel}
            </button>`}
        <section class="history" aria-label=${resources.home.historyHeading}>
          <h2>${resources.home.historyHeading}</h2>
          ${this.completedRuns.length === 0
            ? html`<p>${resources.home.historyEmpty}</p>`
            : html`<ul class="session-history">
                ${this.completedRuns.map(
                  (run) => html`<li>
                    ${resources.home.historyEntry({
                      seed: run.seed,
                      total: run.total,
                    })}
                  </li>`,
                )}
              </ul>`}
        </section>
      </section>
    `;
  }
}

if (customElements.get('home-screen') === undefined) {
  customElements.define('home-screen', HomeScreen);
}

declare global {
  interface HTMLElementTagNameMap {
    'home-screen': HomeScreen;
  }
}
