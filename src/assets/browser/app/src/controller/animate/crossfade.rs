use std::sync::{ Arc, Mutex };

use zhoosh::{ Zhoosh, ZhooshOps, ZhooshRunner, ZhooshSequence, ZhooshSequenceControl, ZhooshShape, ZhooshStep, ZHOOSH_LINEAR_F64_OPS };

fn modify_prop(v: f64, prop: f64, quad: f64) -> f64 {
    let v = (1.-v/prop).max(0.).min(1.);
    v*v*quad+v*(1.-quad)
}

#[derive(Clone,Copy,Debug)]
pub struct CrossFade(f64,f64,f64); /* (prop,dippyness,quadness) */

impl CrossFade {
    pub fn start() -> CrossFade { CrossFade(0.,0.,0.) }
    pub fn end() -> CrossFade { CrossFade(1.,0.,0.) }

    pub fn get_prop_up(&self) -> f64 {
        modify_prop(1.-self.0,self.1,self.2)
    }

    pub fn get_prop_down(&self) -> f64 {
        modify_prop(self.0,self.1,self.2)
    }
}

pub struct CrossFader(pub f64,pub f64);

impl ZhooshOps<CrossFade> for CrossFader {
    fn interpolate(&self, prop: f64, from: &CrossFade, to: &CrossFade) -> CrossFade {
        CrossFade(ZHOOSH_LINEAR_F64_OPS.interpolate(prop,&from.0,&to.0),self.0,self.1)
    }

    fn distance(&self, from: &CrossFade, to: &CrossFade) -> f64 {
        ZHOOSH_LINEAR_F64_OPS.distance(&from.0,&to.0)
    }
}
