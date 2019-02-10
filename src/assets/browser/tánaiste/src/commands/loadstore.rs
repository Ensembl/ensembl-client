use std::sync::{ Arc, Mutex };

use core::{ Command, DataState, ProcState, Value };

pub struct Constant(usize,Value);

impl Constant {
    pub fn new(r: usize, v: Value) -> Box<Command> {
        Box::new(Constant(r,v))
    }
}

impl Command for Constant {
    fn execute(&self, rt: &mut DataState, _proc: Arc<Mutex<ProcState>>) {
        rt.registers().set(self.0,self.1.clone());
    }
}

pub struct Move(usize,usize);

impl Move {
    pub fn new(dest: usize, src: usize) -> Box<Command> {
        Box::new(Move(dest,src))
    }
}

impl Command for Move {
    fn execute(&self, rt: &mut DataState, _proc: Arc<Mutex<ProcState>>) {
        let regs = rt.registers();
        let v = regs.get(self.1).clone();
        regs.set(self.0,v);
    }
}
