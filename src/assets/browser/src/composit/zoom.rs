use std::fmt;

#[derive(Clone,Copy)]
pub struct Zoom {
    zoom: f32,
    linzoom: f64, /* bp/screen */
}

impl Zoom {
    pub fn new(z: f32) -> Zoom {
        let mut out = Zoom { zoom: 0., linzoom: 0. };
        out.set_zoom(z);
        out
    }
    
    pub fn set_zoom(&mut self, val: f32) {
        self.zoom = val;
        self.linzoom = 1.0/10.0_f32.powf(val) as f64;
    }

    pub fn bp_to_px(&self, bp: f64) -> f64 {
        bp / self.linzoom * 2.
    }
    
    pub fn get_screen_in_bp(&self) -> f64 {
        self.linzoom
    }
    
    pub fn get_zoom(&self) -> f32 {
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
