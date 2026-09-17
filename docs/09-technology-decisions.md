# Technology decisions and alternatives

**Decision status:** initial hypothesis, to be validated through the first compatibility spike. Record changes here with the observed reason.

## Front-end framework

The semantic engine, scenario rendering, use-case printers, and puzzle state transitions are ordinary TypeScript modules. The UI framework adapts a screen model to accessible browser controls. This boundary makes framework choice reversible.

| Option | Fit for this prototype | Trade-off for testing/agent work |
| --- | --- | --- |
| **Lit** (initial choice) | Compact custom elements, standard DOM, easy later embedding in other sites and web-component hosts. Suits a few bespoke math controls. | Shadow DOM requires deliberate browser testing and explicit `shadowRoot` queries. Wait for `updateComplete` after updates; nested asynchronous children need additional readiness checks. AI agents can implement it well when given element contracts and acceptance tests, but code generation quality cannot be guaranteed by framework choice. |
| **Svelte** | Concise declarative reactivity and low ceremony for complex interactive screens. | Excellent Svelte Testing Library + Vitest path; output is compiled components rather than stand-alone custom elements by default. A sensible swap if the Lit spike creates disproportionate ceremony. |
| **Vue** | Familiar template-driven UI, mature component APIs and dedicated official Vue Test Utils. | Very good Vitest testing; more framework-specific component structure. Sensible if the project develops many conventional app screens. |
| **React** | Very broad library, tooling, and example ecosystem. | Components and DOM tests are well supported, but React adds little unique value to the first puzzle and isn't required by the engine. |

**Selection criterion:** implement one quantity-to-expression component plus keyboard interaction, one semantic DOM approval, and one browser interaction test in Lit. Keep it if that slice is small and clear. The same core can be wrapped in Svelte or Vue if an observed drawback warrants changing.

Framework choice alone does not establish that Codex or another agent will produce a better interface. Short, concrete interaction contracts, screen-model printers, accessibility requirements, and repeatable tests are the controllable factors.

### HTML and ApprovalTests

The strongest approvals target *stable semantic output*, such as a use-case transcript, debug printer, or normalized accessible HTML fragment. These are independent of HTML framework and CSS. Reserve full DOM approvals for a small set of relevant structures. Lit components usually render in shadow DOM, so retrieve a selected element's `shadowRoot`/rendered subtree and normalize it before approval; a snapshot of only the custom-element host misses its content. Assert behavior through labels, roles, user input, and feedback as well.

## Build tooling and runtime

**Vite** supplies the web development server, hot-module replacement, and production bundling. **Bun** supplies a JavaScript runtime, package manager, test runner, and bundler; these are different tool categories and can be combined. Bun's own documentation describes running Vite with Bun.

For the initial slice, use **Node + npm + Vite + Vitest** to reduce simultaneous unknowns around ESM/CommonJS ApprovalTests interoperability and browser-mode test execution. Record lockfile and runtime version. Once the baseline works, a separate measured change can adopt `bun install` / `bun run` while retaining Vite and Vitest, or evaluate Bun's native bundling/test runner against the exact approval and browser requirements.

## DSL, AST, and mathematical notation

- **Ohm/JS:** initial small DSL and learner-expression parser; map parse results through semantic operations into handwritten discriminated TypeScript unions. Parser parse trees are adapter-local.
- **Langium:** revisit when authoring needs LSP, cross-references, generated language tooling, or substantial editor integration.
- **KaTeX:** read-only display of LaTeX emitted by an AST printer.
- **MathLive:** later rich academic input when keyboard/structured entry requires it.
- **Compute Engine:** later symbolic checks, behind a checking interface; preserve structural/pedagogical distinctions in our own domain.
- **fast-check:** property tests for reproducible generator invariants and DSL round-trips.
- **Approvals.NodeJS** (`approvals` npm package): initial file-based approval tool. Prove ESM/Vitest compatibility and reporter configuration in a spike; isolate the package in a thin approval adapter so a compatible alternative can be substituted if needed.

### Approval tooling spike result

On 17 September 2026, `approvals@7.3.0` was verified through its direct CommonJS API, loaded behind an ESM adapter with `createRequire`, using Node 24.12.0, npm 11.6.2, TypeScript 7.0.2, and Vitest 5.0.1. The missing-baseline, accepted-baseline, and deliberately changed-output paths all ran under Vitest.

The package's built-in `nodediff` reporter failed with its installed `diff` dependency and created an empty approved file while reporting a missing baseline. The adapter therefore uses a small read-only console reporter that prints deterministic line changes and never writes approved files. Received output remains package-generated; human review remains the only path to an approved baseline.

## Official / project references

- Lit testing: https://lit.dev/docs/tools/testing/
- Lit update lifecycle: https://lit.dev/docs/components/lifecycle/
- Open Web Components semantic DOM: https://open-wc.org/docs/testing/semantic-dom-diff/
- Svelte Testing Library: https://testing-library.com/docs/svelte-testing-library/setup/
- Vue Test Utils: https://test-utils.vuejs.org/guide/
- Vitest browser mode: https://vitest.dev/guide/browser/
- Vitest Playwright provider: https://vitest.dev/config/browser/playwright
- ApprovalTests for Node: https://github.com/approvals/Approvals.NodeJS
- Vite: https://vite.dev/guide/
- Bun + Vite: https://bun.com/guides/ecosystem/vite
- Ohm: https://ohmjs.org/
- Langium: https://langium.org/
- KaTeX: https://katex.org/
- MathLive: https://mathlive.io/
