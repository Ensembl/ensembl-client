use std::collections::HashSet;

use core::BinaryCode;
use util::ValueStore;
use super::environment::Environment;
use super::process::Process;

pub struct Interp {
    env: Box<Environment>,
    procs: ValueStore<Process>,
    runq: HashSet<usize>,
    nextq: HashSet<usize>
}

#[derive(PartialEq)]
enum RunResult { Timeout, Empty, Finished }

impl Interp {
    pub fn new(env: Box<Environment>) -> Interp {
        Interp {
            env,
            procs: ValueStore::<Process>::new(),
            runq: HashSet::<usize>::new(),
            nextq: HashSet::<usize>::new()
        }
    }
    
    pub fn exec(&mut self, bc: &BinaryCode, start: Option<&str>) -> Result<usize,String> {
        match bc.exec(start) {
            Ok(p) => {
                 let pid = self.procs.store(p);
                 self.runq.insert(pid);
                 Ok(pid)
            },
            Err(e) => Err(e)
        }
    }
    
    fn drain_runq(&mut self, end: i64) -> RunResult {
        if self.runq.is_empty() { return RunResult::Empty; }
        for pid in self.runq.drain() {
            let proc = self.procs.get_mut(pid);
            proc.step();
            if proc.ready() {
                self.nextq.insert(pid);
            }
            if self.env.get_time() > end {
                return RunResult::Timeout;
            }
        }
        RunResult::Finished
    }
    
    fn step(&mut self, end: i64) -> bool {
        loop {
            let r = self.drain_runq(end);
            if r == RunResult::Finished { continue; }
            return r == RunResult::Timeout;
        }
    }
}
