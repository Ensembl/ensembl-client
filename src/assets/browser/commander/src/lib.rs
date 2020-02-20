#[macro_use]
mod util {
    #[macro_use]
    pub(crate) mod sequence;
}

mod executor {
    pub(crate) mod action;
    pub(crate) mod executor;
    pub(crate) mod taskcontainer;
    mod exetasks;
    mod runnable;
    mod runqueue;
    mod timerset;
    mod timings;
}

mod helper {
    pub(crate) mod flagfuture;
    pub(crate) mod named;
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
pub use crate::helper::flagfuture::FlagFuture;
pub use crate::helper::named::NamedFuture;
pub use crate::helper::tidier::Tidier;
pub use crate::helper::turnstile::TurnstileFuture;
pub use crate::integration::integration::{ Integration, SleepQuantity };
pub use crate::task::block::Block;
pub use crate::task::runconfig::RunConfig;
pub use crate::task::slot::RunSlot;
pub use crate::task::task::{ KillReason, TaskResult, TaskSummary };
pub use crate::task::taskhandle::TaskHandle;
