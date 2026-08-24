---
name: ensembl-ui
description: Build or modify ensembl-client interfaces using the repository's shared React components, CSS design tokens, Storybook guidance, naming conventions, and code layout. Use for UI implementation, styling, or review; do not invoke for changes with no user-interface impact.
---

# Ensembl UI

Maintain a coherent Ensembl experience and avoid duplicated UI code. Treat the checked-out repository as the source of truth because component APIs and tokens evolve.

## Find the established solution first

Before implementing UI:

1. Read the repository `AGENTS.md` and inspect neighboring feature code for its established structure and terminology.
2. Search `src/shared/components/` by visual role, behavior, and likely element name. Inspect candidate component props, tests, styles, and call sites rather than judging from the directory name alone.
3. Check the matching examples under `stories/shared-components/`. Use `stories/design-primitives/` and `https://ensembl.github.io/ensembl-client/` for design intent.
4. Read `src/styles/design-tokens.css` before introducing colour, typography, spacing, shadow, or other design values.

Useful discovery commands include:

```bash
find src/shared/components -mindepth 1 -maxdepth 1 -type d | sort
rg -n "<semantic role or interaction>" src/shared/components stories/shared-components src/content
rg -n -- "--color-|--font-|--standard-gutter|--shadow" src/styles src/shared/components
```

Search terms should describe the need, such as button intent, modal, upload, select, tabs, tooltip, loading, pagination, or layout—not only the proposed component name.

## Choose the reuse boundary

Prefer, in order:

1. An existing shared component whose semantics and behavior fit.
2. A composition of existing shared components.
3. A backward-compatible extension to a shared component when the capability is generally useful. Inspect its usages, tests, and stories before changing its API.
4. A feature-local component when the behavior or presentation is specific to one domain.
5. A new shared component only when it represents a genuine reusable primitive or demonstrated repeated pattern.

Do not force a near-match that changes meaning, accessibility, or expected behavior merely to claim reuse. Do not generalize one-off feature logic prematurely. `@ensembl/ensembl-elements` is out of scope until the project explicitly adopts it for this work.

## Apply the design language

- Use variables from `src/styles/design-tokens.css` instead of duplicating their literal values. This includes standard colours, fonts, weights, gutters, shadows, and form-field values.
- Preserve the semantic distinctions documented in Storybook. For example, a primary button commits or advances a choice, while a secondary button presents an option.
- Prefer an existing component's supported props and CSS custom-property hooks over copying its markup or reaching into its private CSS module.
- Follow the global defaults in `src/styles/` and the patterns of the surrounding app. Do not add a global style for a feature-local need.
- If no suitable token exists, use the narrowest local value that matches nearby code. Add or change a global token only when the value is an intentional reusable design primitive, and check its existing consumers first.
- Preserve native semantics, keyboard operation, focus behavior, labels, disabled states, and existing responsive behavior when composing or extending components.

## Follow repository shape

- Keep shared components in a descriptive kebab-case directory under `src/shared/components/`; use PascalCase for React component files and co-located `*.module.css` styles.
- Use `src/*` aliases and preserve the candidate component's existing default, named, or barrel-export import style.
- Follow neighboring conventions for prop names, event handlers, CSS-module class names, and file splitting. Avoid introducing a second naming pattern.
- Give a new reusable component focused tests and a Storybook story under the corresponding `stories/shared-components/` directory. Use the repository's browser-test suffix for tests that require a real browser.
- Add the repository Apache 2.0 header to new source files.

## Verify the result

Review the diff for copied primitives, hardcoded values already represented by tokens, and avoidable new component APIs. Run the narrowest relevant tests, then type-check and lint in proportion to the change. In the handoff, name the shared components and tokens reused; explain any new primitive or intentional local exception.
