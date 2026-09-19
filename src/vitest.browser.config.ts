import { defineConfig } from 'vitest/config';

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
      headless: true,
      instances: [{ browser: 'chromium' }],
      provider: playwright(),
    },
    fileParallelism: false,
    include: ['features/**/*.browser.test.ts'],
  },
});
