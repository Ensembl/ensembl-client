use std::sync::{ Arc, Mutex };
use core::{ Command, DataState, ProcState };

pub struct DebugPrint(usize);

impl DebugPrint {
    pub fn new(r: usize) -> Box<Command> {
        Box::new(DebugPrint(r))
    }
}

impl Command for DebugPrint {
    fn execute(&self, rt: &mut DataState, _proc: Arc<Mutex<ProcState>>) {
        println!("{:?}",rt.registers().get(self.0));
    }
}
