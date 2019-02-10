use std::sync::{ Arc, Mutex };
use std::{ thread, time };

use core::{ Command, DataState, ProcState };

pub struct Sleep(f64);

impl Sleep {
    pub fn new(millis: f64) -> Box<Command> {
        Box::new(Sleep(millis))
    }
}

impl Command for Sleep {
    fn execute(&self, _data: &mut DataState, proc: Arc<Mutex<ProcState>>) {
        proc.lock().unwrap().sleep();
        let ms = self.0 as u64;
        thread::spawn(move || {
            thread::sleep(time::Duration::from_millis(ms));
            proc.lock().unwrap().wake();
        });
    }
}

pub struct Halt();

impl Halt {
    pub fn new() -> Box<Command> {
        Box::new(Halt())
    }
}

impl Command for Halt {
    fn execute(&self, _data: &mut DataState, proc: Arc<Mutex<ProcState>>) {
        proc.lock().unwrap().halt();
    }
}
