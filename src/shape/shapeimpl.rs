use arena::{
    ArenaData,
};

use compiler::{
    GLProgramData,
};

pub trait Shape {
    fn process(&self, geom: &mut GLProgramData, adata: &ArenaData);
}
