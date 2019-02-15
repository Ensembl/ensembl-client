use core::Value;
use super::environment::Environment;
use super::interp::{ ProcessState, ProcessStatus };
use super::process::Process;
use super::procconf::ProcessConfig;

pub struct InterpProcess {
    start: i64,
    p: Process,
    config: ProcessConfig,
    cycles: i64,
    booted: bool
}

impl InterpProcess {
    pub fn new(p: Process, config: &ProcessConfig, env: &mut Box<Environment>) -> InterpProcess {
        InterpProcess {
            start: env.get_time(),
            p, config: config.clone(),
            cycles: 0,
            booted: false
        }
    }
    
    pub fn boot(&mut self) -> bool {
        if self.booted { return false }
        self.booted = true;
        true
    }
    
    fn send_finished(&mut self, env: &mut Box<Environment>) {
        let exit_float = self.p.get_reg_float(1);
        let exit_str = self.p.get_reg_str(2);
        env.finished(self.p.get_pid().unwrap(),self.status().state,exit_float,exit_str);
    }
    
    fn oob(&mut self, env: &mut Box<Environment>) -> Option<String> {
        if let Some(cpu_limit) = self.config.cpu_limit {
            if self.cycles > cpu_limit {
                return Some(format!("Exceeded CPU limit {}",cpu_limit));
            }
        }
        if let Some(time_limit) = self.config.time_limit {
            let interval = env.get_time();
            if interval - self.start > time_limit {
                return Some(format!("Exceeded time limit {}",time_limit));
            }
        }
        None
    }
    
    pub fn run_proc(&mut self, env: &mut Box<Environment>, cycles: i64) {
        if let Some(remain) = self.config.time_limit.map(|limit|
            limit - env.get_time()
        ) {
            self.p.set_remaining(remain);
        }
        let mut c = 0;
        while self.p.ready() && c < cycles {        
            c += self.p.step();
        }
        self.cycles += c;
        if let Some(msg) = self.oob(env) {
            self.p.kill(msg);
        }
        if self.p.halted() {
            self.send_finished(env);
        }
    }
    
    pub fn set_reg(&mut self, idx: usize, v: Value) {
        self.p.set_reg(idx,v);
    }
    
    pub fn started(&mut self, env: &mut Box<Environment>, pid: usize) {
        self.p.start(pid);
        env.started(pid);
    }
    
    pub fn status(&self) -> ProcessStatus {
        let state = if self.p.halted() {
            if let Some(msg) = self.p.killed() {
                ProcessState::Killed(msg.to_string())
            } else {
                ProcessState::Halted
            }
        } else if self.booted && self.p.ready() {
            ProcessState::Running
        } else {
            ProcessState::Sleeping
        };
        ProcessStatus {
            state,
            cycles: self.cycles
        }
    }
}
