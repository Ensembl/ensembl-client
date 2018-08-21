mod compiled;
mod objects;
mod source;

pub use program::compiled::{
    Program,
    ProgramAttribs,
    ProgramCode,
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
    Phase,
    Varying,
    Canvas,
    Stage,
};
