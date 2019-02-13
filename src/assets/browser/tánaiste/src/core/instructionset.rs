use std::collections::HashMap;

use core::{ Instruction, InstructionBundle };

pub struct InstructionSet {
    instrs: HashMap<String,Box<Instruction>>
}

impl InstructionSet {
    pub fn new(isbs: Vec<InstructionBundle>) -> InstructionSet {
        let mut instrs = HashMap::<String,Box<Instruction>>::new();
        for mut isb in isbs {
            for inst in isb.drain() {
                let sig = inst.signature();
                instrs.insert(sig.0.clone(),inst);
            }
        }
        InstructionSet {
            instrs
        }
    }

    pub fn get_inst(&self, name: &str) -> Option<&Box<Instruction>> {
        self.instrs.get(name)
    }    
}
