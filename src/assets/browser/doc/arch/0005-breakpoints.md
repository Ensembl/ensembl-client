# 0005. Breakpoints at 1000..., 3000...

Date: 2018-11

## Status

Provisional

## Consequence of

None

## Context

We need to have fixed breakpoint scales at which we can change the
rendering. These should be "round" numbers so that we can replace
without annoying rounding errors from fractional bases causing jitter.
It makes sense to do it at the decade points, 1, 10, 100, etc. The
current website also has breakpoints at intermediate values suggesting
a need for greater definition.

Scaling multiplies meaning that breakpoints need to be logarithmically
distributed to be "even". For exmaple, if we were to have breaks at
100... and 500... this would be poor as there would be a jump of 5x
followed by one of 2x between the scale points.

The square root of ten is close to three, meaning choosing 100... and
300... gives jumps of 3x and 3 1/3x which is about 10% error, which is
small, and provides round numbers for scales.

Having more jump points would mean needing 2x jumps which interact badly
with 10: 2x 2x 2x 2.625x. We can't have fewer intermediate jumps than 
the single one provided by 100..., 300..., so this is the best option.

## Decision

Break points at 100... and 300...

## Consequences

We need to choose the best scales for style changes at one of these
points.
