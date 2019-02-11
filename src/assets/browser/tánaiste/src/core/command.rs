use std::fmt::Debug;
use std::sync::{ Arc, Mutex };

use assembly::Signature;
use runtime::{ DataState, ProcState };

pub trait Command : Debug {
    fn execute(&self, _data: &mut DataState, _proc: Arc<Mutex<ProcState>>);
}
