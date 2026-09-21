# Browser-test environment

The browser suite uses the project's pinned Playwright dependency and headless Chromium. Run commands from `src/` after `npm ci`.

| Environment | Install | Verify / run |
| --- | --- | --- |
| Windows or macOS | `npm run browser:install` | `npm run browser:doctor` then `npm run test:browser` |
| Linux with package-install privileges (including CI) | `npm run browser:install:ci` | `npm run browser:doctor` then `npm run test:browser` |
| Linux with browser system dependencies already provided | `npm run browser:install` | `npm run browser:doctor` then `npm run test:browser` |

Browser binaries live in Playwright's normal OS/user cache, **not** under `node_modules`. Its pinned version chooses the required browser revision. Multiple checkouts under the same account can reuse a compatible cached browser; after a Playwright upgrade, rerun the installation command. The project does not override `PLAYWRIGHT_BROWSERS_PATH`; if you set it externally, use the same value for installation and tests (unset stale overrides when diagnosing missing executables).

`browser:doctor` checks the expected executable and attempts one headless launch, without installing or changing the machine. If the executable is missing, run `npm run browser:install`; if Linux launch reports missing shared libraries (e.g. `libglib-2.0.so.0`), run `npm run browser:install:ci` in a supported environment **with appropriate OS package permissions**. If the agent cannot install system dependencies, stop retrying arbitrary packages, report the exact error and environment limitation, and use CI's browser-test results instead. `DEBUG=pw:browser npm run test:browser` can help diagnose launch failures on Linux.

CI deliberately runs the same dependency-aware installation before browser tests. Keep screenshot baseline review separate from browser-installation problems: the committed visual baselines are Linux-specific. Do not disable browser tests to mask setup failures.
