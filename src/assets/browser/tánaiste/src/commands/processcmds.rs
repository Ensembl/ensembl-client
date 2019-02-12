use std::sync::{ Arc, Mutex };
use std::{ thread, time };

use assembly::{ Argument, Signature };
use core::{ Command, Instruction };
use runtime::{ DataState, ProcState };

#[derive(Debug)]
pub struct Sleep(usize);

impl Sleep {
    pub fn new(ms_reg: usize) -> Box<Command> {
        Box::new(Sleep(ms_reg))
    }
}

impl Command for Sleep {    
    fn execute(&self, data: &mut DataState, proc: Arc<Mutex<ProcState>>) -> i64 {
        proc.lock().unwrap().sleep();
        let ms = data.registers().get(self.0).as_floats(|f|
            f.get(0).map(|s| *s).unwrap_or(0.)
        );
        thread::spawn(move || {
            thread::sleep(time::Duration::from_millis(ms as u64));
            proc.lock().unwrap().wake();
        });
        return 1;
    }
}

pub struct SleepI();

impl Instruction for SleepI {
    fn signature(&self) -> Signature { Signature::new("sleep","r") }
    fn build(&self, args: &Vec<Argument>) -> Box<Command> {
        Box::new(Sleep(args[0].reg()))
    }
}

#[derive(Debug)]
pub struct Halt();

impl Halt {
    pub fn new() -> Box<Command> {
        Box::new(Halt())
    }
}

impl Command for Halt {
    fn execute(&self, _data: &mut DataState, proc: Arc<Mutex<ProcState>>) -> i64 {
        proc.lock().unwrap().halt();
        return 0;
    }
}

pub struct HaltI();

impl Instruction for HaltI {
    fn signature(&self) -> Signature { Signature::new("halt","") }
    fn build(&self, args: &Vec<Argument>) -> Box<Command> {
        Box::new(Halt())
    }
}

#[cfg(test)]
mod test {
    use std::{ thread, time };
    use test::command_make;

    #[test]
    fn sleep_cmd() {
        let mut r = command_make("sleep");
        r.run();
        let mut num_f = 0;
        for _ in 0..20 {
            if r.ready() { break; }
            num_f += 1;
            thread::sleep(time::Duration::from_millis(10));
        }
        assert!(num_f > 5);
        assert!(num_f < 15);
        r.run();
    }
}
