use std::ops::Add;

use geometry::gtype::{
    GType,
    GTypeAttrib,
};

pub trait GLData {
    fn to_f32(&self, _attrib: &mut GTypeAttrib) {}
}

#[derive(Clone,Copy)]
pub struct GCoord(pub f32,pub f32);

impl GCoord {
    pub fn mix(&self, other: GCoord) -> (GCoord,GCoord) {
        (GCoord(self.0,other.1), GCoord(other.0,self.1))
    }

    pub fn triangles(&self, other: GCoord) -> ([GCoord;3],[GCoord;3]) {
        let mix = self.mix(other);
        ([*self, mix.1, mix.0],[other, mix.0, mix.1])
    }
}

impl GLData for GCoord {
    fn to_f32(&self, attrib: &mut GTypeAttrib) {
        attrib.add_f32(&[self.0,self.1]);
    }
}

#[derive(Clone,Copy)]
pub struct PCoord(pub f32,pub f32);

impl PCoord {
    pub fn mix(&self, other: PCoord) -> (PCoord,PCoord) {
        (PCoord(self.0,other.1), PCoord(other.0,self.1))
    }
    
    pub fn triangles(&self, other: PCoord) -> ([PCoord;3],[PCoord;3]) {
        let mix = self.mix(other);
        ([*self, mix.1, mix.0],[other, mix.0, mix.1])
    }
    
    #[allow(dead_code)]
    fn scale(&self, scale: PCoord) -> PCoord {
        PCoord(self.0 * scale.0, self.1 * scale.1)
    }
}

impl GLData for PCoord {
    fn to_f32(&self, attrib: &mut GTypeAttrib) {
        attrib.add_f32(&[self.0,self.1]);
    }
}

impl Add for PCoord {
    type Output = PCoord;
    
    fn add(self,other: PCoord) -> PCoord {
        PCoord(self.0+other.0, self.1+other.1)
    }
}

#[derive(Clone,Copy)]
pub struct TCoord(pub f32,pub f32);

impl TCoord {
    pub fn mix(&self, other: TCoord) -> (TCoord,TCoord) {
        (TCoord(self.0,other.1), TCoord(other.0,self.1))
    }
    
    pub fn triangles(&self, other: TCoord) -> ([TCoord;3],[TCoord;3]) {
        let mix = self.mix(other);
        ([*self, mix.1, mix.0],[other, mix.0, mix.1])
    }
}

impl GLData for TCoord {
    fn to_f32(&self, attrib: &mut GTypeAttrib) {
        attrib.add_f32(&[self.0,self.1]);
    }
}

#[derive(Clone,Copy,PartialEq,Hash,Eq)]
pub struct Colour(pub u32,pub u32,pub u32);

impl Colour {
    pub fn to_css(&self) -> String {
        format!("rgb({},{},{})",self.0,self.1,self.2)
    }    
}

impl GLData for Colour {
    fn to_f32(&self, attrib: &mut GTypeAttrib) {
        attrib.add_f32(&[self.0 as f32 / 255.,
                         self.1 as f32 / 255.,
                         self.2 as f32 / 255.]);
    }
}
