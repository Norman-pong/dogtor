import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',

    globals: true,

    include: ['src/**/*.test.ts', 'src/**/__tests__/**/*.test.ts'],

    exclude: ['**/node_modules/**', '**/dist/**'],

    // Make snapshots and logs stable across platforms

    snapshotFormat: {
      printBasicPrototype: true
    }
  }
});
