mod commander;
mod control;
mod edgetrigger;
mod executor;
mod executoraction;
mod integration;
mod runnable;
mod runqueue;
mod step;
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
