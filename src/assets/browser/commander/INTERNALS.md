# Overview

Commander is a pretty standard (if extensive) futures executor. However, it differs from others in a few places which
add complexity:

* it is designed to work in a non-preemptive environment;
* futures can interact extensively with the executor;
* futures are cancellable through signals (such as timeouts);
* callers can capture return values of arbitrary type;
* it is designed for diagnostics and debugging.

## Motivation

The non-preemptive environment is the primary motivation for writing commander, and the imposition of this by an external environment is expected to be a key reason why commander is chosen.

Running in such an environment requires more extensive interaction with the executor than is typical. For example, sleeps cannot be implemented by fork-and-sleep, nor can tight loops get away with executing without yield and rely on the operating system for scheduling.

Cancellability is difficult without preemption but is essential in a real world, distributed setting.

If facilities such as timeouts, slots and so on, essential for cancellation and robust deployments, are only available at the top level then the ability to create new top-level tasks from inside other tasks is essential. The result of a task is essential glue in such a process. This also helps further decouple the execution of complext futures from their creation in cases where composition is required.

In large, real-time applications performance diagnostics are essential for diagnostics and monitoring.

# Layout

## executor/

The key top-level struct for the crate is the `Executor`. Due to its size, `Executor` is split into mixins implementing separable parts of its functionality. These, in addition, various utility classes closely tied to the executor and of little interest to the rest of the crate are inside `executor/`. Overall their role is to accept new tasks, expire old ones, and progress current tasks as appropriate, during ticks.

## integration/

The externally visible `Integration` trait, responsible for exposing facilities from the underlying system, is within this directory along with two wrapping Integrations. These wrappers wrap any user-supplied integration before they are used by the rest of the crate. `ReenteringIntegration` provides an additional facility to the crate: a call to force one more call to `tick()` when this one is over despite the executor apparently not needing one. This is used to avoid races. A potential issue with this is that it can create many redundant calls to `sleep()` with the same value as is current. `SleepCatherIntegration` manages this (and other redundant calls from within the crate) by only passing through calls which differ from the current state.

## task/

The `task/` directory contains various core data structures which don't fit easily elsewhere but little active functionality. The important structures are `TaskHandle` and `ExecutorTaskHandle`. `ExecutorTaskHandle` is not exposed externally. It is a trait of `TaskHandle` which contains methods used by the executor but which is not polymorphic on result type. This helps insulate most of the crate from the complexities of polymorphism. `Block` handles waking within the futures, much of it concerned with handling the smart waiting implemented, for example in turnstiles.

## agent/

`Agent` is a very large struct which is responsible for interaction from the task to the executor. It is also delegated the actual running of the future and the handling of destructors. To help structure the code this struct is split into mixins implementing separable code. The `Agent` struct and its mixins comprise this directory. `BlockAgent` contains code to handle the use of blocks and waking by futures. `FinishAgent` handles signals and destructors. `NameAgent` handles tasks related to naming and diagnostics. `RunAgent` handles tasks related to timers and ticks, creating subfutures, and so on.

## helper/

The `helper/` directory contains various implementations of `Future` which expose functionality to the crate user.

* `FlagFuture` is a useful utility for implementing callback-based code with futures. It is used extensively in the crate and exposed for potential use outside of the crate.
* `NamedFuture` is the future returned by `Agent.named_wait()`. 
* `TidierFuture` is the future resturned by `Agent.tidy()`. 
* `TurnstileFuture` is the future returned by `Agent.turnstile()`.

## util/

This contains utility functions and macros for use within the crate which might be better pulled in from an external crate, if only one could be found. Currently there is an implementation here of a global sequence generator macro and a hashable trait generating macro.

# Architecture

## TaskContainerHandles

## service/execute Alternation

## Action Queue

## Blocks