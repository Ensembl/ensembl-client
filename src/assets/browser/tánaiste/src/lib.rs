#![feature(non_ascii_idents)]
#![feature(vec_remove_item)]
#[macro_use]
extern crate lazy_static;

extern crate itertools;

#[cfg(test)]
extern crate regex;

mod assembly;
mod commands;
mod core;
mod runtime;
mod util;

#[cfg(test)]
mod test;

pub use assembly::{ Argument, assemble, Signature };

pub use core::{
    BinaryCode, Command, Instruction, InstructionBundle,
    instruction_bundle_core, instruction_bundle_native,
    InstructionSet, Value
};

pub use runtime::{
    DataState, DEFAULT_CONFIG, Environment,
    Interp, ProcessConfig, PROCESS_CONFIG_DEFAULT,
    Process, ProcessState, ProcessStatus, ProcState
};


#[allow(unused_macros)]
macro_rules! console {
    ($($arg:tt)*) => {{
        let s = format!($($arg)*);
        js! { console.log(@{s}); };
    }}
}
