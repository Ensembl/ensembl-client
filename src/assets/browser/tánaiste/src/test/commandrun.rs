use std::{ time, thread };

use assembly::assemble;
use core::{ InstructionSet, instruction_bundle_core };
use runtime::Runtime;
use test::TEST_CODE;

pub fn command_make(what: &str) -> Runtime {
    let is = InstructionSet::new(instruction_bundle_core());
    let bin = assemble(&is,&TEST_CODE[what]).ok().unwrap();
    bin.exec(None).ok().unwrap()
}

pub fn command_run(what: &str) -> Runtime {
    let mut r = command_make(what);
    r.run();
    while !r.halted() {
        r.run();
        thread::sleep(time::Duration::from_millis(100));
    }
    r
}
