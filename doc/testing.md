# Notes on testing

We use `vitest` as test runner. We migrated from `jest` to `vitest`, because `jest` had poor support for ES modules, and that caused more and more problems as more and more of our dependencies upgrated to ESM-only versions.

Our tests were initially written to be run in `jsdom` using `react-testing-library`. However, `vitest` has long been working on adding a browser mode for running UI tests in real browser rather than in a simulated browser environment such as `jsdom`. With the release of version 4.0 (October 2025), `vitest` announced that the browser mode is now stable.

Using the real browser to test UI components has the benefit of running tests in a real environment that the components were built for, rather than in a simulated environment where they will never run for real. Simulated environments, such as `jsdom`, do not implement the full DOM api, and lack other browser apis (`indexedDB`, etc.).

WIth the adoption of `vitest` browser mode, we can think of our tests as two groups: the ones that require a browser to run (e.g. tests of UI components), and the ones that can run in Node (e.g. tests of helper functions). Because these two groups of tests will need different `vitest` configurations, the following file naming convention will be used to separate the two:

- For tests that should run in the browser, end file names in `.browser.test.ts(x)`. For example, `AutosuggestSearchField.browser.test.tsx`
- For tests that do not need browser environment to run, end file names in just `test.ts`.

## References
- [Documentation of Vitest browser mode](https://vitest.dev/guide/browser/)
- [Github repository for workshop React Component Testing with Vitest](https://github.com/epicweb-dev/react-component-testing-with-vitest) — contains code examples of tests, as well as commentary in markdown files explaining those examples
- [Playwright documentation](https://playwright.dev/docs/best-practices), including best practices of UI testing