# 9. Integration Tests

Date: 2018-10-22

## Status

Accepted

## Context

Writing unit tests alone is not sufficient. Unit tests are mostly based on testing the React components. However, the Redux and router code either has to be tested separately or as a part of the compnents.

## Decision

Write tests for Redux components (e.g. actions, reducers, selectors) separately. Also, write selectors which will be an intermediary layer between Redux and React.

Do not write any integration tests for router code, as it is already well tested by the `react-router` team.

## Consequences

Writing tests for Redux components separately will not be testing the integration of Redux in individual React components. However, since TypeScript is used for static typing, it is easier to spot errors if some Redux properties/functions are not mapped properly with a React component

Also, testing all the Redux components will help in detecting issues that can crop up with connected components (React components that connect with Redux). It does not test the integration directly, though it avoids unnecessary hacks that might be necessary to integrate Redux code inside unit tests written for React components.
