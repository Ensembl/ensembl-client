use std::sync::{ Arc, Mutex };

use assembly::{ Argument, Signature };
use core::{ Command, Instruction };
use runtime::{ DataState, ProcState };
use super::TestContext;

#[derive(Debug)]
pub struct DebugPrint(usize);

impl Command for DebugPrint {
    fn execute(&self, rt: &mut DataState, _proc: Arc<Mutex<ProcState>>) -> i64 {
        println!("{:?}",rt.registers().get(self.0));
        return 10
    }
}

pub struct DPrintI(pub TestContext);

impl Instruction for DPrintI {
    fn signature(&self) -> Signature { Signature::new("dprint","r") }
    fn build(&self, args: &Vec<Argument>) -> Box<dyn Command> {
        Box::new(DebugPrint(args[0].reg()))
    }
}

pub struct DebugSet(TestContext);

impl Command for DebugSet {
    fn execute(&self, _rt: &mut DataState, _proc: Arc<Mutex<ProcState>>) -> i64 {
        self.0.set();
        return 1;
    }
}

pub struct DSetI(pub TestContext);

impl Instruction for DSetI {
    fn signature(&self) -> Signature { Signature::new("dset","") }
    fn build(&self, _args: &Vec<Argument>) -> Box<dyn Command> {
        Box::new(DebugSet(self.0.clone()))
    }
}
