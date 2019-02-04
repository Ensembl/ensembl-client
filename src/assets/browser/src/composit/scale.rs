use std::fmt;

#[derive(Clone,Copy,PartialEq,Eq,Hash)]
pub struct Scale {
    index: i32
}

const FRAME : f64 = 5000.;

impl Scale {
    pub fn new(index: i32) -> Scale {
        Scale {
            index
        }
    }
    
    pub fn best_for_screen(bp_per_screen: f64) -> Scale {
        let mut best_ratio = 0.;
        let mut best_scale = None;
        let v_approx = -((2.*((bp_per_screen/FRAME).log10())).round()) as i32;
        for delta in -2..3 {
            let scale = Scale::new(v_approx+delta);
            let mut ratio = bp_per_screen / scale.total_bp();
            if ratio > 1. { ratio = 1./ratio; }
            if best_scale.is_none() || ratio > best_ratio {
                best_ratio = ratio;
                best_scale = Some(scale);
            }
        }
        best_scale.unwrap()
    }
    
    pub fn next_scale(&self, in_by: i32) -> Scale {
        Scale::new(self.index+in_by)
    }
    
    /* scales:          -10          -9         -8
     * bp/leaf: 500,000,000 150,000,000 50,000,000
     * 
     * scales:          -7        -6        -5      -4
     * bp/leaf: 15,000,000 5,000,000 1,500,000 500,000
     * 
     * scales:       -3     -2     -1     0     1   2
     * bp/leaf: 150,000 50,000 15,000 5,000 1,667 500
     * 
     * scales:       3  4      5 6
     * bp/leaf: 166.67 50 16.667 5
     */
    pub fn total_bp(&self) -> f64 {
        let mut bp_px = 10_i64.pow(self.index.abs() as u32/2) as f64;
        if self.index.abs() % 2 != 0 { bp_px *= 3.; }
        if self.index > 0 { bp_px = 1./bp_px; }
        bp_px * FRAME
    }
}

impl fmt::Debug for Scale {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f,"sc{}",self.index)
    }
}
