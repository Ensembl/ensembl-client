#[derive(Clone,Copy,PartialEq,Eq,Hash,Debug)]
pub struct Leaf {
    hindex: i64,
    vscale: i32
}

impl Leaf {
    pub fn new(hindex: i64, vscale: i32) -> Leaf {
        Leaf { hindex, vscale }
    }
    
    pub fn get_index(&self) -> i64 { self.hindex }
    pub fn get_offset(&self) -> f64 { self.hindex as f64 }
    
    pub fn get_vscale(&self) -> i32 { self.vscale }
}

const FRAME : f64 = 2000.;

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
