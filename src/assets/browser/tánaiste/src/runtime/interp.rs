use std::collections::HashSet;
use std::sync::{ Arc, Mutex };

use core::BinaryCode;
use util::ValueStore;
use super::environment::Environment;
use super::process::Process;
use super::procconf::{ ProcessConfig, PROCESS_CONFIG_DEFAULT };

#[derive(Debug,PartialEq)]
pub enum ProcessState { Killed(String), Halted, Gone, Running, Sleeping }

#[derive(Debug)]
pub struct ProcessStatus {
    pub state: ProcessState,
    pub cycles: i64
}

const STATUS_GONE : ProcessStatus = ProcessStatus {
    state: ProcessState::Gone,
    cycles: 0
};

struct InterpProcess {
    start: i64,
    p: Process,
    config: ProcessConfig,
    cycles: i64
}

impl InterpProcess {
    fn new(p: Process, config: &ProcessConfig, env: &mut Box<Environment>) -> InterpProcess {
        InterpProcess {
            start: env.get_time(),
            p, config: config.clone(),
            cycles: 0
        }
    }
    
    fn send_finished(&mut self, env: &mut Box<Environment>) {
        let exit_float = self.p.get_reg_float(1);
        let exit_str = self.p.get_reg_str(2);  
        env.finished(self.p.get_pid().unwrap(),exit_float,exit_str);
    }
    
    fn oob(&mut self, env: &mut Box<Environment>) -> Option<String> {
        if let Some(cpu_limit) = self.config.cpu_limit {
            if self.cycles > cpu_limit {
                return Some(format!("Exceeded CPU limit {}",cpu_limit));
            }
        }
        if let Some(time_limit) = self.config.time_limit {
            let interval = env.get_time();
            if interval > time_limit {
                return Some(format!("Exceeded time limit {}",time_limit));
            }
        }
        None
    }
    
    fn run_proc(&mut self, env: &mut Box<Environment>, cycles: i64) {
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
    
    fn set_pid(&mut self, pid: usize) {
        self.p.set_pid(pid);
    }
    
    fn status(&self) -> ProcessStatus {
        let state = if self.p.halted() {
            if let Some(msg) = self.p.killed() {
                ProcessState::Killed(msg.to_string())
            } else {
                ProcessState::Halted
            }
        } else if self.p.ready() {
            ProcessState::Running
        } else {
            ProcessState::Sleeping
        };
        ProcessStatus {
            state,
            cycles: self.cycles
        }
    }
    
    fn get_cycles(&self) -> i64 { self.cycles }
}

#[derive(Clone)]
pub struct Signals {
    awoke: Arc<Mutex<Vec<usize>>>
}

impl Signals {
    pub fn new() -> Signals {
        Signals {
            awoke: Arc::new(Mutex::new(Vec::<usize>::new()))
        }
    }
    
    pub fn awoke(&self, pid: usize) {
        self.awoke.lock().unwrap().push(pid);
    }
    
    pub fn drain_awoken(&self) -> Vec<usize> {
        let out = &mut self.awoke.lock().unwrap();
        let out : Vec<usize> = out.drain(..).collect();
        out.clone()
    }
}

pub struct Interp {
    env: Box<Environment>,
    config: InterpConfig,
    procs: ValueStore<InterpProcess>,
    runq: HashSet<usize>,
    nextq: HashSet<usize>,
    signals: Signals
}

#[derive(PartialEq)]
enum RunResult { Timeout, Empty, Finished }

pub struct InterpConfig {
    cycles_per_run: i64,
}

pub const DEFAULT_CONFIG : InterpConfig = InterpConfig {
    cycles_per_run: 100,
    
};

impl Interp {
    pub fn new(env: Box<Environment>, config: InterpConfig) -> Interp {
        Interp {
            env, config,
            procs: ValueStore::<InterpProcess>::new(),
            runq: HashSet::<usize>::new(),
            nextq: HashSet::<usize>::new(),
            signals: Signals::new()
        }
    }
    
    pub fn exec(&mut self, bc: &BinaryCode, start: Option<&str>, pc: Option<&ProcessConfig>) -> Result<usize,String> {
        let pc = pc.unwrap_or(&PROCESS_CONFIG_DEFAULT);
        match bc.exec(start,Some(self.signals.clone()),pc) {
            Ok(p) => {
                let pid = self.procs.store(InterpProcess::new(p,pc,&mut self.env));
                self.procs.get_mut(pid).unwrap().set_pid(pid);
                self.runq.insert(pid);
                Ok(pid)
            },
            Err(e) => Err(e)
        }
    }
    
    fn add_awoken(&mut self) {
        for pid in self.signals.drain_awoken() {
            self.runq.insert(pid);
        }
    }
    
    fn drain_runq(&mut self, end: i64) -> RunResult {
        if self.runq.is_empty() { return RunResult::Empty; }
        let runnable : Vec<usize> = self.runq.drain().collect();
        for pid in runnable {
            let status = {
                let mut ip = self.procs.get_mut(pid).unwrap();
                ip.run_proc(&mut self.env,self.config.cycles_per_run);
                ip.status()
            };
            if status.state == ProcessState::Running {
                self.nextq.insert(pid);
            }
            if self.env.get_time() >= end {
                return RunResult::Timeout;
            }
        }
        RunResult::Finished
    }
    
    pub fn run(&mut self, end: i64) -> bool {
        loop {
            self.add_awoken();
            let r = self.drain_runq(end);
            self.runq = self.nextq.clone();
            self.nextq.clear();
            if r == RunResult::Finished { continue; }
            return r == RunResult::Timeout;
        }
    }
    
    pub fn status(&mut self, pid: usize) -> ProcessStatus {
        if let Some(ref mut ip) = self.procs.get_mut(pid) {
            ip.status()
        } else {
            STATUS_GONE
        }
    }
    
    pub fn reuse(&mut self, pid: usize) {
        self.procs.unstore(pid);
    }
}

#[cfg(test)]
mod test {
    use std::{ thread, time };
    use super::{ Interp, ProcessState, ProcessStatus, DEFAULT_CONFIG };
    use super::super::procconf::{ ProcessConfig, PROCESS_CONFIG_DEFAULT };
    use super::super::environment::{ Environment };
    use test::{ command_compile, DebugEnvironment };
        
    #[test]
    fn noprocs() {
        let mut t_env = DebugEnvironment::new();
        let now = t_env.get_time();
        let mut t = Interp::new(t_env.make(),DEFAULT_CONFIG);
        assert!(!t.run(now+1000));
    }
    
    #[test]
    fn smoke() {
        let mut t_env = DebugEnvironment::new();
        let now = t_env.get_time();
        let mut t = Interp::new(t_env.make(),DEFAULT_CONFIG);
        let bin = command_compile("interp-smoke");
        t.exec(&bin,None,None).ok().unwrap();
        while t.run(now+1000) {}
        assert_eq!("Success!",t_env.get_exit_str().unwrap());
        assert_eq!([0.,200.].to_vec(),t_env.get_exit_float().unwrap());
    }
    
    #[test]
    fn sleep_wake() {
        let mut t_env = DebugEnvironment::new();
        let now = t_env.get_time();
        let mut t = Interp::new(t_env.make(),DEFAULT_CONFIG);
        let bin = command_compile("interp-sleep-wake");
        t.exec(&bin,None,None).ok().unwrap();
        while t.run(now+1000) {}
        thread::sleep(time::Duration::from_millis(500));
        while t.run(now+1000) {}
        assert_eq!("awoke",t_env.get_exit_str().unwrap());
    }
    
    #[test]
    fn status() {
        let mut t_env = DebugEnvironment::new();
        let now = t_env.get_time();
        let mut t = Interp::new(t_env.make(),DEFAULT_CONFIG);
        let bin = command_compile("interp-status");
        let pid = t.exec(&bin,None,None).ok().unwrap();
        assert_eq!(ProcessState::Running,t.status(pid).state);
        while t.run(now+1000) {}
        assert_eq!(ProcessState::Sleeping,t.status(pid).state);
        thread::sleep(time::Duration::from_millis(500));
        while t.run(now+1000) {}
        assert_eq!(ProcessState::Halted,t.status(pid).state);
        t.reuse(pid);
        assert_eq!(ProcessState::Gone,t.status(pid).state);
    }
    
    #[test]
    fn cycle_count() {
        let mut t_env = DebugEnvironment::new();
        let now = t_env.get_time();
        let mut t = Interp::new(t_env.make(),DEFAULT_CONFIG);
        let bin = command_compile("cycle-count");
        let pid = t.exec(&bin,None,None).ok().unwrap();
        t.run(0);
        assert_eq!(192,t.status(pid).cycles);
        assert_eq!(ProcessState::Running,t.status(pid).state);
        t.run(0);
        assert_eq!(384,t.status(pid).cycles);
        assert_eq!(ProcessState::Running,t.status(pid).state);
        t.run(1000);
        assert_eq!(ProcessState::Halted,t.status(pid).state);
    }
}
