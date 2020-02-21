# Commander

## Overview

Commander is a futures Executor for Rust designed for a non-preemptive, periodically polled environment with no guarantee of simultaneously executing threads. 

Though not slow, its focus is not on speed but on solid engineering practices in a deployed environment for real-world loads: loads which fail, timeout, need to be profiled, etc.

### Integration

Commander is designed to sit in an environment where a periodic servicing call (here known as a "tick") is the principal means of progressing futures. Commander can also signal that ticks may be suspended for some time should no tasks need progress, though an integration is free to ignore this.

As well as ticks, commander handles time. The integrator is required to provide a method which returns a float representing time in whatever units are convenient for the integration. When the integrator issues a tick, a time bound is also given as an argument. Through use of the integrated callback, the tick progresses futures until that time bound is busted.

### Executor-Future Communication

Furst futures allow only one interaction with a future: wakoing on sleep. Commander adds a much larger API through the use of a clonable  `Agent` struct. This can be passed into the async itself and serve as a channel to communicate with the executor. As well as trivial tasks such as changing a task's name, the Agent can be used to get a number of "special" futures for use within another future: timers, destructors, etc. The timers are particularly necessary given the non-preemptive environment.

### Executor-Invoker Communication

When a future is added to an executor, a handle is returned to the invoker. This can be used to track progress, get return values, send signals, and so on. It is also a future itself and can, if appropriate, be passed into a new future and the result waited upon. A new top-level invocation can also be created, via Agent, from within a running future. This new invocation is completely independent of its creator. However, a handle is also returned which the invoker can wait upon if it wishes.

### Signals

Though the environment is strictly non-preemptive, a signal system allows a certain amount of apparently asynchronous operation. Signals can indicate that a task timed out, that it should be cancelled externally, or that it is no longer needed due to its slot being occupied by a newer task (see section on slots). Once a process is signalled it no longer runs and never completes except for any finalisers created by the future.

Finalisers ("tidiers") are auxilliary futures which may be created within some other future. They wrap some future to "tidy up" (say, close a file descriptor). In normal flow, the wrapped tidier can be waited on, in which case the inner future is waited upon and the tidier is transparent. However, after signal delivery, any unfinished tidiers are waited upon to completion before the future is discarded.

### Yielding, Ticks, and Timers

There are two time-oriented concepts in commander: ticks and timers. For each, and Agent can provide a future to wait for a certain number of ticks or a certain time. The commander ensures that this is possible despite the (possible) single-threaded environment. A task can also have an overall, global timeout created at invocation time which causes a signal, should it expire.

A long-lived, well-behaved future can also yield for zero ticks. In this case other futures at the same run-level are executed if appropriate. However, within the same tick if time allows the future is immediately resumed. This allows tight loops without pre-emption but ticks of controlled length.

### Priorities

Tasks have a single, fixed priority. Within a tick the tasks with the current highest priority are run round-robin. Priorities are intended to separate broad classes of task -- real-time, interactive batch, etc -- not be a means of managing scheduler execution order or "fair share".

### Slots

Tasks may be placed in slots. A slot is an object which may be created arbitrarily and passed to the executor at invocation. The executor ensures that no two tasks run within a slot at any one time. Depending on an argument passed when the slot was created either the old task "wins" or the new. This is handled using signals.

The purpose of slots is to allow periodic submission of tasks which may "over-run" or become irrelevant, and to allow a clean API for expressing that in many cases.

### Turnstiles

Typically in a Rust futures executor, when some wake-up occurs within a futures tree the whole task is rescanned, including other branches which may be blocked and not awoken. This can potentially be problematic for very large tasks where rechecking is expensive. 

For exmaple, a future may, at the top-level have two branches A and B, both of which are ongoing, and must complete before the task can complete. Step A might be very frequently progressing, inching along,whereas Step B is blocked long-term but checking is very expensive (for exmaple, requiring a round-trip to another server). In this case, the frequent wakeups originating in Step A cause many expensive lookups in Step B.

To avoid this problem, futures can be wrapped inside "turnstiles". Once the inner future returns a pending, a turnstile always returns that a future is pending, without rechecking until it sees a wake originating *within the contained future*. In the example above, if Step B is wrapped in a turnstile, only wakeups from within Step B will cause Step B to be rechecked.

The backing mechanism for implementing turnstiles within commander is very flexible and can handle cases beyond turnstiles. That functionality is not currently exposed but this is seen as a future expansion area, as need arises.

### Blackbox

Commander is implemented with the blackbox logging and diagnostics system through use of a flag. This allows task execution times and invocation and termination to be logged through blackbox.

## Usage

## Implementaiton