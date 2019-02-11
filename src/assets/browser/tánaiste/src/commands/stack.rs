use std::sync::{ Arc, Mutex };

use assembly::{ Argument, Signature };
use core::{ Command, Instruction };
use runtime::{ DataState, ProcState, Value };

#[derive(Debug)]
pub struct Push(usize);

impl Push {
    pub fn new(r: usize) -> Box<Command> {
        Box::new(Push(r))
    }
}

impl Command for Push {    
    fn execute(&self, rt: &mut DataState, _proc: Arc<Mutex<ProcState>>) -> i64 {
        let v = {
            let regs = rt.registers();
            regs.get(self.0).clone()
        };
        rt.push_data(v);
        1
    }
}

pub struct PushI();

impl Instruction for PushI {
    fn signature(&self) -> Signature { Signature::new("push","r") }
    fn build(&self, args: &Vec<Argument>) -> Box<Command> {
        Box::new(Push(args[0].reg()))
    }
}
