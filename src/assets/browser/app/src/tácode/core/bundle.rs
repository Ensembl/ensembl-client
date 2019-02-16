use tánaiste::{ Instruction, InstructionBundle };

use tácode::core::TáContext;
use tácode::commands::{
    AppGetI, CPrintI, DPrintI, StRectI, AbuttI, ElideI, NotI, PickI
};

pub fn instruction_bundle_app(tc: &TáContext) -> InstructionBundle {
    let mut ib = InstructionBundle::new();
    ib.add_all(vec! {
        Box::new(CPrintI()) as Box<Instruction>,
        Box::new(DPrintI()),
        Box::new(ElideI()),
        Box::new(AbuttI()),
        Box::new(NotI()),
        Box::new(PickI()),
        Box::new(AppGetI(tc.clone())),
        Box::new(StRectI(tc.clone())),
    });
    ib
}
