# Session persistence (M10.6)

**Status:** implemented for the current graybox session scope.

This document describes how in-progress and completed session runs persist in browser-local storage, how they restore, and which guarantees the persistence layer gives. It implements Milestone 10.6 (issue #35) ahead of the broader Phase 2 practice history (M19).

## Persistence boundary

```text
Application / session lifecycle (application.ts)
        |
SessionRunStore (features/session/session-run-store.ts)
      /       \
UserProfileRepository   SessionHistoryRepository
      \       /
LocalStorage adapter (features/session/persistence/local-storage-session-repository.ts)
```

- `GrayboxSession` and `planSession` remain the authoritative session behavior. Persistence only snapshots and restores them.
- The **persisted application/user state is a profile, not a session repository**. `UserProfileRepository` is the top-level persistence port; `UserProfile` deliberately has exactly one field, `activeSession`, giving a natural place for later user-local state without session-specific hard couplings.
- `SessionHistoryRepository` is a separate concern: completed runs, with list/save/remove operations. Keeping the active run in the profile and finished runs in history keeps "completed sessions must not resume as active" structural.
- Both ports are storage-agnostic. The in-memory adapter backs unit tests; the LocalStorage adapter backs the browser and implements both ports while sharing namespacing/version helpers. The domain/session layer never learns about LocalStorage. A later IndexedDB adapter can implement the same ports without touching session logic.
- The router (`hash-route.ts`, `app-controller.ts`) never learns about persistence, run identifiers or seed semantics. It remains a generic route → destination mechanism.
- Lit leaf components never touch the repositories. `MathModelingPuzzle` receives the `SessionRunStore` from the application and records session transitions through it. Home receives a small navigation-owned view model (`HomeSessionRunsView`), not persistence DTOs; it does not know which repository produced the data.
- Canonical mathematics, problem generation and private `AnswerKey` data are never persisted.

## Snapshot contract

A `SessionSnapshot` is a small, explicitly typed, JSON-serializable DTO:

- `schemaVersion` — snapshot shape version; currently `1`.
- `plannerVersion` — the `sessionPlannerVersion` that planned the run; currently `session-plan-v1`.
- `runId` — opaque, stable identifier for one concrete run (see below).
- replay inputs: `seed`, `themeId`, `locale`.
- `status` — `active` or `complete`.
- `currentIndex`, `currentCompleted` — the learner's position and acceptance state.
- `hintGuidanceId` — active hint, when one was requested.
- `answerLog` — latest submission per item, preserving the existing latest-answer-per-item semantics.
- `updatedAt` — last transition time, used for history ordering.

A snapshot never contains functions, rendered screens, composed `PuzzleScreen` state, generated `Problem` objects, relations or any private answer data. Generated problems are reconstructed from the deterministic replay inputs (seed + planner), not serialized.

## Versioning

Compatibility concerns are kept separate:

- `SessionSnapshot` carries its own `schemaVersion` and `plannerVersion`. Changing the plan algorithm invalidates persisted runs even when the JSON shape is unchanged.
- The stored profile record has its own profile-shape `schemaVersion`, independent of session snapshot compatibility; the two versions do not need to move in lockstep. Loading **compares against the expected profile schema version**: a profile from a different version is discarded along with its embedded snapshot, even when the snapshot itself is compatible, without touching unrelated keys.

On mismatch, only this application's namespaced records (`math-modeling-game:session:*`) are discarded; unrelated keys and other applications' data are never touched. `localStorage.clear()` is never used. Corrupted individual records (malformed JSON, wrong shape) are removed or ignored without crashing Home or destroying other valid records. An ordinary deployment that does not change persistence compatibility does not wipe progress; there is no app-version check at all. Pre-alpha policy: incompatible data is intentionally disposable and automatically discarded; there is no migration machinery, and the policy will be revisited before public alpha.

## Reconstruction

`restoreSessionRun(snapshot)` lives in the session layer (`graybox-session.ts`):

1. It rejects snapshots whose `schemaVersion` or `plannerVersion` do not match the current code (`incompatible` result, never a throw).
2. It replans from the seed and regenerates each item's problem deterministically.
3. It re-submits the persisted latest answer for each logged item **through the real Mode checkers**, so the restored submission, feedback kind and acceptance state are genuine — not fabricated or advanced by the reconstruction itself.
4. It restores the current screen at the persisted position: an unsubmitted item recomposes fresh; a submitted item replays its latest submission to restore the learner's input and feedback.
5. It restores hint state and next-availability without advancing the session.

Validation happens before any restoration: malformed item indices, mode mismatches or unknown submissions make the whole snapshot `incompatible` rather than restoring a broken run.

Acceptance is **recalculated, not trusted**: each persisted submission is re-submitted through its Mode checker and the resulting genuine acceptance replaces the persisted boolean, so a structurally valid snapshot cannot claim acceptance or completion it did not earn. The current item's next-availability is derived from the current item's genuine acceptance, and a `complete` snapshot whose log is not genuinely complete (every item present and accepted) is rejected as incompatible. Active snapshots additionally require **genuine progression**: every item before `currentIndex` must have a latest accepted submission, and log entries for items beyond the current position are rejected, so a snapshot cannot restore ahead of the learner's real progress. Legitimate latest-answer-per-item and non-advancing restore semantics are unchanged.

## Run identity: replay versus resume

These are different operations with different identities:

- **Starting a session from a deterministic seed creates a new run** with a fresh opaque `runId` (`run-<uuid>`).
- **Resuming** (Home → Continue, or a refresh of the active tab) loads the existing run.
- **A replay link** (the same `#session?seed=...` URL opened without a remembered run) starts a new run; it never silently attaches a previous run that merely shares the seed.
- Two concurrent runs with the same seed keep distinct `runId` values, so they cannot overwrite or resume one another by accident.

The `runId` is remembered per browser tab in `sessionStorage` (`math-modeling-game:session:current-run-id`). This is what makes "refresh the active tab" resume while "paste the replay link in a new tab" starts fresh. The URL itself stays on the canonical M10.5 contract: `#session?seed=...&scenario=...&language=...` with no run identifier in the hash. The run id contains no private answer data.

A remembered run is only reused for replay when **all replay inputs that define the run's identity** match the route: seed and scenario/theme. Locale is intentionally mutable (the learner may switch language without losing the run); a route with the same seed but a different theme starts a new run and never receives the old run's theme.

The single-active-run policy is deliberate for the MVP: starting a new session replaces the previously saved active run, which is covered by tests. A completed in-memory run is never reused by `provide()`: an explicit Start after completion begins a fresh run in the same mounted app. Start is a **lifecycle command** — the application starts a new run in the store and explicitly refreshes the session view rather than inferring a restart from attribute changes (which Lit may deduplicate when the attributes are identical).

## Save points

The store records meaningful transitions only: session start, each submit (which replaces the item's latest answer), hint requests, item progression, locale changes and completion. Completing a run moves it from the active slot to completed history and it is never offered as an active resume again. The history write happens **before** the active profile is cleared, so a failed completion write (quota, blocked storage) leaves the prior active snapshot intact — the learner loses neither the active run nor the completed record. Only the record whose state actually changed is re-stamped: saving a new completed run never rewrites the completion timestamps of earlier history entries, so history ordering stays correct.

## Resilience

Disabled storage, quota failures and storage exceptions never prevent in-memory play. All repository reads and writes are wrapped so that failures degrade to "no persisted runs" while the current session continues in memory. Storage handles are acquired through guarded accessors, so even a `SecurityError` thrown when *reading* `localStorage`/`sessionStorage` (blocked cookies, sandboxed frames) leaves application startup intact. The game never throws to the learner because persistence failed.

## Home integration

Home shows **Continue session** only when an active run is remembered, and a modest **Completed sessions** list seeded from persisted history. Completed runs never appear as active resumes. The selected language is preserved through Home and resume flows. Home remains minimal; no history management UI exists yet.

## Local-only retention

All data is browser-local. There are no accounts, no cloud synchronization and no cross-device continuity. Clearing site data clears all progress. The `UserProfileRepository` and `SessionHistoryRepository` ports are the seam for a later IndexedDB adapter (M19) when history grows beyond a few small records.
