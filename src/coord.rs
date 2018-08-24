use std::ops::Add;
use program::{ Object, ObjectAttrib };

#[derive(Clone,Copy)]
pub struct COrigin(pub f32,pub f32);

pub trait Input {
    fn to_f32(&self, _attrib: &mut ObjectAttrib) {}
}

#[derive(Clone,Copy)]
pub struct CLeaf(pub f32,pub i32);

impl CLeaf {
    pub fn mix(&self, other: CLeaf) -> (CLeaf,CLeaf) {
        (CLeaf(self.0,other.1), CLeaf(other.0,self.1))
    }

    pub fn triangles(&self, other: CLeaf) -> ([CLeaf;3],[CLeaf;3]) {
        let mix = self.mix(other);
        ([*self, mix.1, mix.0],[other, mix.0, mix.1])
    }
    
    pub fn rectangle(&self, other: CLeaf) -> [CLeaf;4] {
        let mix = self.mix(other);
        [*self, mix.0, other, mix.1]
    }
}

impl Input for CLeaf {
    fn to_f32(&self, attrib: &mut ObjectAttrib) {
        attrib.add_f32(&[self.0,self.1 as f32]);
    }
}

#[derive(Clone,Copy)]
pub struct CPixel(pub i32,pub i32);

impl CPixel {
    pub fn mix(&self, other: CPixel) -> (CPixel,CPixel) {
        (CPixel(self.0,other.1), CPixel(other.0,self.1))
    }
    
    pub fn triangles(&self, other: CPixel) -> ([CPixel;3],[CPixel;3]) {
        let mix = self.mix(other);
        ([*self, mix.1, mix.0],[other, mix.0, mix.1])
    }

    pub fn rectangle(&self, other: CPixel) -> [CPixel;4] {
        let mix = self.mix(other);
        [*self, mix.0, other, mix.1]
    }
    
    #[allow(dead_code)]
    fn scale(&self, scale: CPixel) -> CPixel {
        CPixel(self.0 * scale.0, self.1 * scale.1)
    }
}

impl Input for CPixel {
    fn to_f32(&self, attrib: &mut ObjectAttrib) {
        attrib.add_f32(&[self.0 as f32,self.1 as f32]);
    }
}

impl Add for CPixel {
    type Output = CPixel;
    
    fn add(self,other: CPixel) -> CPixel {
        CPixel(self.0+other.0, self.1+other.1)
    }
}

#[derive(Clone,Copy)]
pub struct CFraction(pub f32,pub f32);

impl CFraction {
    pub fn mix(&self, other: CFraction) -> (CFraction,CFraction) {
        (CFraction(self.0,other.1), CFraction(other.0,self.1))
    }
    
    pub fn triangles(&self, other: CFraction) -> ([CFraction;3],[CFraction;3]) {
        let mix = self.mix(other);
        ([*self, mix.1, mix.0],[other, mix.0, mix.1])
    }    

    pub fn rectangle(&self, other: CFraction) -> [CFraction;4] {
        let mix = self.mix(other);
        [*self, mix.0, other, mix.1]
    }
}

impl Input for CFraction {
    fn to_f32(&self, attrib: &mut ObjectAttrib) {
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

impl Input for Colour {
    fn to_f32(&self, attrib: &mut ObjectAttrib) {
        attrib.add_f32(&[self.0 as f32 / 255.,
                         self.1 as f32 / 255.,
                         self.2 as f32 / 255.]);
    }
}
