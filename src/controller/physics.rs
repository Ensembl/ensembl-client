use types::{ CFraction, cfraction, CPixel };

pub struct MousePhysics {
    down_at: Option<CFraction>,
    delta_applied: Option<CFraction>,
}

impl MousePhysics {
    pub fn new() -> MousePhysics {
        MousePhysics {
            down_at: None,
            delta_applied: None
        }
    }
    
    pub fn down(&mut self, e: CPixel) {
        debug!("mouse","down");
        self.down_at = Some(e.as_fraction());
        self.delta_applied = Some(cfraction(0.,0.));
    }
    
    pub fn up(&mut self) {
        debug!("mouse","up");
        self.down_at = None;
    }

    pub fn move_to(&mut self, e: CPixel) -> Option<CFraction> {
        let at = e.as_fraction();
        if let Some(down_at) = self.down_at {
            let delta = at - down_at;
            let new_delta = delta - self.delta_applied.unwrap();
            self.delta_applied = Some(delta);
            Some(new_delta.as_fraction())
        } else {
            None
        }
    }
}
