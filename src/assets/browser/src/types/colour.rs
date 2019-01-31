use program::{ UniformValue, Input };

/* Colour */

#[derive(Clone,Copy,PartialEq,Hash,Eq,Debug)]
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
    fn to_f32(&self, dest: &mut Vec<f32>) {
        dest.extend_from_slice(&self.to_frac());
    }
}
