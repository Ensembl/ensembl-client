use std::sync::{ Arc, Mutex };
use core::{ Command, DataState, ProcState, Value };

pub struct Concat(usize,usize,usize);

impl Concat {
    pub fn new(r: usize, a: usize, b: usize) -> Box<Command> {
        Box::new(Concat(r,a,b))
    }
}

impl Command for Concat {
    fn execute(&self, rt: &mut DataState, _proc: Arc<Mutex<ProcState>>) {
        let regs = rt.registers();
        let a = regs.get(self.1).to_string().value();
        let av = a.borrow();
        let b = regs.get(self.2).to_string().value();
        let bv = b.borrow();
        let mut c = av.value_string().unwrap().clone();
        c.push_str(bv.value_string().unwrap());
        println!("set {}",c);
        regs.set(self.0,Value::new_from_string(c));
    }
}
