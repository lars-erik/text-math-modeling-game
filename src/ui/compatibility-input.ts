import { html, LitElement } from 'lit';

export class CompatibilityInput extends LitElement {
  static properties = {
    submittedText: { state: true },
  };

  private declare submittedText: string;

  constructor() {
    super();
    this.submittedText = '';
  }

  render() {
    return html`
      <form @submit=${this.handleSubmit}>
        <label for="compatibility-text">Compatibility text</label>
        <input
          id="compatibility-text"
          name="compatibility-text"
          autocomplete="off"
        />
        <button type="submit">Submit</button>
      </form>
      <p role="status" aria-live="polite">
        ${this.submittedText === ''
          ? 'Nothing submitted'
          : `Submitted: ${this.submittedText}`}
      </p>
    `;
  }

  private handleSubmit(event: SubmitEvent): void {
    event.preventDefault();

    if (!(event.currentTarget instanceof HTMLFormElement)) {
      return;
    }

    const value = new FormData(event.currentTarget).get('compatibility-text');
    this.submittedText = typeof value === 'string' ? value : '';
  }
}

if (customElements.get('compatibility-input') === undefined) {
  customElements.define('compatibility-input', CompatibilityInput);
}

declare global {
  interface HTMLElementTagNameMap {
    'compatibility-input': CompatibilityInput;
  }
}
