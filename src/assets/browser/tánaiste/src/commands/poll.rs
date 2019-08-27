use std::sync::{ Arc, Mutex };

use assembly::{ Argument, Signature };
use core::{ Command, Instruction, Value };
use runtime::{ DataState, ProcState };

#[derive(Debug)]
pub struct PollMake(usize);

impl Command for PollMake {    
    fn execute(&self, data: &mut DataState, proc: Arc<Mutex<ProcState>>) -> i64 {
        let mut p = proc.lock().unwrap();
        let g = p.polls().create_group();
        data.registers().set(self.0,Value::new_from_float(vec![g]));
        return 1;
    }
}

pub struct PollMakeI();

impl Instruction for PollMakeI {
    fn signature(&self) -> Signature { Signature::new("pollmake","r") }
    fn build(&self, args: &Vec<Argument>) -> Box<dyn Command> {
        Box::new(PollMake(args[0].reg()))
    }
}

#[derive(Debug)]
pub struct PollDone(usize);

impl Command for PollDone {    
    fn execute(&self, data: &mut DataState, proc: Arc<Mutex<ProcState>>) -> i64 {
        let g = data.registers().get(self.0).as_floats(|f| *f.get(0).unwrap_or(&0.));
        let mut p = proc.lock().unwrap();
        p.polls().delete_group(g);
        return 1;
    }
}

pub struct PollDoneI();

impl Instruction for PollDoneI {
    fn signature(&self) -> Signature { Signature::new("polldone","r") }
    fn build(&self, args: &Vec<Argument>) -> Box<dyn Command> {
        Box::new(PollDone(args[0].reg()))
    }
}

#[derive(Debug)]
pub struct PollReset(usize,usize);

impl Command for PollReset {    
    fn execute(&self, data: &mut DataState, proc: Arc<Mutex<ProcState>>) -> i64 {
        let g = data.registers().get(self.0).as_floats(|f| *f.get(0).unwrap_or(&0.));
        let id = data.registers().get(self.1).as_floats(|f| *f.get(0).unwrap_or(&0.));
        let mut p = proc.lock().unwrap();
        p.polls().on_off(g,id,false);
        return 1;
    }
}

pub struct PollResetI();

impl Instruction for PollResetI {
    fn signature(&self) -> Signature { Signature::new("pollreset","rr") }
    fn build(&self, args: &Vec<Argument>) -> Box<dyn Command> {
        Box::new(PollReset(args[0].reg(),args[1].reg()))
    }
}

#[derive(Debug)]
pub struct PollAny(usize,usize);

impl Command for PollAny {    
    fn execute(&self, data: &mut DataState, proc: Arc<Mutex<ProcState>>) -> i64 {
        let g = data.registers().get(self.1).as_floats(|f| *f.get(0).unwrap_or(&0.));
        let mut polls = proc.lock().unwrap().polls().clone();
        if let Some(fd) = polls.get_any(g) {
            data.registers().set(self.0,Value::new_from_float(vec![fd]));
        } else {
            data.set_again();
            proc.lock().unwrap().sleep();
            polls.add_waiter(g,proc);
        }
        return 1;
    }
}

pub struct PollAnyI();

impl Instruction for PollAnyI {
    fn signature(&self) -> Signature { Signature::new("pollany","rr") }
    fn build(&self, args: &Vec<Argument>) -> Box<dyn Command> {
        Box::new(PollAny(args[0].reg(),args[1].reg()))
    }
}

#[cfg(test)]
mod test {
    use test::{ command_run, TestContext };

    #[test]
    fn poll_smoke() {
        let tc = TestContext::new();
        let mut r = command_run(&tc,"poll-smoke");
        assert_eq!(r.get_reg(2),r.get_reg(4));
    }

    #[test]
    fn poll_smoke_2() {
        let tc = TestContext::new();
        let mut r = command_run(&tc,"poll-smoke-2");
        assert_eq!(r.get_reg(5),r.get_reg(4));
        assert_eq!(r.get_reg(6),r.get_reg(2));
    }
}
