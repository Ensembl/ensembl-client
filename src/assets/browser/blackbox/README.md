# Blackbox

## Introduction

Blackbox is a means of reporting diagnostics. It approaches "logging" from a different pespective to traditional logging implementations, focusing on instrumentation for debugging, optimisation, and testing during development. It is not concerned with logging for deployed systems. It is expected that blackbox calls will largely ommited from a deployed binary or else will be no-ops.

Blackbox uses statics (or thread-locals) to allow easy integration without passing around context objects. It collects data for later distribution as text or json (in the future maybe more). In a browser this will typically be periodic "call-home" functrionality.

## Model

You must supply an instance of the `Integration` trait which allows blackbox to retrieve:
* the current time (an `f64`, in units of your choosing); and
* the current instance id (a unique string for this run).

All blackbox diagnostics belong to some `Stream`, identified by an arbitrary string. Only *enabled* streams are logged. This allows diagnostics to be selectively enabled at minimal cost. As well as through a traditional API, configuration can be supplied in JSON (for example from a diagnostics tool).

A `Stream` is built from implementations of the `Record` trait. Each implementation captures a different type of diagnostic: logs, counts, timings, etc. Logs are write-only Records, others can be retrieved from the `Stream` and added to as the application progresses, flushed when the records are retrieved.

A `Format` specifies the detail which a record retrieval requires (for example, to include raw data or only summary statistics).

## Direct, static of Thread-Local

There are three ways of interacting with models

 * A model may be created ***directly*** with a `new` function, and used directly through the methods on that object.
 * The ***static*** model is expected to be used most frequently. A single, global, thread-safe instance is accessed by API utility methods.
 * The ***thread-local*** model is used in unit-tests wherem ultiple threads are to be treated as distinct applications. This is most useful in unit-tests.

 Typically, the static and thread-local models are mainly accessed through macros which are more ergonomic and are zero-cost when the `blackbox-stub` crate is used in place of this one.

## API

### Direct Access

 * The `Model` is the top-level object containing streams.
 * A `Stream` contains a list of diagnostic `Record`s which can be added do.
 * A `Record` is a single diacnostic. Implementations are:
   * `LogRecord` a log line;
   * `ElapsedRecord` a dataset describing how long something took to execute;
   * `MetronomeRecord` a dataset describing how long elapses between successive calls;
   * `CountRecord` a dataset describing a counter.
 * A `Format` includes data describing how records should be rendered, currently only:
   * whether raw data should be included (in addition to a summary).
 * `Integration` is a trait which is an interface from Blackbox into your environment for clocks, instance ID, etc. Typically you will want to implement this yourself, however this crate provides:
   * `TrivialIntegration` has time stuck at zero and instance ID "anon";
   * `SimpleIntegration` allows an instance-ID specified at startup and a clock which can be manually advanced by a method on the object.
 * `Config` is created from JSON configuration data which can then be applied to `Model`s and `Format`s to configure them.
 * `records_to_lines` converts a list of Records into a list of Strings representing a single line each.
 * `records_to_json` converts a list of Records into a JSON object suited for sending over a REST logging service.

### Static/Thread-Local Access

* `blackbox_use_threadlocals` should be called first and set to true if thread-locals should be used;
* `blackbox_integration` specifies an integration to use;
* `blackbox_enable`, `blackbox_disable`, `blackbox_disable_all` and `blackbox_is_enabled` configure which `Stream`s are enabled;
* `blackbox_raw_on` and `blackbox_raw_off` configure a `Format` as to whether raw data should be included or not (or only mere summaries);
* `blackbox_config` configures the model with the given JSON;
* `blackbox_take_records`, `blackbox_take_lines`, and `blackbox_take_json` remove records as `Record` objects, or formatted as lines or JSON respectively;
* `blackbox_push` and `blackbox_pop` maintain the stack (but see the `blackbox_stack!` macro);
* `blackbox_log` adds a log record (but see the `blackbox_log!` macro);
* `blackbox_count`, `blackbox_set_count` and `blackbox_reset_count` create, set, and reset counter records. The value is only added to the dataset when `blackbox_reset_count` is called (which also resets the count to zero);
* `blackbox_start` and `blackbox_end` allow elapsed records (but see the `blackbox_time!` macro for something which is usually easier);
* `blackbox_metronome` is called to tick a metronome record;
* `blackbox_model` and  `blackbox_format` retrieve `Model`s and `Format`s directly;
* `blackbox_clear` is used in thread-local mode to remove a model for a thread which is terminating, but best efforts thread-termination interception does its best to do that for you. Calling it again manually will do no harm.

### Macros

* `blackbox_log!` is a convenience macro for access to `blackbox_log` which does formatting. As the macro compiles to nothing except when blackbox is in use, any expensive operations in the arguments, and the formatting, compile to nothing.
* `blackbox_stack!` wraps a code block to push a stack level string whenever it's executing;
* `blackbox_count!`, `blackbox_set_count!` and `blackbox_reset_count!` are wrappers around the count record static methods which compile to nothing except when blackbox is compiled in use;
* `blackbox_metronome!` is wrapper around the metronome record static method which compiles to nothing except when blackbox is compiled in use;
* `blackbox_start!` and `blackbox_end!` implement elapsed records (but see `blackbox_time!` below for something which is usually easier);
* `blackbox_time!` wraps code and sends the execution time to an elapsed record.

## Example

```
let ign = SimpleIntegration::new("example");
blackbox_use_threadlocals(true);
blackbox_integration(ign.clone());
blackbox_enable("test");
blackbox_metronome!("test","metronome");
blackbox_stack!("a",{
    stuff();
    blackbox_log!("test","Hello, world!");
});
blackbox_metronome!("test","metronome");
blackbox_count!("test","counter",1.);
blackbox_time!("test","elapsed",{
    slow_operation();
});
blackbox_metronome!("test","metronome");
print!("{}\n",blackbox_take_lines().join("\n"));
```

## Naming

Blackbox is named after the avionics items more properly called the Flight Data Recorder and Cockpit Voice Recorder, not the fine Italian House music group, though timing is also important to the implementors of this crate.
