use core::InstructionBundle;

use test::{ DPrintI, DSetI, TestContext };

pub fn instruction_bundle_test(tc: &TestContext) -> InstructionBundle {
    let mut ib = InstructionBundle::new();
    ib.add_all(vec! {
        Box::new(DPrintI(tc.clone())), 
        Box::new(DSetI(tc.clone())), 
    });
    ib
}
