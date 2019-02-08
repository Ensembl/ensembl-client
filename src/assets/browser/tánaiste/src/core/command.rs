use std::sync::{ Arc, Mutex };

use core::{ RuntimeData, RuntimeProcess };

pub trait Command {
    fn execute(&self, _data: &mut RuntimeData, _proc: Arc<Mutex<RuntimeProcess>>);
}
