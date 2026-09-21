import{A as e,C as t,D as n,E as r,F as i,M as a,N as o,O as s,P as c,S as l,T as u,_ as d,a as f,d as p,f as m,g as h,h as g,i as _,j as v,k as y,m as b,n as x,o as S,p as C,r as w,t as T,v as E,w as D}from"./academic-relation-CWpL86H9.js";var O=class extends w{static properties={choices:{attribute:!1},selectedChoiceId:{attribute:!1},legend:{attribute:!1},checkLabel:{attribute:!1}};static styles=f`
    :host {
      display: block;
      min-width: 0;
    }

    * {
      box-sizing: border-box;
    }

    form,
    fieldset {
      display: grid;
      gap: 0.5rem;
      min-width: 0;
    }

    fieldset {
      margin: 0;
      padding: 0;
      border: 0;
    }

    legend {
      margin-block-end: 0.5rem;
      font-weight: 700;
    }

    label {
      display: flex;
      align-items: flex-start;
      gap: 0.65rem;
      min-width: 0;
      padding: 0.7rem 0.75rem;
      border: 1px solid #c5cbd1;
      border-radius: 0.35rem;
      background: #fff;
      overflow-wrap: anywhere;
      cursor: pointer;
    }

    label:has(input:checked) {
      border-color: #285f78;
      background: #edf5f8;
    }

    input {
      flex: 0 0 auto;
      width: 1.15rem;
      height: 1.15rem;
      margin: 0.15rem 0 0;
      accent-color: #285f78;
    }

    button {
      justify-self: start;
      min-height: 2.75rem;
      padding: 0.6rem 1rem;
      border: 1px solid #17475d;
      border-radius: 0.35rem;
      background: #285f78;
      color: #fff;
      font: inherit;
      font-weight: 700;
      cursor: pointer;
    }

    @media (max-width: 30rem) {
      button {
        width: 100%;
      }
    }
  `;constructor(){super(),this.choices=[],this.selectedChoiceId=void 0,this.legend=`Choose the named equation`,this.checkLabel=`Check`}render(){return _`
      <form @submit=${this.handleSubmit}>
        <fieldset>
          <legend>${this.legend}</legend>
          ${this.choices.map(e=>_`
              <div>
                <label>
                  <input
                    type="radio"
                    name="named-equation-choice"
                    value=${e.id}
                    .checked=${e.id===this.selectedChoiceId}
                    required
                  />
                  ${e.label}
                </label>
              </div>
            `)}
        </fieldset>
        <button type="submit">${this.checkLabel}</button>
      </form>
    `}handleSubmit(e){if(e.preventDefault(),!(e.currentTarget instanceof HTMLFormElement))return;let t=new FormData(e.currentTarget).get(`named-equation-choice`),n=this.choices.find(e=>e.id===t);n!==void 0&&(this.selectedChoiceId=n.id,this.dispatchEvent(new CustomEvent(`puzzle-answer`,{bubbles:!0,composed:!0,detail:{kind:`relation-choice`,choiceId:n.id,label:n.label,relation:n.relation}})))}};customElements.get(`named-equation-choice-input`)===void 0&&customElements.define(`named-equation-choice-input`,O);var k=class extends w{static properties={value:{type:String},inputLabel:{attribute:!1},checkLabel:{attribute:!1}};static styles=f`
    :host {
      display: block;
      min-width: 0;
    }

    * {
      box-sizing: border-box;
    }

    form {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 0.5rem;
      min-width: 0;
    }

    label {
      grid-column: 1 / -1;
      font-weight: 700;
    }

    input {
      width: 100%;
      min-width: 0;
      min-height: 2.75rem;
      padding: 0.55rem 0.7rem;
      border: 1px solid #8d969e;
      border-radius: 0.35rem;
      font: inherit;
    }

    button {
      min-height: 2.75rem;
      padding: 0.6rem 1rem;
      border: 1px solid #17475d;
      border-radius: 0.35rem;
      background: #285f78;
      color: #fff;
      font: inherit;
      font-weight: 700;
      cursor: pointer;
    }

    @media (max-width: 30rem) {
      form {
        grid-template-columns: minmax(0, 1fr);
      }

      button {
        width: 100%;
      }
    }
  `;constructor(){super(),this.value=``,this.inputLabel=`Named equation`,this.checkLabel=`Check`}render(){return _`
      <form @submit=${this.handleSubmit}>
        <label for="named-equation">${this.inputLabel}</label>
        <input
          id="named-equation"
          name="named-equation"
          type="text"
          .value=${this.value}
          required
        />
        <button type="submit">${this.checkLabel}</button>
      </form>
    `}handleSubmit(e){if(e.preventDefault(),!(e.currentTarget instanceof HTMLFormElement))return;let t=new FormData(e.currentTarget).get(`named-equation`);typeof t==`string`&&this.dispatchEvent(new CustomEvent(`puzzle-answer`,{bubbles:!0,composed:!0,detail:{kind:`text`,input:t}}))}};customElements.get(`named-equation-text-input`)===void 0&&customElements.define(`named-equation-text-input`,k);var A={"multiple-choice":{label:`Multiple choice`,render:({definition:e,screen:t,resources:n})=>_`
      <named-equation-choice-input
        .choices=${e.choices}
        .selectedChoiceId=${t.submission?.kind===`named-equation`?t.submission.choiceId:void 0}
        .legend=${n.quantitiesToNamedEquation.choiceLegend}
        .checkLabel=${n.controls.check}
      ></named-equation-choice-input>
    `},text:{label:`Text input`,render:({screen:e,resources:t})=>_`
      <named-equation-text-input
        .value=${e.submission?.kind===`named-equation`&&e.submission.answerKind===`text`?e.submission.input:``}
        .inputLabel=${t.quantitiesToNamedEquation.inputLabel}
        .checkLabel=${t.controls.check}
      ></named-equation-text-input>
    `}};function j(e){return Object.hasOwn(A,e)}var M={render(e,t,n){n.textContent=T(e,t)}},N=class extends w{static properties={screen:{attribute:!1},knownLegend:{attribute:!1},unknownLegend:{attribute:!1},checkLabel:{attribute:!1}};static styles=f`
    :host {
      display: block;
      min-width: 0;
    }

    * {
      box-sizing: border-box;
    }

    form {
      display: grid;
      gap: 1rem;
      min-width: 0;
    }

    fieldset {
      display: grid;
      gap: 0.5rem;
      min-width: 0;
      margin: 0;
      padding: 0;
      border: 0;
    }

    legend {
      margin-block-end: 0.5rem;
      font-weight: 700;
    }

    label {
      display: flex;
      align-items: flex-start;
      gap: 0.65rem;
      min-width: 0;
      padding: 0.7rem 0.75rem;
      border: 1px solid #c5cbd1;
      border-radius: 0.35rem;
      background: #fff;
      overflow-wrap: anywhere;
      cursor: pointer;
    }

    label:has(input:checked) {
      border-color: #285f78;
      background: #edf5f8;
    }

    input {
      flex: 0 0 auto;
      width: 1.15rem;
      height: 1.15rem;
      margin: 0.15rem 0 0;
      accent-color: #285f78;
    }

    button {
      justify-self: start;
      min-height: 2.75rem;
      padding: 0.6rem 1rem;
      border: 1px solid #17475d;
      border-radius: 0.35rem;
      background: #285f78;
      color: #fff;
      font: inherit;
      font-weight: 700;
      cursor: pointer;
    }

    @media (max-width: 30rem) {
      button {
        width: 100%;
      }
    }
  `;constructor(){super(),this.screen={modeId:`story-to-quantities`,source:{kind:`story`},target:{kind:`quantities`,prompt:``,quantities:[]},input:{kind:`quantity-selection`,knownIds:[]}},this.knownLegend=``,this.unknownLegend=``,this.checkLabel=``}render(){return _`
      <form @submit=${this.handleSubmit}>
        <fieldset>
          <legend>${this.knownLegend}</legend>
          ${this.screen.target.quantities.map(e=>_`
              <label>
                <input
                  type="checkbox"
                  name="known-quantity"
                  value=${e.id}
                  .checked=${this.screen.input.knownIds.includes(e.id)}
                />
                ${e.label}: ${e.displayValue}
              </label>
            `)}
        </fieldset>
        <fieldset>
          <legend>${this.unknownLegend}</legend>
          ${this.screen.target.quantities.map(e=>_`
              <label>
                <input
                  type="radio"
                  name="unknown-quantity"
                  value=${e.id}
                  .checked=${this.screen.input.unknownId===e.id}
                  required
                />
                ${e.label}
              </label>
            `)}
        </fieldset>
        <button type="submit">${this.checkLabel}</button>
      </form>
    `}handleSubmit(e){if(e.preventDefault(),!(e.currentTarget instanceof HTMLFormElement))return;let t=new FormData(e.currentTarget),n=t.get(`unknown-quantity`);if(typeof n!=`string`)return;let r={knownIds:t.getAll(`known-quantity`).filter(e=>typeof e==`string`),unknownId:n};this.dispatchEvent(new CustomEvent(`puzzle-quantity-selection`,{bubbles:!0,composed:!0,detail:r}))}};customElements.get(`story-quantities-input`)===void 0&&customElements.define(`story-quantities-input`,N);var P=class extends w{static properties={heading:{type:String},sourceLabel:{attribute:`source-label`,type:String},targetLabel:{attribute:`target-label`,type:String},feedbackLabel:{attribute:`feedback-label`,type:String},prompt:{type:String},feedback:{type:String},replayLabel:{attribute:`replay-label`,type:String},hasReplay:{attribute:`has-replay`,type:Boolean}};static styles=f`
    :host {
      --border: #c5cbd1;
      --surface: #ffffff;
      --surface-muted: #f3f5f6;
      --text: #202428;
      --text-muted: #596168;
      --accent: #285f78;
      display: block;
      min-width: 0;
      color: var(--text);
      font-family:
        Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
        "Segoe UI", sans-serif;
      line-height: 1.5;
    }

    * {
      box-sizing: border-box;
    }

    main {
      width: min(100%, 70rem);
      min-width: 0;
      margin: 0 auto;
      border: 1px solid var(--border);
      border-radius: 0.75rem;
      background: var(--surface-muted);
      box-shadow: 0 0.25rem 1rem rgb(25 35 45 / 8%);
      overflow: hidden;
    }

    header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1.5rem;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid var(--border);
      background: var(--surface);
    }

    .settings {
      padding: 1rem 1.5rem;
      border-bottom: 1px solid var(--border);
      background: var(--surface-muted);
    }

    h1,
    h2,
    p {
      margin-block-start: 0;
    }

    h1 {
      margin-block-end: 0;
      font-size: clamp(1.35rem, 4vw, 2rem);
      line-height: 1.2;
    }

    h2 {
      margin-block-end: 0.75rem;
      color: var(--text-muted);
      font-size: 0.75rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .language {
      flex: 0 0 auto;
    }

    .menu {
      display: flex;
      flex: 0 0 auto;
      align-items: center;
      gap: 1rem;
    }

    .menu button {
      padding: 0.6rem 1rem;
      border: 1px solid #17475d;
      border-radius: 0.35rem;
      background: #285f78;
      color: #fff;
      font: inherit;
      font-weight: 700;
      cursor: pointer;
    }

    .representations {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      min-width: 0;
    }

    section {
      min-width: 0;
      padding: 1.5rem;
      background: var(--surface);
    }

    .source {
      border-right: 1px solid var(--border);
    }

    .prompt {
      color: var(--text-muted);
    }

    .feedback {
      border-top: 1px solid var(--border);
      background: var(--surface-muted);
    }

    [role='status'] {
      min-height: 1.5em;
      margin-block-end: 0;
      overflow-wrap: anywhere;
    }

    details {
      padding: 0.75rem 1.5rem;
      border-top: 1px solid var(--border);
      color: var(--text-muted);
      font-size: 0.875rem;
    }

    summary {
      cursor: pointer;
      font-weight: 600;
    }

    @media (max-width: 47.99rem) {
      main {
        border-right: 0;
        border-left: 0;
        border-radius: 0;
      }

      header {
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
      }

      .settings {
        padding: 1rem;
      }

      .language {
        width: 100%;
      }

      .menu {
        width: 100%;
      }

      .representations {
        grid-template-columns: minmax(0, 1fr);
      }

      section {
        padding: 1rem;
      }

      .source {
        border-right: 0;
        border-bottom: 1px solid var(--border);
      }

      details {
        padding-inline: 1rem;
      }
    }
  `;constructor(){super(),this.heading=``,this.sourceLabel=``,this.targetLabel=``,this.feedbackLabel=``,this.prompt=``,this.feedback=``,this.replayLabel=``,this.hasReplay=!1}render(){return _`
      <main aria-labelledby="puzzle-heading">
        <header>
          <h1 id="puzzle-heading">${this.heading}</h1>
          <div class="menu"><slot name="menu"></slot></div>
          <div class="language"><slot name="language"></slot></div>
        </header>

        <div class="settings"><slot name="settings"></slot></div>

        <div class="representations">
          <section class="source" aria-labelledby="source-heading">
            <h2 id="source-heading">${this.sourceLabel}</h2>
            <slot name="source"></slot>
          </section>

          <section class="target" aria-labelledby="target-heading">
            <h2 id="target-heading">${this.targetLabel}</h2>
            <p class="prompt">${this.prompt}</p>
            <slot name="input"></slot>
          </section>
        </div>

        <section class="feedback" aria-labelledby="feedback-heading">
          <h2 id="feedback-heading">${this.feedbackLabel}</h2>
          <p role="status" aria-live="polite">${this.feedback}</p>
        </section>

        ${this.hasReplay?_`
              <details>
                <summary>${this.replayLabel}</summary>
                <slot name="replay"></slot>
              </details>
            `:null}
      </main>
    `}};customElements.get(`puzzle-shell`)===void 0&&customElements.define(`puzzle-shell`,P);var F=class extends w{static properties={seed:{type:Number},familyId:{attribute:`family-id`,type:String},hiddenRole:{attribute:`hidden-role`,type:String},themeId:{attribute:`theme-id`,type:String},modeId:{attribute:`mode-id`,type:String},locale:{type:String},menuLabel:{attribute:!1},familyLabel:{attribute:!1},hiddenRoleLabel:{attribute:!1},perItemUnknownLabel:{attribute:!1},baseUnknownLabel:{attribute:!1},countUnknownLabel:{attribute:!1},totalUnknownLabel:{attribute:!1},totalFromPartsLabel:{attribute:!1},groupsTotalLabel:{attribute:!1},scenarioLabel:{attribute:!1},dronePowerLabel:{attribute:!1},creatorFollowersLabel:{attribute:!1},taskLabel:{attribute:!1},storyToQuantitiesLabel:{attribute:!1},quantitiesToNamedEquationLabel:{attribute:!1},namedEquationToAcademicNotationLabel:{attribute:!1},academicNotationToNamedEquationLabel:{attribute:!1},seedLabel:{attribute:!1},showLabel:{attribute:!1},startSessionLabel:{attribute:!1}};static styles=f`
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
  `;constructor(){super(),this.seed=17,this.familyId=`total-from-parts`,this.hiddenRole=`per-item`,this.themeId=`gaming.drone-power`,this.modeId=`story-to-quantities`,this.locale=`en`,this.menuLabel=`Puzzle menu`,this.familyLabel=`Problem family`,this.hiddenRoleLabel=`Unknown quantity`,this.perItemUnknownLabel=`Value per item`,this.baseUnknownLabel=`Base value`,this.countUnknownLabel=`Number of items`,this.totalUnknownLabel=`Total`,this.totalFromPartsLabel=`Total from base and parts`,this.groupsTotalLabel=`Equal groups`,this.scenarioLabel=`Scenario`,this.dronePowerLabel=`Spaceship and drones`,this.creatorFollowersLabel=`Creator and followers`,this.taskLabel=`Task`,this.storyToQuantitiesLabel=`Story to quantities`,this.quantitiesToNamedEquationLabel=`Quantities to named equation`,this.namedEquationToAcademicNotationLabel=`Named equation to academic notation`,this.academicNotationToNamedEquationLabel=`Academic notation to named equation`,this.seedLabel=`Seed`,this.showLabel=`Show puzzle`,this.startSessionLabel=`Start session`}willUpdate(e){if(e.has(`familyId`)){let e=u[this.familyId].hiddenRoles;e.includes(this.hiddenRole)||(this.hiddenRole=e.includes(`per-item`)?n:e[0])}}render(){return _`
      <form aria-label=${this.menuLabel} @submit=${this.handleSubmit}>
        <label>
          ${this.familyLabel}
          <select
            name="family"
            .value=${this.familyId}
            @change=${this.handleFamilyChange}
          >
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
            ${u[this.familyId].hiddenRoles.map(e=>_`<option value=${e} ?selected=${e===this.hiddenRole}>
                  ${this.labelForHiddenRole(e)}
                </option>`)}
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
            max=${y}
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
    `}handleFamilyChange(e){e.currentTarget instanceof HTMLSelectElement&&D(e.currentTarget.value)&&(this.familyId=e.currentTarget.value)}labelForHiddenRole(e){switch(e){case`per-item`:return this.perItemUnknownLabel;case`base`:return this.baseUnknownLabel;case`count`:return this.countUnknownLabel;case`total`:return this.totalUnknownLabel}}handleSubmit(e){if(e.preventDefault(),!(e.currentTarget instanceof HTMLFormElement))return;let t=new FormData(e.currentTarget),n=t.get(`family`),i=t.get(`hidden-role`),o=t.get(`scenario`),l=t.get(`task`),f=Number(t.get(`seed`)),p=e.submitter instanceof HTMLButtonElement?e.submitter.value:void 0;if(typeof n==`string`&&r.includes(n)&&typeof i==`string`&&s(i)&&u[n].hiddenRoles.includes(i)&&typeof o==`string`&&c(o)&&typeof l==`string`&&a(l)&&Number.isInteger(f)){if(p===`session`){this.dispatchEvent(new CustomEvent(d,{bubbles:!0,composed:!0,detail:{seed:f,themeId:o,locale:this.locale}}));return}this.dispatchEvent(new CustomEvent(h,{bubbles:!0,composed:!0,detail:{seed:f,familyId:n,hiddenRole:i,themeId:o,modeId:l,locale:this.locale}}))}}};customElements.get(`puzzle-menu`)===void 0&&customElements.define(`puzzle-menu`,F);var I=class extends w{static properties={relation:{attribute:!1},symbols:{attribute:!1},adapter:{attribute:!1}};static styles=f`
    :host {
      display: block;
      min-width: 0;
    }
    .output {
      min-width: 0;
      overflow-x: auto;
    }
  `;constructor(){super(),this.relation=void 0,this.symbols={},this.adapter=M}render(){let e=this.relation?T(this.relation,this.symbols):``;return _`<div class="output" aria-label=${e}></div>`}updated(e){let t=this.renderRoot.querySelector(`.output`);t!==null&&this.relation!==void 0&&this.adapter.render(this.relation,this.symbols,t)}};customElements.get(`academic-notation-display`)===void 0&&customElements.define(`academic-notation-display`,I);var L=class extends w{static properties={seed:{type:String},family:{type:String},hiddenRole:{attribute:`hidden-role`,type:String},session:{type:String},themeId:{attribute:`theme`,type:String},modeId:{attribute:`mode`,type:String},inputMode:{attribute:`input-mode`,reflect:!0,type:String},locale:{reflect:!0,type:String},academicDisplayAdapter:{attribute:!1},screen:{state:!0},activeSession:{state:!0}};static styles=f`
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
  `;constructor(){super(),this.seed=`17`,this.family=l,this.hiddenRole=n,this.session=``,this.themeId=`gaming.drone-power`,this.modeId=`story-to-quantities`,this.inputMode=`text`,this.locale=`en`,this.academicDisplayAdapter=M,this.screen=void 0,this.generatedProblem=R(l,n,17),this.activeSession=void 0}willUpdate(e){if(e.has(`session`)||e.has(`themeId`)||e.has(`locale`)){let t=e.has(`locale`)&&!e.has(`session`)&&!e.has(`themeId`)&&this.activeSession!==void 0;this.activeSession=t?this.recordSession(this.activeSession?.withLocale(this.locale)):this.composeCurrentSession()}(e.has(`seed`)||e.has(`family`)||e.has(`hiddenRole`))&&(this.generatedProblem=R(this.currentFamilyId(),this.currentHiddenRole(),Number(this.seed))),(e.has(`seed`)||e.has(`family`)||e.has(`hiddenRole`)||e.has(`themeId`)||e.has(`modeId`)||e.has(`locale`)||e.has(`session`))&&(this.screen=this.activeSession===void 0?this.composeCurrentScreen():this.activeSession.screen)}composeCurrentSession(){if(!this.session||!c(this.themeId)||!i(this.locale))return;let e=this.sessionRunStore?.provide({seed:Number(this.session),themeId:this.themeId,locale:this.locale});return e===void 0?void 0:this.recordSession(e)}recordSession(e){return e!==void 0&&this.sessionRunStore?.record(e),e}composeCurrentScreen(){if(c(this.themeId)&&i(this.locale))return p({problem:this.generatedProblem,themeId:this.themeId,modeId:a(this.modeId)?this.modeId:`story-to-quantities`,locale:this.locale,storySeed:Number(this.seed)})}render(){if(!c(this.themeId))return _`<p role="alert">
        Unknown scenario ${JSON.stringify(this.themeId)}.
      </p>`;if(this.activeSession!==void 0)return this.renderSession(this.activeSession);if(!a(this.modeId))return _`<p role="alert">
        Unknown task ${JSON.stringify(this.modeId)}.
      </p>`;if(!i(this.locale))return _`<p role="alert">
        Unknown locale ${JSON.stringify(this.locale)}.
      </p>`;if(this.screen===void 0)return _`<p role="alert">Puzzle screen is unavailable.</p>`;let e=this.screen,t=v[this.locale],n=this.headingFor(e.screen,t);return this.renderShell({locale:this.locale,heading:n,prompt:e.screen.target.prompt,feedback:e.feedback?.message??``,replay:e.context.replay,menuSeed:Number(this.seed),menuModeId:a(this.modeId)?this.modeId:`story-to-quantities`,source:this.renderSource(e,t),input:this.renderInput(e,t)})}headingFor(e,t){switch(e.modeId){case`story-to-quantities`:return t.storyToQuantities.heading;case`quantities-to-named-equation`:return t.quantitiesToNamedEquation.heading;case`named-equation-to-academic-notation`:return t.namedEquationToAcademicNotation.heading;case`academic-notation-to-named-equation`:return t.academicNotationToNamedEquation.heading}}renderSource(e,t){let n=_`<p>${e.context.story}</p>`;switch(e.screen.modeId){case`story-to-quantities`:return n;case`quantities-to-named-equation`:return _`${n}${this.renderQuantityList(e)}`;case`named-equation-to-academic-notation`:return _`${n}${this.renderQuantityList(e)}
          <p class="equation">
            ${g(e.screen.source.relation,e.screen.source.names)}
          </p>
          ${this.renderSymbolKey(e.screen,t.namedEquationToAcademicNotation.symbolKey)}`;case`academic-notation-to-named-equation`:return _`${n}${this.renderQuantityList(e)}
          <academic-notation-display
            .relation=${e.screen.source.relation}
            .symbols=${e.screen.source.symbols}
            .adapter=${this.academicDisplayAdapter}
          ></academic-notation-display>
          ${this.renderSymbolKey(e.screen,t.academicNotationToNamedEquation.symbolKey)}`}}renderQuantityList(e){return _`<ul class="quantity-list">
      ${e.context.quantities.map(e=>_`<li>
          ${e.variableName} =
          ${e.given.kind===`known`?e.given.value:`?`}
        </li>`)}
    </ul>`}renderSymbolKey(e,t){return _`<section class="symbol-key" aria-label=${t}>
      <h3>${t}</h3>
      <dl>
        ${e.symbolKey.map(e=>_`<dt>${e.symbol}</dt><dd>${e.variableName}</dd>`)}
      </dl>
    </section>`}renderInput(e,t){switch(e.screen.modeId){case`story-to-quantities`:return _`<div @puzzle-quantity-selection=${this.handleQuantitySelection}>
          <story-quantities-input
            .screen=${e.screen}
            .knownLegend=${t.storyToQuantities.knownLegend}
            .unknownLegend=${t.storyToQuantities.unknownLegend}
            .checkLabel=${t.controls.check}
          ></story-quantities-input>
        </div>`;case`quantities-to-named-equation`:return this.renderNamedEquationInput(this.locale);case`named-equation-to-academic-notation`:return this.renderTextExpressionInput(e,t.namedEquationToAcademicNotation.inputLabel,t.controls.check);case`academic-notation-to-named-equation`:return this.renderTextExpressionInput(e,t.academicNotationToNamedEquation.inputLabel,t.controls.check)}}renderTextExpressionInput(e,t,n){let r=e.screen.input.kind===`expression`?e.screen.input.value:``,i=e.screen.modeId===`named-equation-to-academic-notation`&&e.feedback?.kind===`accepted`&&e.submission?.kind===`academic-notation`?e.submission.relation:void 0;return _`<div @puzzle-answer=${this.handleAnswer}>
      <named-equation-text-input
        .value=${r}
        .inputLabel=${t}
        .checkLabel=${n}
      ></named-equation-text-input>
      ${i===void 0||e.screen.modeId!==`named-equation-to-academic-notation`?null:_`<academic-notation-display
            .relation=${i}
            .symbols=${e.screen.target.symbols}
            .adapter=${this.academicDisplayAdapter}
          ></academic-notation-display>`}
    </div>`}renderNamedEquationInput(e){if(!j(this.inputMode))return _`<p role="alert">
        Unknown input mode ${JSON.stringify(this.inputMode)}.
      </p>`;let t=this.screen;if(t===void 0||!c(this.themeId))return _``;let n=this.currentProblemFor(),r=v[e],i=A[this.inputMode],a=m(n,C(this.themeId,n,e,t.context.replay?.storySeed??Number(this.seed)));return _`<div @puzzle-answer=${this.handleAnswer}>
      <nav aria-label=${r.controls.inputMode}>
        ${Object.keys(A).map(e=>_`<button
            type="button"
            aria-pressed=${this.inputMode===e}
            @click=${()=>this.selectInputMode(e)}
          >
            ${e===`text`?r.controls.textInput:r.controls.multipleChoice}
          </button>`)}
      </nav>
      ${i.render({definition:{choices:a},screen:{...t,submission:t.submission},resources:r})}
    </div>`}handleAnswer(e){this.submitAnswer(e.detail)}startSessionFromStore(){this.activeSession=this.composeCurrentSession(),this.screen=this.activeSession===void 0?this.composeCurrentScreen():this.activeSession.screen}submitAnswer(e){if(this.activeSession!==void 0){this.activeSession=this.recordSession(this.activeSession.submit(e)),this.screen=this.activeSession?.screen;return}c(this.themeId)&&a(this.modeId)&&i(this.locale)&&(this.screen=b({problem:this.generatedProblem,themeId:this.themeId,modeId:this.modeId,locale:this.locale,storySeed:Number(this.seed),answer:e}))}selectInputMode(e){this.inputMode=e,this.activeSession===void 0&&(this.screen=this.composeCurrentScreen())}currentProblemFor(){return this.activeSession===void 0?this.generatedProblem:this.activeSession.currentProblem??this.generatedProblem}handleQuantitySelection(e){this.submitAnswer(e.detail)}handleLocaleChange(e){if(e.currentTarget instanceof HTMLSelectElement&&i(e.currentTarget.value)){let t=e.currentTarget.value;if(this.locale=t,this.activeSession!==void 0&&this.session!==``){this.requestSessionState({locale:t});return}this.requestApplicationState({locale:t})}}currentFamilyId(){return D(this.family)?this.family:l}currentHiddenRole(){let e=this.currentFamilyId(),t=u[e].hiddenRoles;return this.hiddenRole!==``&&s(this.hiddenRole)&&t.includes(this.hiddenRole)?this.hiddenRole:n}requestSessionState(e){this.dispatchEvent(new CustomEvent(d,{bubbles:!0,composed:!0,detail:{seed:Number(this.session),themeId:c(this.themeId)?this.themeId:`gaming.drone-power`,locale:e.locale}}))}requestApplicationState(e){this.dispatchEvent(new CustomEvent(h,{bubbles:!0,composed:!0,detail:{seed:Number(this.seed),familyId:this.currentFamilyId(),hiddenRole:this.currentHiddenRole(),themeId:c(this.themeId)?this.themeId:`gaming.drone-power`,modeId:a(this.modeId)?this.modeId:`story-to-quantities`,locale:e.locale}}))}renderSession(e){let t=this.locale,n=v[t],r=n.session;if(e.status===`complete`)return _`
        <puzzle-shell
          .heading=${r.completionHeading}
          .sourceLabel=${n.common.source}
          .targetLabel=${n.common.target}
          .feedbackLabel=${n.common.feedback}
          .prompt=${r.completedTotal(e.summary?.total??0)}
          .feedback=${``}
          .replayLabel=${n.common.replay}
          .hasReplay=${!1}
        >
          <div slot="source">
            <p>${r.completedTotal(e.summary?.total??0)}</p>
            <ul class="quantity-list">
              ${o.map(t=>_`<li>
                  ${this.modeLabel(t,n)}:
                  ${e.summary?.counts[t]??0}
                </li>`)}
            </ul>
          </div>
          <div slot="input">
            ${this.renderAnswerLog(e,r,n)}
            <button
              type="button"
              class="session-next"
              @click=${this.handleNavigateHome}
            >
              ${r.backToPuzzle}
            </button>
          </div>
        </puzzle-shell>
      `;let i=e.screen,a=this.headingFor(i.screen,n),s=r.positionLabel(e.position,e.total),c=e.hint,l=S(e),u=c===void 0||l===void 0?``:r.hintText(l),d=i.feedback?.message??``,f=u!==``&&d===``?u:[d,u].filter(e=>e!==``).join(` `);return this.renderShell({locale:t,heading:a,positionLabel:s,prompt:i.screen.target.prompt,feedback:f,replay:i.context.replay,menuSeed:e.replay.seed,menuModeId:i.screen.modeId,source:this.renderSource(i,n),input:_`
        ${this.renderInput(i,n)}
        ${this.renderAnswerLog(e,r,n)}
        ${e.availableNext?_`<button
              type="button"
              class="session-next"
              @click=${this.handleSessionNext}
            >
              ${r.next}
            </button>`:``}
        ${this.supportsHint(e)?_`<button
              type="button"
              class="session-hint"
              @click=${this.handleSessionHint}
            >
              ${r.hint}
            </button>`:``}
      `})}renderAnswerLog(e,t,n){return e.answerLog.length===0?``:_`
      <section class="answer-log" aria-label=${t.answerLogHeading}>
        <h3>${t.answerLogHeading}</h3>
        <ol class="answer-log-list">
          ${e.answerLog.map((e,r)=>_`<li>
              ${r+1}.
              ${this.modeLabel(e.modeId,n)}:
              ${this.describeSubmission(e.submission)}
              (${e.accepted?t.answerLogCorrect:t.answerLogIncorrect})
            </li>`)}
        </ol>
      </section>
    `}describeSubmission(e){switch(e.kind){case`quantity-selection`:return`known=[${e.knownIds.join(`, `)}] unknown=${e.unknownId??`none`}`;case`named-equation`:case`academic-notation`:return e.input}}handleNavigateHome(){this.dispatchEvent(new CustomEvent(E,{bubbles:!0,composed:!0,detail:{}}))}supportsHint(t){if(t.status!==`active`)return!1;let n=t.currentProblem,r=t.plan.items[t.currentIndex];return n===void 0||r===void 0?!1:e({modeId:r.modeId,guidance:n.guidance??[]})!==void 0}modeLabel(e,t){switch(e){case`story-to-quantities`:return t.storyToQuantities.heading;case`quantities-to-named-equation`:return t.quantitiesToNamedEquation.heading;case`named-equation-to-academic-notation`:return t.namedEquationToAcademicNotation.heading;case`academic-notation-to-named-equation`:return t.academicNotationToNamedEquation.heading}}handleSessionNext(){this.activeSession!==void 0&&(this.activeSession=this.recordSession(this.activeSession.next()),this.screen=this.activeSession?.screen)}handleSessionHint(){this.activeSession!==void 0&&(this.activeSession=this.recordSession(this.activeSession.requestHint()))}renderShell({locale:e,heading:t,positionLabel:n,prompt:r,source:i,input:a,feedback:o,replay:s,menuSeed:c,menuModeId:l}){let u=v[e],d=x[e]??x.en;return _`
      <puzzle-shell
        .heading=${n===void 0?t:`${t} — ${n}`}
        .sourceLabel=${u.common.source}
        .targetLabel=${u.common.target}
        .feedbackLabel=${u.common.feedback}
        .prompt=${r}
        .feedback=${o}
        .replayLabel=${u.common.replay}
        .hasReplay=${s!==void 0}
      >
        <div slot="menu" class="shell-menu">
          <button type="button" @click=${this.handleNavigateHome}>
            ${d.menu.homeLabel}
          </button>
        </div>
        <label slot="language" class="language-control">
          ${u.language.label}
          <select .value=${e} @change=${this.handleLocaleChange}>
            <option value="en">${u.language.en}</option>
            <option value="nb">${u.language.nb}</option>
          </select>
        </label>
        <puzzle-menu
          slot="settings"
          .seed=${c}
          .familyId=${this.currentFamilyId()}
          .themeId=${this.themeId}
          .modeId=${l}
          .locale=${e}
          .menuLabel=${u.puzzleMenu.label}
          .hiddenRole=${this.currentHiddenRole()}
          .familyLabel=${u.puzzleMenu.family}
          .hiddenRoleLabel=${u.puzzleMenu.hiddenRole}
          .perItemUnknownLabel=${u.puzzleMenu.perItemUnknown}
          .baseUnknownLabel=${u.puzzleMenu.baseUnknown}
          .countUnknownLabel=${u.puzzleMenu.countUnknown}
          .totalUnknownLabel=${u.puzzleMenu.totalUnknown}
          .totalFromPartsLabel=${u.puzzleMenu.totalFromParts}
          .groupsTotalLabel=${u.puzzleMenu.groupsTotal}
          .scenarioLabel=${u.puzzleMenu.scenario}
          .dronePowerLabel=${u.puzzleMenu.dronePower}
          .creatorFollowersLabel=${u.puzzleMenu.creatorFollowers}
          .taskLabel=${u.puzzleMenu.task}
          .storyToQuantitiesLabel=${u.puzzleMenu.storyToQuantities}
          .quantitiesToNamedEquationLabel=${u.puzzleMenu.quantitiesToNamedEquation}
          .namedEquationToAcademicNotationLabel=${u.puzzleMenu.namedEquationToAcademicNotation}
          .academicNotationToNamedEquationLabel=${u.puzzleMenu.academicNotationToNamedEquation}
          .seedLabel=${u.puzzleMenu.seed}
          .showLabel=${u.puzzleMenu.show}
          .startSessionLabel=${u.puzzleMenu.startSession}
        ></puzzle-menu>
        <div slot="source">${i}</div>
        <div slot="input">${a}</div>
        ${s===void 0?null:_`<dl slot="replay" class="replay-list">
              <dt>${u.common.seed}</dt>
              <dd>${s.seed}</dd>
              <dt>${u.common.generatorVersion}</dt>
              <dd>${s.generatorVersion}</dd>
              <dt>${u.common.scenario}</dt>
              <dd>${s.themeId}</dd>
              <dt>${u.common.storySeed}</dt>
              <dd>${s.storySeed}</dd>
            </dl>`}
      </puzzle-shell>
    `}};function R(e,n,r){return t(e,{seed:Number.isSafeInteger(r)?r:17,hiddenRole:n}).problem}customElements.get(`math-modeling-puzzle`)===void 0&&customElements.define(`math-modeling-puzzle`,L);export{L as MathModelingPuzzle};