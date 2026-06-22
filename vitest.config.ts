import { defineConfig } from 'vitest/config';

// Single root config covering every package. Tests live in each package's
// `test/` dir (sibling of `src/`), outside the published `dist/`. Unit tests
// import package source via `../src/...` relative paths (no build needed); the
// engine integration test imports the built `@openpipeline/*` packages (run
// `pnpm build` first — CI does), so it exercises the real published artifacts.
export default defineConfig({
  test: {
    include: ['packages/**/test/**/*.test.ts'],
    environment: 'node',
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      reporter: ['text', 'html'],
      include: ['packages/*/src/**/*.ts'],
      exclude: ['packages/*/src/generated/**'],
    },
  },
});
