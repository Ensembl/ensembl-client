# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Overview

`ensembl-client` is the new frontend for the Ensembl genomics website (https://beta.ensembl.org). It is a server-side-rendered React 19 + Redux Toolkit application written in TypeScript, bundled with webpack, and served by an Express server. It is a single codebase hosting several embedded React "apps" (Genome Browser, Species Selector, Entity Viewer, BLAST, VEP, etc.), each backed by one or more separate backend services reached through a proxy.

## Commands

- `npm start` — dev server (webpack dev middleware + Express) on port **8081** (hardcoded in `scripts/start.ts`). Runs `npm install --no-save` first via `prestart`.
- `npm run build` — production build to `./dist` (client + server bundles).
- `npm run check-types` — `tsc` type-check only (no emit). Run this to validate types; the build does not type-check.
- `npm run lint` — runs both `lint:scripts` (ESLint on `src/**/*.{ts,tsx}`) and `lint:styles` (stylelint on `src/**/*.css`).
- `npm run storybook` — Storybook dev server on port 9001.
- `npm run prod:analyse` — production build with `webpack-bundle-analyzer`.

### Tests (Vitest)

There are **two test environments** (see `doc/testing.md`):
- **Node tests** — files named `*.test.ts(x)`. Run with `npm run test-node` (watch: `npm run test-node:watch`). Config: `vitest.config.mts`.
- **Browser tests** — UI component tests that need a real browser (Playwright), files named `*.browser.test.ts(x)`. Run with `npm run test-browser` (watch: `npm run test-browser:watch`). Config: `vitest.config.browser.mts`.
- `npm test` runs both. The naming suffix is what routes a test to the right runner — name UI/component tests `.browser.test.tsx`, pure-logic tests `.test.ts`.

Run a single test file, e.g.: `npm run test-node -- src/shared/utils/foo.test.ts` or `npx vitest run --config ./vitest.config.browser.mts <path>`. Use `-t '<name>'` to filter by test name.

Vitest globals are enabled (`describe`/`it`/`expect` need no import). API mocking uses `msw`; IndexedDB is mocked with `fake-indexeddb` in Node tests.

## Architecture

### Server-side rendering flow
1. Express app (`src/server/server.ts`) wires up proxy, redirect, SEO, and static middleware, then routes all unmatched GETs to `viewsRouter`.
2. `src/server/routes/viewsRouter.tsx` matches the request path against `src/routes/routesConfig.tsx`, calls that route's optional `serverFetch` to pre-populate a fresh server-side Redux store, then `renderToPipeableStream`s `<Root />` with a `StaticRouter`.
3. The store state is serialized into `__PRELOADED_STATE__` on `window`; config is serialized onto a window field (`CONFIG_FIELD_ON_WINDOW`).
4. On the client, `src/index.tsx` reads `__PRELOADED_STATE__`, builds the store (`src/store.ts`), and `hydrateRoot`s the same `<Html><Root/></Html>` tree inside `IndexedDBProvider` → Redux `Provider` → `BrowserRouter`.

When adding a page: add an entry to `routesConfig.tsx` (`path`, `element`, optional `serverFetch`). Pages that need SSR data export a `serverFetch` alongside the default component export.

### Routing
`src/routes/routesConfig.tsx` is the single source of truth for top-level routes, used by both the server (`matchPath`) and client. Most app routes are wildcards (e.g. `/entity-viewer/*`) with nested routing handled inside each app.

### State (Redux)
- Store is configured in `src/store.ts`. `RootState`, `AppDispatch`, and the typed hooks `useAppSelector` / `useAppDispatch`, plus `createAppAsyncThunk`, are all exported from there — import these rather than the untyped react-redux hooks.
- `src/root/rootReducer.ts` combines per-app reducers (each app owns a reducer under `.../state/`) plus the two RTK Query API slices.
- Middleware stack: `redux-observable` epics (`src/root/rootEpic.ts`), RTK Query middleware, and a `listenerMiddleware` (`src/listenerMiddleware.ts`). RxJS + `redux-observable` is used for complex async flows.
- Data fetching goes through RTK Query slices in `src/shared/state/api-slices/`: `graphqlApiSlice` (GraphQL via `graphql-request`) and `restSlice` (REST). Feature-specific endpoints are injected into these slices from within each app's `state/api` directory rather than defined centrally.

### Code organization
- `src/content/app/<app-name>/` — each embedded app. Common internal layout: top-level `*.tsx` page/entry components, `components/`, `state/` (reducer + slices + injected API endpoints), `services/`, `hooks/`, and view subfolders (e.g. `gene-view/`, `transcript-view/`).
- `src/shared/` — cross-app code: `components/`, `hooks/`, `state/`, `types/`, `utils/`, `helpers/`, `contexts/`, `services/`, `workers/`.
- `src/services/` — app-wide singleton services (analytics, storage, IndexedDB, API, error reporting, window).
- `src/header/`, `src/global/`, `src/content/home/` — site chrome and home page.
- `src/server/` — Express server, SSR, middleware, server-side Redux store.
- The genome browser itself is a Rust/WASM/WebGL component delivered via the `@ensembl/ensembl-genome-browser` package; this repo integrates and communicates with it (see `communicationSlice` and the genome-browser app).

### Configuration
`config.ts` (importable as `config`) resolves backend API base URLs and public keys. URLs differ between client and server: the client reads them from the injected window config (defaulting to same-origin `/api/...` paths proxied by the Express server), while SSR reads them from `SSR_*` env vars. When adding a new backend dependency, add its URL to `BaseApiUrls`/`defaultApiUrls` and the SSR resolution in `config.ts`.

## Conventions

- **Path aliases** (see `tsconfig.json`): import with `src/*`, `static/*`, `stories/*`, `tests/*`, `config`, `webpackDir/*` — not long relative paths.
- **License header**: every source file begins with the Apache 2.0 license header block (see any existing file / the `licence-manager` dev dependency). Copy it into new files.
- **Styles**: CSS Modules (`*.module.css`) co-located with components; global styles and CSS layer ordering are set up in `src/styles` and imported first in `src/index.tsx` (order matters — don't reorder that import).
- TypeScript is `strict`. There is no emit from `tsc`; webpack/babel handle transpilation, so type errors only surface via `npm run check-types`, ESLint, or `fork-ts-checker` during the build.
- Pre-commit hooks (husky + lint-staged) run ESLint/stylelint/prettier on staged files.
- **Local package development**: to test an unpublished dependency locally, use `npm install <path-to-build-dir> --install-links`. Without `--install-links`, npm symlinks the directory, which breaks module resolution for packages with peer dependencies.
