use geometry::gtype::GTypeAttrib;

pub trait GLData {
    fn to_f32(&self, attrib: &mut GTypeAttrib) {}
}

#[derive(Clone,Copy)]
pub struct GCoord(pub f32,pub f32);

impl GCoord {
    pub fn mix(&self, other: GCoord) -> (GCoord,GCoord) {
        (GCoord(self.0,other.1), GCoord(other.0,self.1))
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
    
    fn scale(&self, scale: PCoord) -> PCoord {
        PCoord(self.0 * scale.0, self.1 * scale.1)
    }
}

impl GLData for PCoord {
    fn to_f32(&self, attrib: &mut GTypeAttrib) {
        attrib.add_f32(&[self.0,self.1]);
    }
}

#[derive(Clone,Copy)]
pub struct TCoord(pub f32,pub f32);

impl TCoord {
    pub fn mix(&self, other: TCoord) -> (TCoord,TCoord) {
        (TCoord(self.0,other.1), TCoord(other.0,self.1))
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
    
    pub fn to_webgl(&self) -> [f32;3] {
        [self.0 as f32 / 255.,
         self.1 as f32 / 255.,
         self.2 as f32 / 255.]
    }
}

impl GLData for Colour {
    fn to_f32(&self, attrib: &mut GTypeAttrib) {
        attrib.add_f32(&[self.0 as f32 / 255.,
                         self.1 as f32 / 255.,
                         self.2 as f32 / 255.]);
    }
}
