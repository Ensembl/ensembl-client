mod data;
mod execute;
mod objects;
mod source;
mod gpuspec;

pub use program::execute::{
    Program,
    ProgramAttribs,
};

pub use program::data::DataBatch;

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
    Arity,
    GPUSpec,
    GLSize,
};
