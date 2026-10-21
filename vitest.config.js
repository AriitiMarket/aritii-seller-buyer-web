import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    // The suite renders heavy pages (catalog, delivery, portal modal) in
    // parallel workers. The default 5s budget is too tight on a loaded
    // machine and produced flaky "test timed out" failures for tests that
    // pass in isolation.
    testTimeout: 20000,
    hookTimeout: 20000,
  },
});
