import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

process.env.PLAYWRIGHT_BROWSERS_PATH ??= '0';

const { playwright } = await import('@vitest/browser-playwright');
const screenshotDirectory = fileURLToPath(
  new URL('./screenshots', import.meta.url),
);

export default defineConfig({
  optimizeDeps: {
    include: ['lit'],
  },
  test: {
    attachmentsDir: 'test-results/browser/attachments',
    browser: {
      enabled: true,
      expect: {
        toMatchScreenshot: {
          screenshotDirectory,
        },
      },
      headless: true,
      instances: [{ browser: 'chromium' }],
      provider: playwright(),
    },
    fileParallelism: false,
    include: ['features/**/*.browser.test.ts'],
  },
});
