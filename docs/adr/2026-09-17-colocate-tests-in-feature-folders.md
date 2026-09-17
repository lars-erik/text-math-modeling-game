# Colocate tests and approvals in feature folders

## Status

Accepted

## Context and problem statement

Separating production modules into `domain/` and `ui/` while placing every test and approved artifact under a distant `tests/` tree scatters one feature across several technical folders. The initial relation printer, its approval test, its fixture, and its approved output already required navigation between four directories.

The project may add other technology packages later, so the existing outer `src/` package boundary remains useful. The package still needs a layout that can grow by product capability rather than by implementation technology.

## Decision drivers

- A feature's behavior, tests, fixtures, and reviewed outputs should be discoverable together.
- Test-only modules and approved text files must remain outside production builds.
- Test runner selection must be unambiguous for Node, browser, and approval tests.
- Cross-feature test infrastructure should have one explicit home.

## Considered options

1. Keep separate `domain/`, `ui/`, and `tests/` trees.
2. Place production code under feature folders while retaining a central test tree.
3. Colocate production modules, tests, fixtures, and approvals under feature folders, with only shared test infrastructure in `testing/`.

## Decision outcome

Use option 3. Product implementation lives under `features/<feature-name>/`. Tests and fixtures use explicit filename suffixes and remain beside the modules they exercise. Approval helpers derive the artifact directory from the calling test's module URL, so approved and received files are colocated with the approval test.

Node tests use `*.unit.test.ts` and `*.approval.test.ts`; browser tests use `*.browser.test.ts`; test fixtures use `*.fixture.ts`. Cross-feature test infrastructure lives under `testing/`.

`tsconfig.build.json` excludes test and fixture suffixes plus `testing/`. Vite includes only modules reachable from the production entry point.

## Consequences

- The current semantic model remains one `problem-model` feature and can split into smaller features when behavior provides a useful boundary.
- Feature changes can be reviewed without switching between technical source and test trees.
- Test runner configuration depends on the agreed suffix conventions.
- Shared test helpers stay separate from product features and cannot be imported by the production TypeScript build.
