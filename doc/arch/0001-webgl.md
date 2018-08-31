# 0001. Use WebGL1 for browser window

Date: <2018-08-31

## Status

Provisional

## Consequence of

* User input

## Context

We repeatedly hear that a reason for choosing browsers other than ours
is the slow and painful navigation and interaction in the browser 
window. This is something that has proved impossible to remedy with
fixes. So we should address this issue early in the redesign. We were
three technology options for the bottom layer.

* 2D Canvas
* SVG
* WebGL Canvas

SVG and WebGL are object-based, which allows speedy rich interactions.

WebGL has a clean mapping to the browser's graphics card, making it
closer "to the metal", which makes it easier to keep it efficient as the
number of objects scale. The ability to use custom shaders in WebGL
allows common operations to be entirely GPU-based, saving CPU for other
screen components.

2D canvas has the simplest API, SVG next. The WebGL API is ver difficult
to use.

Browsers do not yet support WebGL2 reliably, so WebGL1 is chosen.
However, the two technologies are similar and it should be possible to
migrate without disruption (if forced into it).

## Decision

Use WebGL1.

## Consequences

We need a wrapper around the WebGL1 API to hide WebGL complexities.
