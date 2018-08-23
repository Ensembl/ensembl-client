use arena::ArenaData;
use std::collections::HashMap;

pub struct Precision(pub u32,pub u32);

#[derive(PartialEq,Eq,Hash)]
pub enum GLSize {
    FloatHigh,
    FloatMed,
    FloatLow,
    IntHigh,
    IntMed,
    IntLow
}

pub struct GPUSpec {
    precs: HashMap<GLSize,Precision>
}

pub fn get_precisions(adata: &ArenaData) -> GPUSpec {
    let precs = HashMap::<GLSize,Precision>::new();
    GPUSpec { precs }
}
