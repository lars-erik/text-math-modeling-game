import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    fileParallelism: false,
    include: [
      'features/**/*.unit.test.ts',
      'features/**/*.approval.test.ts',
      'testing/**/*.test.ts',
    ],
  },
});
