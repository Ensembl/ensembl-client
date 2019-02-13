use std::sync::{ Arc, Mutex };

use tánaiste::{
    Argument, Command, DataState, Instruction, ProcState, Signature
};

use tácode::core::TáContext;

pub struct AppGet(pub TáContext);

impl Command for AppGet {
    fn execute(&self, rt: &mut DataState, proc: Arc<Mutex<ProcState>>) -> i64 {
        console!("APPGET");
        self.0.appget(proc.lock().unwrap().get_pid().unwrap());
        return 1
    }
}

pub struct AppGetI(pub TáContext);

impl Instruction for AppGetI {
    fn signature(&self) -> Signature { Signature::new("appget","") }
    fn build(&self, args: &Vec<Argument>) -> Box<Command> {
        Box::new(AppGet(self.0.clone()))
    }
}
