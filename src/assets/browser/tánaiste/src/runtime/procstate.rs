use std::sync::{ Arc, Mutex };

use util::PollManager;
use super::interp::Signals;

pub struct ProcState {
    signals: Option<Signals>,
    halted: bool,
    sleeping: bool,
    pid: Option<usize>,
    ipid: usize,
    polls: PollManager,
    remaining: Option<i64>
}

lazy_static! {
    static ref IPID_SOURCE: Arc<Mutex<usize>> = Arc::new(Mutex::new(0));
}

impl ProcState {
    pub fn new(signals: Option<Signals>) -> ProcState {
        let ipid = {
            let mut src = IPID_SOURCE.lock().unwrap();
            *src += 1;
            *src
        };
        ProcState {
            ipid,
            signals,
            halted: false,
            sleeping: false,
            pid: None,
            polls: PollManager::new(),
            remaining: None
        }
    }

    pub fn set_remaining(&mut self, amt: Option<i64>) {
        self.remaining = amt;
    }

    pub fn get_remaining(&self) -> Option<i64> { self.remaining }

    pub fn get_ipid(&self) -> usize { self.ipid }

    pub fn set_pid(&mut self, pid: usize) { self.pid = Some(pid); }
    pub fn get_pid(&self) -> Option<usize> { self.pid }

    pub fn halt(&mut self) { self.halted = true; }
    pub fn sleep(&mut self) { self.sleeping = true; }
    
    pub fn wake(&mut self) {
        self.sleeping = false;
        if let Some(ref signals) = self.signals {
            if let Some(pid) = self.pid {
                signals.awoke(pid);
            }
        }
    }
    pub fn is_sleeping(&self) -> bool { self.sleeping }
    pub fn is_halted(&self) -> bool { self.halted }
    
    pub fn polls(&mut self) -> &mut PollManager { &mut self.polls }
}
