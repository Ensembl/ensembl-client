use std::sync::{ Arc, Mutex };

use core::{ DataState, ProcState };

pub trait Command {
    fn execute(&self, _data: &mut DataState, _proc: Arc<Mutex<ProcState>>);
}
