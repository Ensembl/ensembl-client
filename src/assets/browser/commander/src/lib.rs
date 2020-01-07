mod blockbooker;
mod commander;
mod oneshot;
mod executor;
mod runnable;
mod runqueue;
mod task2;
mod taskcontainer;
mod taskdoomer;
mod timer;

mod steps {
    pub(crate) mod futurestep;
    pub(crate) mod joinstep;
}

#[macro_use]
extern crate blackbox;
extern crate hashbrown;
extern crate owning_ref;

#[cfg(test)]
extern crate regex;

#[cfg(test)]
mod test {
    mod test;
    mod testintegration;
    mod teststeps;
}

pub use crate::commander::{ Commander, CommanderIntegration, RunConfig, Step, StepControl, StepState, KillReason };
pub use crate::steps::futurestep::future_to_step;
pub use crate::steps::joinstep::{ step_recover, step_sequence, StepSequence /* XXX */ };

