# Major Components

## Instrumentation

Instrumentation code exists to assist development and debugging of the browser
app. It is generally not available in deployed builds to reduce file size and
improve performance.

### Black Box

The black box system periodically sends logs and data sets to the backend
server. There, the server stores this data in filesi, according to server
configuration. The backend server also controls which datasets and logs are
captured, and the frequency of callbacks. These are controlled by a
configuration file. This file is sent to the client as the response to each
request containing data.

The primary use of the black box is to monitor performance.

Data sets are arranged into streams which are represented by a string. Each
log or data capture includes the stream to which it belongs. The server
configures which logs and data to capture and their destination file based on
the originating stream.

A stack allows a log message to be contextualised by pusing and popping string
context as to its location. This allows the same log messages to be divided
into subsets. The stack mechanism is relatively heavyweight and designed only
for debugging rather than long-lived instrumentation.

The blackbox supports abstract drivers. These use different mechanisms to
report to the server. Currently only an http driver and null driver are
implemented.

#### Important Files

* `app/data/blackbox` -- contains rust files implementing the blackbox:
    * core
        * `blackbox.rs` -- high-level static API for use in macros.
        * `blackboxstate.rs` -- current state of blackbox on client.
        * `bbreportstream.rs` -- implements a single stream's pending contents.
    * drivers
        * `blackboxdriver.rs` -- facade around driver implementations.
        * `httpblackboxdriver.rs` -- driver implementation for HTTP callbacks.
        * `nullblackboxdriver.rs` -- no-op driver implementation.
        * `stubdriver.rs` -- non-implementation of driver for production builds
* `macros.rs` -- macros to use blackbox in code.
* `debug_mode.yaml` -- server side configuration
* `POST /browser/debug` -- API endpoint

#### Macros

The blackbox is used exclusively through macros.

* `bb_time(stream,block)` -- execute block, timing it and adding to stream dataset.
* `bb_metronome(stream)` -- add to dataset interval between each call to this macro for this stream
* `bb_log(stream,format,args)` -- write formatted log message to stream
* `bb_stack(string,block)` -- push "string" onto stack and execute block

#### Payload Format (POST /browser/debug)
##### Client to Server Payload

POST request with raw JSON payload.

```
{
  "instance_id": "<string>", /* browser-identifying string */
  "streams": {
    "<stream-name>": {
      "reports": [
        {
          "time": <number>,   /* ms since unix epoch */
          "text": "<string>", /* log contents */
          "stack": "<string>" /* stack at time of logging  */
        },...
      ],
      "dataset": [<number>,...] /* dataset. Key may be absent if not configured */
      }
    }, ...
  }
}
```

##### Server to Client

POST request response with raw JSON payload. The whole contents of
`debug_mode.yaml` are sent (ranscoded), though the server only reacts to some
keys.

```
{
  "enabled": ["<string>",...], /* streams to enable */
  "dataset": ["<string>",...], /* datasets to enable (stream must also be enabled) */
  "interval": <number>, /* requested interval (in seconds) between updates */
}
```

