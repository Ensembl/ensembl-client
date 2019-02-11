use std::sync::{ Arc, Mutex };

use assembly::{ Argument, Signature };
use core::{ Command, Instruction };
use runtime::{ DataState, ProcState };

#[derive(Debug)]
pub struct DebugPrint(usize);

impl DebugPrint {
    pub fn new(r: usize) -> Box<Command> {
        Box::new(DebugPrint(r))
    }
}

impl Command for DebugPrint {
    fn execute(&self, rt: &mut DataState, _proc: Arc<Mutex<ProcState>>) -> i64 {
        println!("{:?}",rt.registers().get(self.0));
        return 10
    }
}

pub struct DPrintI();

impl Instruction for DPrintI {
    fn signature(&self) -> Signature { Signature::new("dprint","r") }
    fn build(&self, args: &Vec<Argument>) -> Box<Command> {
        DebugPrint::new(args[0].reg())
    }
}
