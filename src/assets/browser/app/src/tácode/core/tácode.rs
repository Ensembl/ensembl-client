use std::sync::{ Arc, Mutex };

use tánaiste::{
    assemble, BinaryCode, DEFAULT_CONFIG, instruction_bundle_core,
    InstructionSet, Interp, ProcessConfig, PROCESS_CONFIG_DEFAULT 
};

use super::appenv::AppEnv;
use tácode::instruction_bundle_app;

pub struct TácodeImpl {
    interp: Interp,
    insset: InstructionSet,
    procconf: ProcessConfig
}

fn app_interp() -> Interp {
    let mut cfg = DEFAULT_CONFIG.clone();
    cfg.cycles_per_run = 1000000;
    let env = Box::new(AppEnv::new());
    Interp::new(env,cfg)
}

fn instruction_set() -> InstructionSet {
    InstructionSet::new(vec!{
        instruction_bundle_core(),
        instruction_bundle_app()
    })
}

fn process_config() -> ProcessConfig {
    let pc = PROCESS_CONFIG_DEFAULT.clone();
    pc
}

impl TácodeImpl {
    pub fn new() -> TácodeImpl {
        TácodeImpl {
            interp: app_interp(),
            insset: instruction_set(),
            procconf: process_config()
        }
    }

    pub fn assemble(&self, code: &str) -> Result<BinaryCode,Vec<String>> {
        assemble(&self.insset,code)
    }

    pub fn run(&mut self, bin: &BinaryCode) -> Result<usize,String> {
        self.interp.exec(bin,None,Some(&self.procconf))
    }
    
    pub fn step(&mut self) {
        self.interp.run(5);
    }
}

#[derive(Clone)]
pub struct Tácode(Arc<Mutex<TácodeImpl>>);

impl Tácode {
    pub fn new() -> Tácode {
        Tácode(Arc::new(Mutex::new(TácodeImpl::new())))
    }

    pub fn assemble(&self, code: &str) -> Result<BinaryCode,Vec<String>> {
        self.0.lock().unwrap().assemble(code)
    }

    pub fn run(&mut self, bin: &BinaryCode) -> Result<usize,String> {
        self.0.lock().unwrap().run(bin)
    }
    
    pub fn step(&mut self) {
        self.0.lock().unwrap().step()
    }
}
