use std::fmt;

use types::AxisSense;

#[derive(Clone,Copy)]
pub struct Zoom {
    linzoom: f64, /* bp/screen */
    max_bp: f64
}

const MAX_LIMIT_BP : f64 = 50.;

pub fn bp_to_zoomfactor(bp: f64) -> f64 {
    -bp.log10()
}

pub fn zoomfactor_to_bp(zoomfactor: f64) -> f64 {
    10.0_f64.powf(-zoomfactor)
}

impl Zoom {
    pub fn new() -> Zoom {
        let mut out = Zoom { linzoom: 1., max_bp: 1. };
        out.set_screen_in_bp(zoomfactor_to_bp(0.)); /* called to allow limits etc */
        out
    }
    
    pub fn set_max_bp(&mut self, bp: f64) {
        self.max_bp = bp;
    }
    
    pub fn get_limit(&self, min_max: &AxisSense) -> f64 {
        match *min_max {
            AxisSense::Min => bp_to_zoomfactor(self.max_bp),
            AxisSense::Max => bp_to_zoomfactor(MAX_LIMIT_BP)
        }
    }
    
    fn check_min_limit_bp(&self, bp: f64) -> f64 {
        bp.min(zoomfactor_to_bp(self.get_limit(&AxisSense::Min)))
    }
    
    fn check_max_limit_bp(&self, bp: f64) -> f64 {
        bp.max(zoomfactor_to_bp(self.get_limit(&AxisSense::Max)))
    }

    fn check_limits_bp(&self, mut v: f64) -> f64 {
        /* min has priority over max */
        v = self.check_max_limit_bp(v);
        self.check_min_limit_bp(v)
    }

    pub fn best_zoom_screen_bp(&self,bp: f64) -> f64 {
        bp_to_zoomfactor(self.check_limits_bp(bp))
    }

    pub fn get_screen_in_bp(&self) -> f64 {
        self.linzoom
    }
    
    pub fn set_screen_in_bp(&mut self, val: f64) {
        let v = self.check_limits_bp(val);
        self.linzoom = v;
    }
}

impl fmt::Debug for Zoom {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f,"z{}",self.linzoom)
    }
}
