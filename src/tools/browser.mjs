import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const action = process.argv[2];
const extraArgs = process.argv.slice(3);
const packageRoot = fileURLToPath(new URL('../', import.meta.url));

const commands = {
  install: {
    args: ['install', 'chromium'],
    entry: new URL('../node_modules/playwright/cli.js', import.meta.url),
  },
  'install-ci': {
    args: ['install', '--with-deps', 'chromium'],
    entry: new URL('../node_modules/playwright/cli.js', import.meta.url),
  },
  test: {
    args: ['run', '--config', 'vitest.browser.config.ts', ...extraArgs],
    entry: new URL('../node_modules/vitest/vitest.mjs', import.meta.url),
  },
};

if (action === 'doctor') {
  const { chromium } = await import('playwright');
  const { version } = JSON.parse(readFileSync(new URL('../node_modules/playwright/package.json', import.meta.url), 'utf8'));
  const executable = chromium.executablePath();
  console.log(`Platform: ${process.platform} (${process.arch})`);
  console.log(`Playwright: ${version}`);
  console.log(`PLAYWRIGHT_BROWSERS_PATH: ${process.env.PLAYWRIGHT_BROWSERS_PATH ?? '(default user cache)'}`);
  console.log(`Chromium executable: ${executable}`);

  if (!existsSync(executable)) {
    console.error('Chromium binary is missing. Run: npm run browser:install');
    process.exitCode = 1;
  } else {
    try {
      const browser = await chromium.launch({ headless: true });
      await browser.close();
      console.log('Chromium headless launch: OK');
    } catch (error) {
      console.error('Chromium headless launch failed:', error);
      console.error('Check that the same PLAYWRIGHT_BROWSERS_PATH is used for installation and testing.');
      console.error('Reinstall the pinned browser with: npm run browser:install');
      if (process.platform === 'linux') {
        console.error('For missing Linux shared libraries, run: npm run browser:install:ci (requires OS package-install privileges).');
      }
      process.exitCode = 1;
    }
  }
} else {
  const command = commands[action];

  if (command === undefined) {
    console.error('Usage: node tools/browser.mjs <install|install-ci|doctor|test>');
    process.exitCode = 2;
  } else {
    const result = spawnSync(
      process.execPath,
      [fileURLToPath(command.entry), ...command.args],
      {
        cwd: packageRoot,
        stdio: 'inherit',
      },
    );

    if (result.error !== undefined) {
      throw result.error;
    }

    process.exitCode = result.status ?? 1;
  }
}
