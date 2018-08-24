mod execute;
mod objects;
mod source;
mod gpuspec;

pub use program::execute::{
    Program,
    ProgramAttribs,
    ProgramCode,
    DataBatch,
};

pub use program::objects::{
    Object,
    ObjectAttrib
};
    
pub use program::source::{
    ProgramSource,
    Statement,
    Uniform,
    Attribute,
    Varying,
    Canvas,
    Stage,
};

pub use program::gpuspec::{
    Precision,
    GPUSpec,
    GLSize,
};
