# 0002. Wrap WebGL in browser-specific API.

Date: <2018-08-31

## Status

Provisional

## Consequence of

* ADR-0001

## Context

Following ADR-0001 to use WebGL1, the high complexity of the WebGL API
needs shielding from other parts of the code to:

* make our code more maintainable,
* to hide some WebGL housekeeping,
* allow other backends, eg for export, or ancient browsers.

This layer needs to be implemented for efficient manipulation of large
data sets while keeping the screen responsive as a key requirement for
the browser window is responsiveness (see ADR-0001) and it will be
throwing around large amounts of data.

## Decision

Implement WebGL wrapper layer.

## Consequences

All interaction with the screen is through an API of our own which
closely represents the interactions of a browser window. It must be
implemented in an efficient manner from the perspective of large dataset
manipulation.
