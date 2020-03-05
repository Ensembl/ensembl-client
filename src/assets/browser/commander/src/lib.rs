/*!

# Overview

Commander is a futures Executor for Rust designed for a non-preemptive, periodically polled environment with no 
guarantee of simultaneously executing threads. 

Though not slow, its focus is not on speed but on solid engineering practices in a deployed environment for real-world 
loads: loads which fail, timeout, need to be profiled, etc.

In this context *non-preemptive* is used loosly to mean the following:
  * there is no mechanism to force a task to interrupt its work;
  * there *may* be only a single thread of execution so spawning threads which sleep, for exmaple, won't work as an 
    implementation of a timer;
  * bad things would happen unless the executor periodically returned to its invoking environment.

The principal target which can be characterised in this way is the basic web environment.

## Integration

Commander is designed to sit in an environment where a periodic servicing call (here known as a "tick") is the principal
means of progressing futures. Commander can also signal that ticks may be suspended for some time should no tasks need
progress, though an integration is free to ignore this.

As well as ticks, commander handles time. The integrator is required to provide a method which returns a float 
representing time in whatever units are convenient for the integration. When the integrator issues a tick, a time bound
is also given as an argument. Through use of the integrated callback, the tick progresses futures until that time bound
is busted.

## Executor-Future Communication

Furst futures allow only one interaction with a future: wakoing on sleep. Commander adds a much larger API through the
use of a clonable  `Agent` struct. This can be passed into the async itself and serve as a channel to communicate with
the executor. As well as trivial tasks such as changing a task's name, the Agent can be used to get a number of 
"special" futures for use within another future: timers, destructors, etc. The timers are particularly necessary given 
the non-preemptive environment.

## Executor-Invoker Communication

When a future is added to an executor, a handle is returned to the invoker. This can be used to track progress, get 
return values, send signals, and so on. It is also a future itself and can, if appropriate, be passed into a new future
and the result waited upon. A new top-level invocation can also be created, via Agent, from within a running future.
This new invocation is completely independent of its creator. However, a handle is also returned which the invoker can
wait upon if it wishes.

## Signals

Though the environment is strictly non-preemptive, a signal system allows a certain amount of apparently asynchronous
operation. Signals can indicate that a task timed out, that it should be cancelled externally, or that it is no longer
needed due to its slot being occupied by a newer task (see section on slots). Once a process is signalled it no longer
runs and never completes except for any finalisers created by the future.

Finalisers ("tidiers") are auxilliary futures which may be created within some other future. They wrap some future to
"tidy up" (say, close a file descriptor). In normal flow, the wrapped tidier can be waited on, in which case the inner
future is waited upon and the tidier is transparent. However, after signal delivery, any unfinished tidiers are waited
upon to completion before the future is discarded.

## Yielding, Ticks, and Timers

There are two time-oriented concepts in commander: ticks and timers. For each, and Agent can provide a future to wait
for a certain number of ticks or a certain time. The commander ensures that this is possible despite the (possible)
single-threaded environment. A task can also have an overall, global timeout created at invocation time which causes a
signal, should it expire.

A long-lived, well-behaved future can also yield for zero ticks. In this case other futures at the same run-level are
executed if appropriate. However, within the same tick if time allows the future is immediately resumed. This allows
tight loops without pre-emption but ticks of controlled length.

## Priorities

Tasks have a single, fixed priority. Within a tick the tasks with the current highest priority are run round-robin.
Priorities are intended to separate broad classes of task -- real-time, interactive batch, etc -- not be a means of
managing scheduler execution order or "fair share".

## Slots

Tasks may be placed in slots. A slot is an object which may be created arbitrarily and passed to the executor at
invocation. The executor ensures that no two tasks run within a slot at any one time. Depending on an argument passed
when the slot was created either the old task "wins" or the new. This is handled using signals.

The purpose of slots is to allow periodic submission of tasks which may "over-run" or become irrelevant, and to allow a
clean API for expressing that in many cases.

## Turnstiles

Typically in a Rust futures executor, when some wake-up occurs within a futures tree, the whole task is rescanned,
including other branches which may be blocked and not awoken. This can potentially be problematic for very large tasks
where rechecking is expensive. 

For exmaple, a future may, at the top-level have two branches A and B, both of which are ongoing, and must complete
before the task can complete. Step A might be very frequently progressing, inching along,whereas Step B is blocked
long-term but checking is very expensive (for exmaple, requiring a round-trip to another server). In this case, the
frequent wakeups originating in Step A cause many expensive lookups in Step B.

To avoid this problem, futures can be wrapped inside "turnstiles". Once the inner future returns a pending, a turnstile
always returns that a future is pending, without rechecking until it sees a wake originating *within the contained 
future*. In the example above, if Step B is wrapped in a turnstile, only wakeups from within Step B will cause Step B to
be rechecked.

The backing mechanism for implementing turnstiles within commander is very flexible and can handle cases beyond 
turnstiles. That functionality is not currently exposed but this is seen as a future expansion area, as need arises.

## Summaries and Named Waits

Each task can be summarized to allow a task-list type view. The summary is currently quite limited but having a list of
running jobs, their names, and any named waits can help with diagnostics.

Because some tasks may spend a long time waiting on some external resource, it can be useful to evidence this in
summaries. A future exist which wraps an internal, potentially slow future and takes a name. When a task is pending on a
future inside this wrapper, the name of this wait is included in summary information, for diagnostic purposes.

## Blackbox

Commander is implemented with the blackbox logging and diagnostics system through use of a flag. This allows task
execution times and invocation and termination to be logged through blackbox.

# Usage

## Creating an Executor

Before an executor can be created, an integrator must create an integration. This integration provides a means of
retrieveing the current time and a method to handle any notifications from the executor about the possibility of
skipping polls. Given this, an Executor can be created.

```ignore
pub struct TestIntegration {
    ...
}

impl Integration for MyIntegration {
    fn current_time(&self) -> f64 { ... }
    fn sleep(&self, quantity: SleepQuantity) { ... }
}

let executor = Executor::new(MyIntegration::new());
```

## Submitting a Task

A task is submitted in three stages.

First, a RunConfig is created. RunConfigs contain various parameters describing a task which are expected to be shared
across many sumbissions. If you are unlucky, you may have to create a RunConfig each call. If you are lucky you can
reuse one. These aren't expensive to create, they exist as a separate entity solely to simplify code.

Second, an Agent is created. This takes the RunConfig and a name. 

Third, the Agent and the async are passed to the executor.

The reason that these last two steps are separate is that it means the created Agent (or a clone) can be passed to the
async, allowing the async to communicate with the executor and use its facilities.


In a simple case where that is not required:
```ignore
let cfg = RunConfig::new(None,3,None);
let agent = x.new_agent(&cfg,"test");
let step = async {
    ...
};
let handle = x.add(step,agent);
```

A case where agent is used internally, in this case to yield for zero ticks:
```ignore
let cfg = RunConfig::new(None,3,None);
let agent = x.new_agent(&cfg,"test");
let agent2 = agent.clone();
let step = async move {
    ...
    agent2.tick(0).await;
    ...
};
let handle = x.add(step,agent);
```

## Using Agents

From within a future an agent can be used to wait for a certain number of ticks or a certain time. Waiting for zero
ticks is a simple yield. Methods on agent also exist for creating simple timers (based both on time and tick) which call
callbacks (the invoking of which is handled by the executor). Named waits, turnstiles, and destructors are also created
by a simple call to Agent. Agent also contains the new_agent and submit methods which correspond to the new_agent and
add methods of the Executorm allowing spawning of new, independent tasks.

For example, this task waits ten time units and then submits a new, independent task.

```ignore
let cfg = RunConfig::new(None,3,None);
let agent = executor.new_agent(&cfg,"test");
let agent2 = agent.clone();
let step = async move {
    agent2.timer(10.).await;
    let agentb = agent2.new_agent("test2",None);
    agent2.submit(agentb,async move {
        ...
    });
    ...
};
executor.add(step,agent);
```

## Using TaskHandles

Whereas an Agent is a means of interacting with an executor from within the future, a TaskHandle is the equivalent
struct from the perspective of the invoker. It can be used to retrieve the result of the task, to get summary
information about its status, and to send signals. If can also return a future which can be later used to wait on
completion of the task from inside some other future. In most simple cases an invoker will not care about the taskhandle
and need not keep it.

# Implementation

To see details of internals for work on this library, see INTERNALS.md.

# TODO

* Due to time-constraints, in places the implementation is not very Rust-ideomatic due to time constraints. Lifetimes
and references are not leveraged extensively and there is far too much cloning, the result being a bit C++-y. This was a
consequence of this implementation being the result of "feeling around" this space. This should be fixed now there is a
good spec.

*/

#[macro_use]
extern crate identitynumber;

mod executor {
  pub(crate) mod action;
  pub(crate) mod executor;
  pub(crate) mod link;
  pub(crate) mod taskcontainer;
  pub(crate) mod request;
  mod exetasks;
  mod runnable;
  mod runqueue;
  mod timerset;
  mod timings;
}

mod corefutures {
  pub(crate) mod promisefuture;
  pub(crate) mod namedfuture;
  pub(crate) mod tidierfuture;
  pub(crate) mod turnstilefuture;
}

mod derivedfutures {
  pub(crate) mod commanderstream;
}

mod integration {
    pub(crate) mod integration;
    pub(crate) mod reentering;
    mod sleepcatcher;

    #[cfg(test)]
    pub(crate) mod testintegration;
}

mod task {
    pub(crate) mod block;
    pub(crate) mod runconfig;
    pub(crate) mod slot;
    pub(crate) mod task;
    pub(crate) mod taskhandle;

    #[cfg(test)]
    pub(crate) mod faketask;
}

mod agent {
    pub(crate) mod agent;
    mod blockagent;
    mod finishagent;
    mod nameagent;
    mod runagent;
}

#[macro_use]
extern crate blackbox;
extern crate futures;
extern crate hashbrown;
#[macro_use]
extern crate lazy_static;
extern crate owning_ref;

pub use crate::agent::agent::Agent;
pub use crate::executor::executor::Executor;
pub use crate::corefutures::promisefuture::PromiseFuture;
pub use crate::derivedfutures::commanderstream::CommanderStream;
pub use crate::integration::integration::{ Integration, SleepQuantity };
pub use crate::task::runconfig::RunConfig;
pub use crate::task::slot::RunSlot;
pub use crate::task::task::{ KillReason, TaskResult, TaskSummary };
pub use crate::task::taskhandle::TaskHandle;
