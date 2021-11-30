# 10. Git Hooks

Date: 2018-10-22

## Status

Accepted

## Context

When code is written by different developers, the code formatting can be inconsistent. This could happen when written in different environments e.g. IDE, operating system.However, maintaining a proper coding style is essential for stability and fewer changes between commits due to code formatting.

Also, need to prevent the code from breakage when changes are made to the existing code.

## Decision

Use `git` hooks for code formatting, linting and running tests.

## Consequences

Code formatting will become consistent when `git` hooks format the code during the commit process using a tool such as [`prettier`](https://prettier.io/).

Also, small mistakes in the code can be avoided when linters are run when code is committed (with pre-commit `git` hook).

On `git` push, tests can be run to check if there are any errors/issues introduced by the new/modified code. In case such an error is detected, the developer will need to address the issue before pushing the code again.
