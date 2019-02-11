use std::{ time, thread };

use assembly::assemble;
use core::{ BinaryCode, InstructionSet, instruction_bundle_core };
use runtime::Process;
use test::TEST_CODE;

pub fn command_compile(what: &str) -> BinaryCode {
    let is = InstructionSet::new(instruction_bundle_core());
    assemble(&is,&TEST_CODE[what]).ok().unwrap()
}

pub fn command_make(what: &str) -> Process {
    let bin = command_compile(what);
    bin.exec(None,None,None,None,None).ok().unwrap()
}

pub fn command_run(what: &str) -> Process {
    let mut r = command_make(what);
    r.run();
    while !r.halted() {
        r.run();
        thread::sleep(time::Duration::from_millis(100));
    }
    r
}
