#[macro_use]
mod sequence;

mod block;
mod blockagent;
mod agent;
mod executor;
mod action;
mod integration;
mod named;
mod oneshot;
mod runconfig;
mod runnable;
mod runqueue;
mod slot;
mod taskcontainer;
mod task;
mod timer;
mod turnstile;

#[cfg(test)]
mod testintegration;

#[cfg(test)]
extern crate async_std;

#[macro_use]
extern crate blackbox;
extern crate hashbrown;
extern crate owning_ref;

#[macro_use]
extern crate lazy_static;

extern crate futures;

#[cfg(test)]
extern crate regex;

pub use crate::executor::Executor;
