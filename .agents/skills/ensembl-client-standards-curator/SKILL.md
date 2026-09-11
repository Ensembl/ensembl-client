---
name: ensembl-client-standards-curator
description: Curate the repository's CODING_STANDARDS.md from verified Ensembl client evidence. Use explicitly when standards need to be added, corrected, or refreshed; do not use for implementation or diff review.
---

# Ensembl client standards curator

Push verified local evidence into [`CODING_STANDARDS.md`](../../../CODING_STANDARDS.md), the standards source consumed by review workflows. "Push" here means updating that local document; it never authorises `git push` or another remote action.

## Establish evidence

Before changing a rule, inspect the current checkout:

- explicit guidance such as `AGENTS.md` and focused documentation;
- relevant TypeScript, ESLint, Stylelint, Vitest, Playwright, Storybook, and build configuration;
- maintained source, call sites, tests, and UI stories across each affected area; and
- existing automated checks that already enforce the proposed rule.

Do not infer a rule from one isolated or legacy example. Prefer current source and configuration pointers over copied implementation details that will become stale.

## Curate the standards source

Update only `CODING_STANDARDS.md` unless the user explicitly requests a broader change. Preserve these levels:

- **Required standard**: an explicit project instruction or a rule enforced by configuration or checks. A review finding may identify a hard violation.
- **Established convention**: a repeated current local pattern that can have justified exceptions. A finding requires judgement unless the project makes it mandatory.
- **Review heuristic**: a maintainability or usability prompt. It is never a standards breach by itself.

For every rule or compact group, state what a reviewer should inspect and add a relative pointer to the authority or representative evidence. Record deliberate local exceptions where they override a generic code smell. Do not repeat rules already fully enforced by formatting, linting, types, or tests unless human judgement remains and the document explains it.

Keep the document focused on reviewable choices an agent cannot reliably learn from one file or one command. Do not turn it into an architecture manual, introduce another standards source or finding taxonomy, perform diff review, change application code, or create remote artefacts.

## Verify

Check every changed link and source pointer, reread the affected section for correct evidence levels, and run `git diff --check`. Report weakly evidenced or tool-enforced rules that were intentionally excluded.
