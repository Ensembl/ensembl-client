mod canvascache;
mod data;
mod execute;
mod objects;
mod source;
mod gpuspec;
mod impls;

pub use self::canvascache::CanvasCache;

pub use program::execute::{
    Program,
    ProgramAttribs,
};

pub use program::data::{
    DataBatch,
    DataGroupIndex,
    Input,
    BatchManager
};

pub use program::objects::{
    Object,
    ObjectAttrib,
    UniformValue,
    CanvasWeave
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


pub use program::impls::{
    ProgramType,
    PTMethod,
    PTSkin,
    PTGeom
};
