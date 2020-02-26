use tánaiste::{ Environment, ProcessState };

use crate::tácode::TáContext;
use crate::dom::domutil::browser_time;

pub struct AppEnv {
    tc: TáContext,
}

impl AppEnv {
    pub fn new(tc: TáContext) -> AppEnv {
        AppEnv { tc }
    }
}

impl Environment for AppEnv {
    fn get_time(&mut self) -> i64 {
        let t : f64 = browser_time();
        t as i64
    }
    
    fn started(&mut self, _pid: usize) {}
    
    fn finished(&mut self, pid: usize, _state: ProcessState, _codes: Vec<f64>, _string: Vec<String>) {
        self.tc.finished(pid);
    }
}
