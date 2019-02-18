use tánaiste::{ Instruction, InstructionBundle };

use tácode::core::TáContext;
use tácode::commands::{
    AppGetI, CPrintI, DPrintI, ShapeI, AbuttI, ElideI, NotI, PickI,
    ExtentI, AllI, BinOpI, BinOpType, TextI, IndexI
};

pub fn instruction_bundle_app(tc: &TáContext) -> InstructionBundle {
    let mut ib = InstructionBundle::new();
    ib.add_all(vec! {
        Box::new(CPrintI()) as Box<Instruction>,
        Box::new(DPrintI()),
        Box::new(ElideI()),
        Box::new(AbuttI()),
        Box::new(NotI()),
        Box::new(AllI()),
        Box::new(PickI()),
        Box::new(IndexI()),
        Box::new(BinOpI(BinOpType::Add)),
        Box::new(TextI(tc.clone())),
        Box::new(AppGetI(tc.clone())),
        Box::new(ShapeI(tc.clone())),
        Box::new(ExtentI(tc.clone()))
    });
    ib
}
