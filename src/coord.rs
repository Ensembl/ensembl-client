use std::ops::{ Add, Mul, Div };
use program::{ Object, ObjectAttrib, DataBatch, UniformValue };

pub trait Input {
    fn to_f32(&self, _attrib: &mut ObjectAttrib, _batch: &DataBatch) {}
}

/* COrigin */

#[derive(Clone,Copy)]
pub struct COrigin(pub f32,pub f32);

/* CLeaf */

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
    fn to_f32(&self, attrib: &mut ObjectAttrib, batch: &DataBatch) {
        attrib.add_f32(&[self.0,self.1 as f32],batch);
    }
}

impl Add for CLeaf {
    type Output = CLeaf;
    
    fn add(self,other: CLeaf) -> CLeaf {
        CLeaf(self.0+other.0, self.1+other.1)
    }
}

/* RLeaf */

#[derive(Clone,Copy)]
pub struct RLeaf(pub CLeaf,pub CLeaf);

impl RLeaf {
    pub fn expand(&self) -> RLeaf {
        RLeaf(self.0, self.0+self.1)
    }

    pub fn rectangle(&self) -> [CLeaf;4] {
        let x = self.expand();
        [
            x.0,
            CLeaf((x.0).0, (x.1).1), 
            x.1,
            CLeaf((x.1).0, (x.0).1)
        ]
    }
}

impl Input for RLeaf {
    fn to_f32(&self, attrib: &mut ObjectAttrib, batch: &DataBatch) {
        for c in self.rectangle().iter() {
            attrib.add_f32(&[c.0 as f32,c.1 as f32],batch);
        }
    }
}

/* CPixel */

#[derive(Clone,Copy,Debug)]
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
    fn to_f32(&self, attrib: &mut ObjectAttrib, batch: &DataBatch) {
        attrib.add_f32(&[self.0 as f32,self.1 as f32], batch);
    }
}

impl Add for CPixel {
    type Output = CPixel;
    
    fn add(self,other: CPixel) -> CPixel {
        CPixel(self.0+other.0, self.1+other.1)
    }
}

impl Mul for CPixel {
    type Output = CPixel;
    
    fn mul(self, other: CPixel) -> CPixel {
        CPixel(self.0*other.0, self.1*other.1)
    }
}

impl Mul<i32> for CPixel {
    type Output = CPixel;
    
    fn mul(self, other: i32) -> CPixel {
        CPixel(self.0*other, self.1*other)
    }
}

impl Div for CPixel {
    type Output = CFraction;
    
    fn div(self, other: CPixel) -> CFraction {
        CFraction((self.0 as f32)/(other.0 as f32),
                  (self.1 as f32)/(other.1 as f32))
    }
}

/* RPixel */

#[derive(Clone,Copy,Debug)]
pub struct RPixel(pub CPixel,pub CPixel);

impl RPixel {
    pub fn at_origin(self) -> RPixel {
        RPixel(CPixel(0,0),self.1)
    }
    
    pub fn expand(&self) -> RPixel {
        RPixel(self.0, self.0+self.1)
    }

    pub fn rectangle(&self) -> [CPixel;4] {
        let x = self.expand();
        [
            x.0,
            CPixel((x.0).0, (x.1).1), 
            x.1,
            CPixel((x.1).0, (x.0).1)
        ]
    }
}

impl Add<CPixel> for RPixel {
    type Output = RPixel;
    
    fn add(self, other: CPixel) -> RPixel {
        RPixel(self.0+other,self.1)
    }
}

impl Mul<CPixel> for RPixel {
    type Output = RPixel;
    
    fn mul(self, other: CPixel) -> RPixel {
        RPixel(self.0*other, self.1*other)
    }
}

impl Div for RPixel {
    type Output = RFraction;
    
    fn div(self, other: RPixel) -> RFraction {
        RFraction(self.0/other.0,self.1/other.1)
    }
}

impl Div<CPixel> for RPixel {
    type Output = RFraction;
    
    fn div(self, other: CPixel) -> RFraction {
        RFraction(self.0/other,self.1/other)
    }
}

impl Input for RPixel {
    fn to_f32(&self, attrib: &mut ObjectAttrib, batch: &DataBatch) {
        for c in self.rectangle().iter() {
            attrib.add_f32(&[c.0 as f32,c.1 as f32],batch);
        }
    }
}

/* CFraction */

#[derive(Clone,Copy,Debug)]
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

impl Add for CFraction {
    type Output = CFraction;
    
    fn add(self,other: CFraction) -> CFraction {
        CFraction(self.0+other.0, self.1+other.1)
    }
}

impl Input for CFraction {
    fn to_f32(&self, attrib: &mut ObjectAttrib, batch: &DataBatch) {
        attrib.add_f32(&[self.0,self.1],batch);
    }
}

/* RFraction */

#[derive(Clone,Copy)]
pub struct RFraction(pub CFraction,pub CFraction);

impl RFraction {
    pub fn expand(&self) -> RFraction {
        RFraction(self.0, self.0+self.1)
    }
    
    pub fn rectangle(&self) -> [CFraction;4] {
        let x = self.expand();
        [
            x.0,
            CFraction((x.0).0, (x.1).1), 
            x.1,
            CFraction((x.1).0, (x.0).1)
        ]
    }
}

impl Input for RFraction {
    fn to_f32(&self, attrib: &mut ObjectAttrib, batch: &DataBatch) {
        for c in self.rectangle().iter() {
            attrib.add_f32(&[c.0,c.1],batch);
        }
    }
}

/* Colour */

#[derive(Clone,Copy,PartialEq,Hash,Eq)]
pub struct Colour(pub u32,pub u32,pub u32);

impl Colour {
    pub fn to_css(&self) -> String {
        format!("rgb({},{},{})",self.0,self.1,self.2)
    }
    
    pub fn to_uniform(&self) -> UniformValue {
        let f = self.to_frac();
        UniformValue::Vec3F(f[0],f[1],f[2])
    }
    
    pub fn to_frac(&self) -> [f32;3] {
        [self.0 as f32 / 255.,
         self.1 as f32 / 255.,
         self.2 as f32 / 255.]
    }
}

impl Input for Colour {
    fn to_f32(&self, attrib: &mut ObjectAttrib, batch: &DataBatch) {
        attrib.add_f32(&self.to_frac(), batch);
    }
}
