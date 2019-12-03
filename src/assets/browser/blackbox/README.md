# Blackbox

## Introduction

Blackbox is a means of reporting diagnostics during debugging and testing. It is designed to be used through globals and statics to allow easy integration without passing round context objects. This has the downside that it's not really practical to have two blackboxes within a binary. Blackbox is *not* intended to be built into produciton builds. Null versions of the blackbox macros are included to allow conditional compilation. Only if `blackbox` is set as a configuration option will these macros be non-null. The macros are designed to allow diagnostics with minimal disruption to the code being diagnosed, for example by tracking elapsed periods and stacks.

## Model

An integration is an implementation of a trait which you must supply and which uses your environment to retrieve:
* the current time (an `f64`, in units of your choosing); and
* the current instance id (a unique string for this run).

All blackbox diagnostics belong to some stream which is an arbitrary stream, specified where they are used. Only *enabled* streams are logged. This allows diagnostics to be selectively enabled at minimal cost.

## What can be logged?

* `bb_log` logs an arbitrary string to a stream.
* `bb_count` and `bb_count_set` increases/sets the named counter in the stream. (the name is an arbitrary string), but does not report anything.
* `bb_reset_count` resets the named counter (changed by `bb_count` or `bb_count_set`) to zero and reports its old value.
* `bb_time` reports how long the contained code takes to execute.
* `bb_time_if` works like `bb_time` but only reports if the enclosed block returns true.
* `bb_metronome` reports the time since the last call to bb_metronome.
* `bb_stack` pushes a string onto the "stack" for the duration of the enclosed block. This stack is then reported with any diagnostics which execute within it.

Between reports timings are summarized as min/mean/max values.

## Naming

Blackbox is named after the avionics item more properly called the Flight Data Recorder, not the fine Italian House music group.
