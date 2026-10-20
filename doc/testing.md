# Notes on testing

We use `vitest` as test runner. We migrated from `jest` to `vitest`, because `jest` had poor support for ES modules, and that caused ever-growing problems as more and more of our dependencies started releasing ESM-only versions.

Our tests were initially written to be run in `jsdom` using `react-testing-library`. However, `vitest` has long been working on adding a browser mode for running UI tests in a real browser rather than in a simulated browser environment such as `jsdom`. With the release of `vitest` version 4.0 (October 2025), the browser mode has become stable.

Using the real browser to test UI components has the benefit of running tests in an environment that the components were built for, rather than in a simulated environment where they will never run for real. Simulated environments, such as `jsdom`, do not implement the full DOM api, and lack other browser apis (`indexedDB`, etc.).

With the adoption of `vitest` browser mode, we can think of our tests as two groups: the ones that need a browser to run (e.g. tests of UI components), and the ones that can run in Node (e.g. tests of helper functions). Because these two groups of tests will need different `vitest` configurations, the following file naming convention will be used to separate the two:

- For tests that should run in the browser, end file names in `.browser.test.ts(x)`. For example, `AutosuggestSearchField.browser.test.tsx`
- For tests that do not need browser environment to run, end file names in just `.test.ts`.

The existing date formatter tests assume UTC. When running the full Node suite
outside UTC, use `TZ=UTC npm run test-node`.

## References

- [Documentation of Vitest browser mode](https://vitest.dev/guide/browser/)
- [Playwright documentation](https://playwright.dev/docs/best-practices), including best practices of UI testing
- [Github repository for workshop React Component Testing with Vitest](https://github.com/epicweb-dev/react-component-testing-with-vitest) — contains code examples of common testing patterns, as well as a detailed commentary in markdown explaining those examples

## Transcriptomic tracks

The transcriptomic tests are split by responsibility:

- `helpers/transcriptomic.test.ts` covers metadata filter rules, API hierarchy
  order, grouping, and resolving selections to unique track UUIDs.
- `state/transcriptomic/transcriptomicSlice.test.ts` covers applying/removing
  membership, visibility settings, per-genome persistence, and rejected saves.
  It mocks the track-settings storage boundary; IndexedDB serialization is
  already covered by the storage service's tests.
- `ConfigurationForm.browser.test.tsx` covers draft selection, mixed checkboxes,
  collapsing groups, filtered counts, clearing selections, and Apply readiness.
  It renders the loaded form without network requests or the browser shell.
- `TranscriptomicConfiguration.browser.test.tsx` keeps a few integration checks
  using real reducers, RTK Query, and browser storage. MSW replaces Track API and
  a mock replaces the WASM interface. These tests check cached catalogue reuse,
  UUID switch-on/off calls, reload/genome isolation, and configuration retry.

The shared data in `tests/fixtures/transcriptomic.ts` is deliberately synthetic:
four runs, three samples, and two tissues. The runs exercise shared samples and
filter values; three/four-value filters cover the collapse threshold. Counts
match this small catalogue. Named selection IDs differ from synthetic track
UUIDs to catch switching by the wrong identifier. The factory returns fresh data
so individual tests can customize it without changing another test's inputs.
This follows the existing `tests/fixtures` pattern; a full deployment catalogue
is unnecessary for these client behaviors.

Real-data and visual smoke checks belong in local/review testing against the
configured API. Do not make automated tests depend on a particular species,
public dataset size, live service, exact colour, or pixel position. Use accessible
roles/names for interactions, and test state rules in the smaller unit suites.
Both runners use `tests/svgrMock.tsx` for SVG component imports; explicit `?url`
imports remain assets. No additional test dependencies are needed for this feature.
