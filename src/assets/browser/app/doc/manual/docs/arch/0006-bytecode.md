# 0006. Use of compiled bytecode language for styling

Date: 2018-11

## Status

Provisional

## Consequence of

None

## Context

We need a way of styling tracks in the WebGL. As we are styling things
down to WebGL triangles, not a DOM box model, we can't rely on CSS to
do this and doesn't have quite the right paradigm, anyway. (We need
something closer to PS/PDF/SVG primitives). We should choose a method
which is:

1. expressive;
2. easy and quick to turn-aroud and edit to encourage experimentation;
3. portable to different data-situations without code changes;
4. simple to implement.

(2) and (3) rule out direct hard-baking into the rust frontend. They
suggest instead an asset, like CSS, which represents styling of data
which the browser can grab and use to layer over the data.

Languages like CSS (and DSSSL, etc, before it) tend to get conceptually
"hairy" pretty quickly, developing various modes, by-ways, axes, units,
etc, which interact in complex ways. The language of design is typically
*not*  strucutred in the rigid ontological frameworks which supports
compact declarative specification. Pretty soon these languages end up
supporting a surrogate, embedded programming language. These concerns
speak against points (1) and (4) above.

An alternative is to adopt an embeddable bytecode from the start. This
need only implement basic arithmetic and boolean operations and, it
turns out, can be implemented with parser, lexer, and full tests in
<4kloc. This addresses (1,3,4) but pushes against (2): nobody wants to
write bytecode.

Instead, we ask that developers write in a source format which is
transpiled to the bytecode format after each change. The bytecode gets
sent over the wire. This source format can be a simple expression 
language or even a declarative "config-file" format, depending on
developer experience, skills, requirements, etc, all compiled into the
bytecode. Writing such a transpiler is a mature field with rich tools,
which should be quick to achieve (as we don't need efficiency, our
bytecode will be short). This addresses (2) without sacrificing (1,3,4).

The embedded interpreter handles large volumes of data, so:

1. needs to be efficient, but
2. needs to play well as an *embedded* language, allowing other parts 
   of the browser app to respond in a timely manner, etc.
   
These two requirements tend to push against each other. Interpreted
languages tend to be slow at instruction boundaries and embedded,
interpreted languages even more so. Generally much of the time taken is
in administrative tasks between instructions. A great deal of work has
been done in the field to optimise this: sufficient to say that we don't
want to go anywhere near there with a twelve foot barge-pole.

Instead, we use a vector language. This means that tens of thousands of
data-points can be manipulated within a single instruction, removing
the number-of-objects factor from the overheads. In this situation the
overheads again become insignificant. Our addition operation, for
exmaple (to centre or displace a block, say), adds an array of numbers
to another array of numbers. Thus every object can be shifted with a
single instruction. (Languages like R and numpy show the value of this
approach).

The need for an embedded vector language means that no examined exisitng
solutions (such as embedding Lua) could be found to fly. The additional
requirment of a WASM target integrated with a rust application would
have further complicated things.

To aid debugging the "bytecode" should be human-readable at-a-push. In
this case it should probably support a 1-to-1 to an assembler-like
syntax.

Fortunately implementing bytecode interpreters, despite sounding scary,
requires nothing more than graduate computer science experience.

## Decision

Implement an embedded bytecode interpreter parsed in the client from
an assembler-like syntax.

## Consequences

Longer term, we need to decide on the best "source" language for this.
Whether it's a declarative, configuration-based source or a nicer
rich input/config language, or some combination of these.

