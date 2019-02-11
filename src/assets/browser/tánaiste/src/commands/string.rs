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
    fn execute(&self, rt: &mut DataState, _proc: Arc<Mutex<ProcState>>) -> i64 {
        let regs = rt.registers();
        let mut c = regs.get(self.1).as_string(|a| a.clone());
        regs.get(self.2).as_string(|b| c.push_str(b));
        let len = c.len() as i64;
        regs.set(self.0,Value::new_from_string(c));
        len
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
