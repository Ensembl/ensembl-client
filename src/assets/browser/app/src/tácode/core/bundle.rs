use tánaiste::{ Instruction, InstructionBundle };

use tácode::commands::{ CPrintI, DPrintI };

pub fn instruction_bundle_app() -> InstructionBundle {
    let mut ib = InstructionBundle::new();
    ib.add_all(vec! {
        Box::new(CPrintI()) as Box<Instruction>,
        Box::new(DPrintI()),
    });
    ib
}
