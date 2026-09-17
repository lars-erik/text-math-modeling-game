import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const action = process.argv[2];
const packageRoot = fileURLToPath(new URL('../', import.meta.url));
const environment = {
  ...process.env,
  PLAYWRIGHT_BROWSERS_PATH: '0',
};

const commands = {
  install: {
    args: ['install', 'chromium'],
    entry: new URL('../node_modules/playwright/cli.js', import.meta.url),
  },
  test: {
    args: ['run', '--config', 'vitest.browser.config.ts'],
    entry: new URL('../node_modules/vitest/vitest.mjs', import.meta.url),
  },
};

const command = commands[action];

if (command === undefined) {
  console.error('Usage: node tools/browser.mjs <install|test>');
  process.exitCode = 2;
} else {
  const result = spawnSync(
    process.execPath,
    [fileURLToPath(command.entry), ...command.args],
    {
      cwd: packageRoot,
      env: environment,
      stdio: 'inherit',
    },
  );

  if (result.error !== undefined) {
    throw result.error;
  }

  process.exitCode = result.status ?? 1;
}
