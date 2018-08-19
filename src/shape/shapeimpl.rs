use arena::{
    ArenaData,
};

use geometry::{
    GLProgramData,
};

pub trait Shape {
    fn process(&self, geom: &mut GLProgramData, adata: &ArenaData);
}
