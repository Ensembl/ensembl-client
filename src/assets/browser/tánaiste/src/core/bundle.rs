use super::instruction::Instruction;

use commands::*;

pub struct InstructionBundle(Vec<Box<dyn Instruction>>);

impl InstructionBundle {
    pub fn new() -> InstructionBundle {
        InstructionBundle(Vec::<Box<dyn Instruction>>::new())
    }
    
    pub fn add(&mut self, c: Box<dyn Instruction>) {
        self.0.push(c);
    }

    pub fn add_all(&mut self, mut c: Vec<Box<dyn Instruction>>) {
        self.0.append(&mut c);
    }
    
    pub fn drain(&mut self) -> impl Iterator<Item=Box<dyn Instruction>> +'_ {
        self.0.drain(..)
    }
}

pub fn instruction_bundle_core() -> InstructionBundle {
    let mut ib = InstructionBundle::new();
    ib.add_all(vec! {
        Box::new(ConcatI()) as Box<dyn Instruction>,
        Box::new(ConstantI()),
        Box::new(HaltI()),
        Box::new(MoveI()),
        Box::new(PushI()),
        Box::new(PopI()),
        Box::new(PollAnyI()),
        Box::new(PollDoneI()),
        Box::new(PollMakeI()),
        Box::new(PollResetI())
    });
    ib
}

pub fn instruction_bundle_native() -> InstructionBundle {
    let mut ib = InstructionBundle::new();
    ib.add_all(vec! {
        Box::new(ExternalI()), 
        Box::new(SleepI()),
        Box::new(PoSleepI()),
        Box::new(PoExternalI()),
        Box::new(PoExternalResI())
    });
    ib
}

