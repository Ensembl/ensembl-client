use std::collections::HashMap;
use std::rc::Rc;
use std::thread;
use std::time;

use core::{ BinaryCode, Command, Instruction, InstructionBundle };
use commands::{ ConstantI, DPrintI, HaltI };
use runtime::Process;

pub struct InstructionSet {
    instrs: HashMap<String,Box<Instruction>>
}

impl InstructionSet {
    pub fn new(mut isb: InstructionBundle) -> InstructionSet {
        let mut instrs = HashMap::<String,Box<Instruction>>::new();
        for inst in isb.drain() {
            let sig = inst.signature();
            instrs.insert(sig.0.clone(),inst);
        }
        InstructionSet {
            instrs
        }
    }

    pub fn get_inst(&self, name: &str) -> Option<&Box<Instruction>> {
        self.instrs.get(name)
    }    
}
