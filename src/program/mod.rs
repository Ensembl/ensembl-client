mod data;
mod execute;
mod objects;
mod source;
mod gpuspec;

pub use program::execute::{
    Program,
    ProgramAttribs,
};

pub use program::data::{
    DataBatch,
    DataGroup
};

pub use program::objects::{
    Object,
    ObjectAttrib,
    UniformValue
};
    
pub use program::source::{
    ProgramSource,
    Statement,
    Uniform,
    Attribute,
    Varying,
    Canvas,
    Main,
};

pub use program::gpuspec::{
    Precision,
    Arity,
    GPUSpec,
    GLSize,
};
