# 4. Unit Tests

Date: 2018-08-30

## Status

Accepted

## Context

When changes are made after the initial implementation of components, there is a chance of code breakage. This needs to be mitigated.

## Decision

Write unit tests using Jest and Enzyme. Include snapshot testing too, for additional testing.

[Jest](https://jestjs.io/) is used as the main testing framework. Snapshot testing, which is a feature of Jest, is also used.

[Enzyme](https://airbnb.io/enzyme/) is used as a utility of Jest to test React components.

Since these tests are written with TypeScript, [`ts-jest`](https://kulshekhar.github.io/ts-jest/) is used to run them.

## Consequences

Unit tests can act as code documentation. Also, they can prevent code breakage. However, this would prolong development of the application and will need to be enforced to get the full benefit of testing.

Jest is developed by Facebook Inc. and used by many React developers. The same can be said of Enzyme. This should help the team with finding help as there is already a community built around these tools.

All unit tests are written TypeScript and this adds some complexity to the testing code. Also, setting up the code and fixing issues related to TypeScript integration with the tools can be tricky.
