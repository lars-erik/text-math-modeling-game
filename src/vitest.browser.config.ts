import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';

process.env.PLAYWRIGHT_BROWSERS_PATH ??= '0';

const { playwright } = await import('@vitest/browser-playwright');

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
          resolveScreenshotPath: ({
            arg,
            browserName,
            ext,
            platform,
            root,
            testFileDirectory,
            testFileName,
          }) =>
            resolve(
              root,
              'screenshots',
              testFileDirectory,
              testFileName,
              `${arg}-${browserName}-${platform}${ext}`,
            ),
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
