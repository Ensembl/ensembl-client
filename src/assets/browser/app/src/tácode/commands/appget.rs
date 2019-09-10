use std::sync::{ Arc, Mutex };

use tánaiste::{
    Argument, Command, DataState, Instruction, ProcState, Signature
};

use tácode::core::TáContext;

pub struct AppGet(pub TáContext);

impl Command for AppGet {
    fn execute(&self, _rt: &mut DataState, proc: Arc<Mutex<ProcState>>) -> i64 {
        self.0.appget(proc.lock().unwrap().get_pid().unwrap());
        return 1
    }
}

pub struct AppGetI(pub TáContext);

impl Instruction for AppGetI {
    fn signature(&self) -> Signature { Signature::new("appget","") }
    fn build(&self, _args: &Vec<Argument>) -> Box<dyn Command> {
        Box::new(AppGet(self.0.clone()))
    }
}
