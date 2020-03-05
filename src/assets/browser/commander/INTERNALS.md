# Overview

Commander is a pretty standard (if extensive) futures executor. However, it differs from others in a few places which
add complexity:

* it is designed to work in a non-preemptive environment;
* futures can interact extensively with the executor;
* futures are cancellable through signals (such as timeouts);
* callers can capture return values of arbitrary type;
* it is designed for diagnostics and debugging.

## Motivation

The non-preemptive environment is the primary motivation for writing commander, and the imposition of this by an
external environment is expected to be a key reason why commander is chosen.

Running in such an environment requires more extensive interaction with the executor than is typical. For example,
sleeps cannot be implemented by fork-and-sleep, nor can tight loops get away with executing without yield and rely on
the operating system for scheduling.

Cancellability is difficult without preemption but is essential in a real world, distributed setting.

If facilities such as timeouts, slots and so on, essential for cancellation and robust deployments, are only available
at the top level then the ability to create new top-level tasks from inside other tasks is essential. The result of a
task is essential glue in such a process. This also helps further decouple the execution of complext futures from their
creation in cases where composition is required.

In large, real-time applications performance diagnostics are essential for diagnostics and monitoring.

# Layout

## executor/

The key top-level struct for the crate is the `Executor`. Due to its size, `Executor` is split into mixins implementing
separable parts of its functionality. These, in addition, various utility classes closely tied to the executor and of
little interest to the rest of the crate are inside `executor/`. Overall their role is to accept new tasks, expire old
ones, and progress current tasks as appropriate, during ticks.

## integration/

The externally visible `Integration` trait, responsible for exposing facilities from the underlying system, is within
this directory along with two wrapping Integrations. These wrappers wrap any user-supplied integration before they are
used by the rest of the crate. `ReenteringIntegration` provides an additional facility to the crate: a call to force one
more call to `tick()` when this one is over despite the executor apparently not needing one. This is used to avoid
races. A potential issue with this is that it can create many redundant calls to `sleep()` with the same value as is
current. `SleepCatherIntegration` manages this (and other redundant calls from within the crate) by only passing through
calls which differ from the current state.

## task/

The `task/` directory contains various core data structures which don't fit easily elsewhere but little active
functionality. The important structures are `TaskHandle` and `ExecutorTaskHandle`. `ExecutorTaskHandle` is not exposed
externally. It is a trait of `TaskHandle` which contains methods used by the executor but which is not polymorphic on
result type. This helps insulate most of the crate from the complexities of polymorphism. `Block` handles waking within
the futures, much of it concerned with handling the smart waiting implemented, for example in turnstiles.

## agent/

`Agent` is a very large struct which is responsible for interaction from the task to the executor. It is also delegated
the actual running of the future and the handling of destructors. To help structure the code this struct is split into
mixins implementing separable code. The `Agent` struct and its mixins comprise this directory. `BlockAgent` contains
code to handle the use of blocks and waking by futures. `FinishAgent` handles signals and destructors. `NameAgent`
handles tasks related to naming and diagnostics. `RunAgent` handles tasks related to timers and ticks, creating
subfutures, and so on.

## corefutures/

The `corefutures/` directory contains various implementations of `Future` which expose functionality to the crate user.

* `PromiseFuture` is a useful utility for implementing callback-based code with futures. It is used extensively in the
crate and exposed for potential use outside of the crate.
* `NamedFuture` is the future returned by `Agent.named_wait()`. 
* `TidierFuture` is the future resturned by `Agent.tidy()`. 
* `TurnstileFuture` is the future returned by `Agent.turnstile()`.

They differ from `derivedfutures/` in that they expose otherwise features which are otherwise unaccessible from outside
the crate.

## derivedfutures/

The `derivedfutures/` directory contains various utilities for managing futures for use by the crate user. Unlike
`corefutures/` these futures use no non-public methods and so could have been implemented outside of this crate. Many
of these could be delegated to external, possibly third-party crates in time.

* `CommanderStream` implements a blocking queue based around futures.

# Architecture

## TaskContainerHandles

As well as being exposed externally, `TaskHandle`s are used internally by the executor to track individual tasks.
However, `TaskHandle`s need to be polymorphic on task return type and we can get away with very few constraints on that
type as those constraints are exposed in the API and would limit a user. However, return type is a relatively minor
concern of `TaskHandle` and one which an executor need not worry itself about. Therefore, the `ExecutorTaskHandle` trait
is a trait on top of `TaskHandle` which is non-polymoprhic and exposes methods necessary for the executor to control the
task.

However, even passing around such a trait could cause problems. First, despite not being explicitly polymorphic, it
would remain awkward, though not impossible, to manage and pass `TaskHandle`s around, and references would become a
challenge, particularly avoiding circularity and handling weakness correctly, and no excape through `Clone` (as we don't
want to require the return type is `Clone`).

To avoid these issues `ExecutorTaskHandle`s are stored in a `TaskContainer` and given a `TaskContainerHandle`. The
container is a simple indexed array and the handles comprise an index into that array and a unique serial number to
ensure that old, evicted handles don't resolve to newer `ExecutorTaskHandle`s which happen to be in the same slot.
Because the get method returns an `Option<ExecutorTaskHandle>` an executor can quickly guarantee disposal of a task and
no other part of the code be able to access it as each must explicitly handle the `None` branch appropriately. As a
`TaskContainerHandle` comprises two integers it can be happily cloned, copied, etc.

A more sophisticated approach could probably have been devised, but at the samce time retaiining the clarity and lack of
clutter of this approach would be more difficult.

## ActionLink and RequestLink

Tasks communicate with the `Executor` via their `Agent`. To do so, each `Agent` is associated with to `Links`, a
`Link<Action>` and a `Link<Request>` which are queues to which the `Agent` adds and the `Executor` removes. Every
message is associated with a particular task and so includes the corresponding `TaskContainerHandle`. `TaskLink<Action>`
and `TaskLink<Request>` wrap the sending of messages for the `Agent` and supplies the correct `TaskContainerHandle`.

`Request` and `Action` handle different message types. `Action` handles blocking and unblocking of existing tasks. It
has strict ordering requirements and must be `Send` so that it can be used as a waker in futures. `Request` handles
other requests (new timers, tasks, etc), which initiate timers and tasks. To avoid unnecessary constraints on 
commander's API, this is not `Send`. Both queues are exhausted during a single service phase of the executor.

## service/execute Alternation

The `Executor` calls draining and processing the queue its *service* phase. This contrasts with running the task itself,
the *execute* phase. Service and execute phases are guranteed not to overlap for each task. In the current
implementation the phases do not overlap *at all*, but that may change in the future. This non-overlapping nature is
important to the extent that it used to ensure certain correctness-guarantees given aynchrony.

In each tick, the first and last phase are guaranteed to be service phases. In between can be an arbitrary arrangement
of execute and service phases.

## Blocks, Main Blocks and Asynchrony

The executor is synchronous. However, true asynchrony enters into the system when it comes to waking tasks. A task may
be awoken completely asynchronously relative to the execution of the executor (and therefore all tasks). Therefore care
must be taken when unblocking tasks. To ensure that there are no races, unblocking via the future waker only adds an
`Unblock` message to the action queue for the executor notifying it of the awakening and then *causes rentry* in the
integration.

"Causing reentry" is a method to ensure that another tick is serviced without delay despite the apparent lack of need
from timers, etc. Otherwise, if the waking occured after the last service or between ticks the executor would not awake
in a timely manner.

During a service phase, the executor picks up this message and handles blocks (see later). The process for handling
blocks is moderately subtle and doing it in the service phase (and therefor not ruind the execution phase) greatly
simplifies analysis.

A `Block` comprises a flag (`blocked`) and a callback which is called when the flag is reset. The status of the flag may
be inspected, set, or reset.

The most important block is the *main block*. Every task has one main block. Its callback issues an `UnblockTask`
message to the executor (note, this is distinct from the `Unblock` message above). This `UnblockTask` message adds the
task to the run queue. If, during the execute phase, the task is pending, a `BlockTask` message is added to the queue,
which has the oppsite effect. Note that `BlockTask` messages can only be generated in the execute phase and
`UnblockTask` messages only during servicing so they cannot race because of the alternation guarantee.

If no special futures from this crate are used by a task, the main block is the block which is invoked during calls to
the waker. Therefore the sequence for a poll which eventual blocks is as follows.

 1. During a call to poll, one of more copies of the waker is taken, corresponding to the main `Block` and the future
    returns as pending and a `BlockTask` message is sent.
 2. Before or after the `BlockTask` message is queued the waker is awoken asynchronously and one or more `Unblock`
    messages are queued.
 3. During the next service phase, both types of message are unqueued. The `Unblock` message causes an `UnblockTask`
    message to be queued. Not that this is guaranteed to be behind the corresponding `BlockTask` as it cannot be queued
    until the service phase following the execution phase which generated the `BlockTask` (and, indirectly, the `Unblock`).
 4. The `UnblockTask` message is serviced and the task is unblocked.

## Non-Main Blocks

A block which is not a main block is a non-main block. All non-main blocks have an downstream block. There are no
cycles. Therefore all chains of blocks terminate in a main block. During exeuction, a tasks's `Agent` maintains a stack
of blocks. At the root of the stack is the main block for the task. When a sub-future is entered a new (non-main) block
is pushed onto the stack, which has a downstream block of the previous stack top. This block is then popped when the
subfuture is complete. The waker used for a future is always the top block on the stack at the time. A non-main block
should arrange through its callback that its downstream block is unblocked at an appropriate time.

Currently, non-main blocks are only used for the `TurnstileFuture` of `Agent.turnstile()`. This non-main block always
immediately calls its downstream block's unblock method immediately on being unblocked itself. This future also
maintains internal state as to whether the inner future is blocked (through returning a pending status from poll in the
execute phase) or unblocked (through a call to unblock in the service phase). If it is blocked, when called the
turnstile returns a pending status immediately to avoid unnecessary calls to the inner future.

In future it is evnisaged that helper futures will be implemented within the crate which do not immediately propagate
unblocks downstream (for exmaple a smart join combinator which knows that only some branches have completed) though non
currently exist. In this case the `Unblock` messages are still sent and processed but no `UnblockTask` is sent as the
main block is not unblocked.

## Signals, Destructors and Slots

Signals such as timeouts live unhappily with non-preemption, but can be made to work together in a fashion. The executor
simply "gives up" on signalled tasks and sets their `TaskHandle` appropriately. This requires the co-operation of the
task in yielding at some point.

Given stateful resources, the existence of signals requires some kind of tidying/destructor functionality. These
destructors are created with `Agent.tidy()` and are guranteed to be executed to completion before a signal completes.
Destructors are handles entirely at the `Agent` level. To the executor, the tasks has merely not yet finished. When it
is done, a `Done` action is sent, and the executor moves on. A destructor is held in a promise-like object placed on a
stack in the agent. When `Agent.finishing`, the stack is processed in reverse order until all are complete.

To a first approximation, only one task may occupy a slot at any one time. However, destructors make this more 
complicated. A push slot may evict a task but it may be some time servicing its destructors during which time the task
must not run. During this time other tasks may be submitted to the slot, and so on. To this end, the executor contains a
queue of tasks against each slot. When submitted, a task joins the back of the queue and all other queue members are
killed. Only the head of the queue is on the runqueue at any one time.
