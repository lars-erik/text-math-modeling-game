import { css, html, LitElement } from 'lit';
import { navigationResources } from '../lang';
import type { PuzzleLocale } from '../../puzzle/lang';
import {
  navigatePuzzleRequestEvent,
  navigateSessionRequestEvent,
  type NavigatePuzzleRequest,
  type NavigateSessionRequest,
} from '../navigation-request';

export class HomeScreen extends LitElement {
  static properties = {
    locale: { reflect: true, type: String },
  };

  declare locale: string;

  constructor() {
    super();
    this.locale = 'en';
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
        <button
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
        </button>
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
