use std::sync::{ Arc, Mutex };

use assembly::{ Argument, Signature };
use core::{ Command, Instruction };
use runtime::{ DataState, ProcState, Value };

#[derive(Debug)]
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
        regs.set(self.0,Value::new_from_string(c));
    }
}

pub struct ConcatI();

impl Instruction for ConcatI {
    fn signature(&self) -> Signature { Signature::new("concat","rrr") }
    fn build(&self, args: &Vec<Argument>) -> Box<Command> {
        Box::new(Concat(args[0].reg(),args[1].reg(),args[2].reg()))
    }
}

#[cfg(test)]
mod test {
    use test::command_run;

    #[test]
    fn commands() {
        let mut r = command_run("concat");
        assert_eq!("\"hello world!\"",r.get_reg(3));
    }
}
