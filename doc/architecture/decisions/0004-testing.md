# 4. Testing

Date: 2018-08-30

## Status

Accepted

## Context

When changes are made after the initial implementation of components, there is a chance of code breakage. This needs to be mitigated.

## Decision

Write unit tests using Jest and Enzyme. Include snapshot testing too, for additional testing.

## Consequences

Unit tests can act as code documentation. Also, they can prevent code breakage. However, this would prolong development of the application and will need to be enforced to get the full benefit of testing.
