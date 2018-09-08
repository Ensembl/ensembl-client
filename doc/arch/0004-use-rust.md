# 0004. Use Rust

Date: <2018-08-31

## Status

Provisional

## Consequence of

* ADR-0003

## Context

WASM, the design choice of ADR-0003, is a compiled language which needs
a source. Languages targeting WASM (typically via LLVM) tend to be at
the other end of the language spectrum to JS, being compiled,
statically-typed and with largely manual memory management.

After a survey of the available languages Rust seemed to be the least
offensive for the writing of a web application. It includes libraries
which interface well with browser APIs and is generally "safe".

Rust has reasonable, if not spectacular adoption, including in the web
community. If the language or libraries flounder, the migration path to
JS would be tedious but not complex or insurmountable, being largely
one-to-one. In that case we will have benefitted from the safeness of
rust in the design phase.

## Decision

Use Rust to target WASM.

## Consequences

We need to choose libraries and tooling.
