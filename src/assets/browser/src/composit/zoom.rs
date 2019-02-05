use std::fmt;

#[derive(Clone,Copy)]
pub struct Zoom {
    zoom: f64,
    linzoom: f64, /* bp/screen */
    max_bp: f64
}

const MAX_LIMIT_BP : f64 = 25.;

impl Zoom {
    pub fn new(z: f64) -> Zoom {
        let mut out = Zoom { zoom: 1., linzoom: 1., max_bp: 1. };
        out.set_zoom(z);
        out
    }
    
    pub fn set_max_bp(&mut self, bp: f64) {
        if bp != self.max_bp { debug!("bug","set={}",bp); }
        self.max_bp = bp;
    }
    
    fn check_min_limit(&self, val: f64) -> f64 {
        if val < -self.max_bp.log10() {
            return -self.max_bp.log10();
        } else {
            return val;
        }
    }
    
    fn check_max_limit(&self, val: f64) -> f64 {
        if val > -MAX_LIMIT_BP.log10() {
            return -MAX_LIMIT_BP.log10();
        } else {
            return val;
        }
    }
    
    pub fn set_zoom(&mut self, val: f64) {
        /* min has priority over max */
        let mut v = self.check_max_limit(val);
        v = self.check_min_limit(v);
        self.zoom = v;
        self.linzoom = 10.0_f64.powf(-v);
    }
    
    pub fn get_screen_in_bp(&self) -> f64 {
        self.linzoom
    }
    
    pub fn get_zoom(&self) -> f64 {
        self.zoom
    }
    
    pub fn get_linear_zoom(&self) -> f64 {
        self.linzoom
    }
}

impl fmt::Debug for Zoom {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f,"z{}",self.zoom)
    }
}
