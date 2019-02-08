use std::sync::{ Arc, Mutex };
use std::{ thread, time };

use core::{ Command, RuntimeData, RuntimeProcess };

pub struct Sleep(f64);

impl Sleep {
    pub fn new(millis: f64) -> Box<Command> {
        Box::new(Sleep(millis))
    }
}

impl Command for Sleep {
    fn execute(&self, _data: &mut RuntimeData, proc: Arc<Mutex<RuntimeProcess>>) {
        proc.lock().unwrap().sleep();
        let ms = self.0 as u64;
        thread::spawn(move || {
            thread::sleep(time::Duration::from_millis(ms));
            proc.lock().unwrap().wake();
        });
    }
}
