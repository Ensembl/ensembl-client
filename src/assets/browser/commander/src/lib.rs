mod commander;
mod taskcontrol;
mod edgetrigger;
mod executor;
mod executoraction;
mod integration;
mod runnable;
mod runqueue;
mod step;
mod stepcontrol;
mod task2;
mod taskcontainer;
mod timer;

mod steps {
    pub(crate) mod futurestep;
    pub(crate) mod joinstep;
    pub(crate) mod sequence;
    pub(crate) mod parallel;
    pub(crate) mod timeout;
    pub(crate) mod branch;
}

#[macro_use]
extern crate blackbox;
extern crate hashbrown;
extern crate owning_ref;

#[cfg(test)]
extern crate regex;

//#[cfg(test)]
mod test {
    mod test;
    mod testintegration;
    mod teststeps;
}

pub use crate::commander::{ Commander, Step, StepControl, StepState };
pub use crate::steps::futurestep::future_to_step;
pub use crate::steps::joinstep::{ step_recover, step_sequence, StepSequence /* XXX */ };

pub use crate::executor::Executor;
