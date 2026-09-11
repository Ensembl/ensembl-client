---
name: ensembl-client-implementation-context
description: Implement or modify ensembl-client React, TypeScript, CSS, UI, routing, SSR, Redux, API, server, or test code by pulling the relevant conventions from the current checkout. Do not use for standards-document maintenance or diff-only review.
---

# Ensembl client implementation context

Pull only the context needed for the implementation at hand. Treat the current checkout as authoritative because component APIs, tokens, and local patterns evolve.

## Discover the relevant contract

1. Read the root `AGENTS.md` and the relevant sections of [`CODING_STANDARDS.md`](../../../CODING_STANDARDS.md).
2. Classify the affected area: UI/component, route or SSR, state or API, server/configuration, shared utility, or test. A task may span more than one area.
3. Inspect the nearest maintained source, call sites, tests, configuration, and two or more comparable examples when available. Do not infer a convention from one isolated or legacy file.
4. Preserve the established interfaces and test seams. If nearby patterns conflict, state the uncertainty and follow the best-supported current pattern rather than inventing a new convention.

## For UI work

Search `src/shared/components/` by semantic role and behaviour, then inspect candidate props, styles, tests, call sites, and matching `stories/shared-components/` examples. Read `stories/design-primitives/` and `src/styles/design-tokens.css` when the change affects visual language.

Prefer, in order:

1. A shared component whose semantics and behaviour fit.
2. A composition of shared components.
3. A backward-compatible extension that is generally useful, after checking existing consumers, tests, and stories.
4. A feature-local component for domain-specific behaviour or presentation.
5. A new shared component only for a genuine reusable primitive or repeated pattern.

Use existing tokens and component CSS custom-property hooks before adding literal design values or copying markup. Do not force a near-match that changes meaning or accessibility, and do not generalise one-off feature logic prematurely. Preserve native semantics, keyboard and focus behaviour, labels, disabled states, and responsive behaviour. Keep feature-local styles local; add a global token only when it is intentionally reusable. Do not introduce `@ensembl/ensembl-elements` unless the project explicitly adopts it for the task.

## Check architectural boundaries

- Use the repository path aliases, typed Redux hooks, injected RTK Query endpoints, CSS Modules, test suffixes, licence headers, and local code organisation when they apply.
- Treat SSR and hydration as an explicit decision whenever work touches route configuration, `serverFetch`, preloaded Redux state, configuration transferred to the client, lazy rendering, or browser-only APIs.
- For a shared UI primitive, inspect whether focused browser tests and a corresponding Storybook example are warranted. Follow the candidate component's existing export and file-layout pattern.

## Validate proportionately

Run the narrowest relevant tests first. Add type checking and the applicable script/style linting in proportion to the change. Review the diff for copied primitives, avoidable APIs, hardcoded values already represented by tokens, browser/server mismatches, and accidental unrelated edits. In the handoff, identify reused shared components and tokens and explain any intentional local exception.
