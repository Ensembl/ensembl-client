#[macro_use]
mod util {
    #[macro_use]
    pub(crate) mod sequence;
}

mod executor {
    pub(crate) mod action;
    pub(crate) mod executor;
    pub(crate) mod taskcontainer;
    mod runnable;
    mod runqueue;
    mod timerset;
}

mod helper {
    pub(crate) mod named;
    pub(crate) mod flagfuture;
    pub(crate) mod tidier;
    pub(crate) mod turnstile;
}

mod integration {
    pub(crate) mod integration;
    pub(crate) mod reentering;
    mod sleepcatcher;

    #[cfg(test)]
    pub(crate) mod testintegration;
}

mod task {
    pub(crate) mod runconfig;
    pub(crate) mod slot;
    pub(crate) mod task;
    pub(crate) mod taskhandle;
}

mod block;
mod blockagent;
mod agent;

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

pub use crate::executor::executor::Executor; // XXX for unused warnings
