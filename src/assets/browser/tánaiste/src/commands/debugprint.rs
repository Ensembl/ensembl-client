use std::sync::{ Arc, Mutex };
use core::{ Command, RuntimeData, RuntimeProcess };

pub struct DebugPrint(usize);

impl DebugPrint {
    pub fn new(r: usize) -> Box<Command> {
        Box::new(DebugPrint(r))
    }
}

impl Command for DebugPrint {
    fn execute(&self, rt: &mut RuntimeData, _proc: Arc<Mutex<RuntimeProcess>>) {
        println!("{:?}",rt.registers().get(self.0));
    }
}
