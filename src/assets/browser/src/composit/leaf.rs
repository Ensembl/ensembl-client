use std::fmt;

use composit::Stick;

#[derive(Clone,PartialEq,Eq,Hash)]
pub struct Leaf {
    stick: Stick,
    hindex: i64,
    vscale: i32
}

impl Leaf {
    pub fn new(stick: &Stick, hindex: i64, vscale: i32) -> Leaf {
        Leaf { hindex, vscale, stick: stick.clone() }
    }
    
    pub fn get_stick(&self) -> &Stick { &self.stick }
    pub fn get_index(&self) -> i64 { self.hindex }
    pub fn get_vscale(&self) -> i32 { self.vscale }
}

const FRAME : f64 = 5000.;

pub fn vscale_bp_per_leaf(vscale: i32) -> f64 {
    let mut bp_px = 10_i64.pow(vscale.abs() as u32/2) as f64;
    if vscale.abs() % 2 != 0 { bp_px *= 3.; }
    if vscale > 0 { bp_px = 1./bp_px; }
    bp_px * FRAME
}

pub fn best_vscale(bp_per_screen: f64) -> i32 {
    let mut best_ratio = 0.;
    let mut best_delta = 0;
    let v_approx = -((2.*((bp_per_screen/FRAME).log10())).round()) as i32;
    for delta in -2..3 {
        let mut ratio = bp_per_screen / vscale_bp_per_leaf(v_approx+delta);
        if ratio > 1. { ratio = 1./ratio; }
        if ratio > best_ratio {
            best_ratio = ratio;
            best_delta = delta;
        }
    }
    v_approx+best_delta
}

impl fmt::Debug for Leaf {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        let mul = vscale_bp_per_leaf(self.get_vscale());
        let start = (self.get_index() as f64 * mul).floor() as i32;
        let end = ((self.get_index()+1) as f64 * mul).ceil() as i32;
        write!(f,"{:?}:{}:{}[{}-{}]",self.stick,self.hindex,self.vscale,start,end)
    }
}
