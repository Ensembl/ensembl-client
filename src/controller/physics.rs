use std::sync::{ Arc, Mutex };
use types::{ CFraction, cfraction, CPixel };
use controller::timers::Timers;
use controller::global::CanvasGlobal;
use controller::runner::Event;

pub struct MousePhysicsImpl {
    down_at: Option<CFraction>,
    delta_applied: Option<CFraction>,
    last_t: Option<f64>
}

#[derive(Clone)]
pub struct MousePhysics(Arc<Mutex<MousePhysicsImpl>>);

impl MousePhysics {
    pub fn new(timers: &mut Timers) -> MousePhysics {
        let out = MousePhysics(Arc::new(Mutex::new(MousePhysicsImpl {
            down_at: None,
            delta_applied: None,
            last_t: None
        })));
        let c = out.clone();
        timers.add(move |cg,t| c.clone().tick(cg,t));
        out
    }

    pub fn tick(&mut self, cg: &CanvasGlobal, t: f64) {
        console!("tick");
        let mut mp = self.0.lock().unwrap();
        if let Some(last_t) = mp.last_t {
            let dt = t - last_t;
            cg.er.borrow_mut().run(vec! {
                Event::Zoom((dt/10000.) as f32)
            });
        }
        mp.last_t = Some(t);
    }

    pub fn down(&mut self, e: CPixel) {
        let mut mp = self.0.lock().unwrap();
        debug!("mouse","down");
        mp.down_at = Some(e.as_fraction());
        mp.delta_applied = Some(cfraction(0.,0.));
    }
    
    pub fn up(&mut self) {
        let mut mp = self.0.lock().unwrap();
        debug!("mouse","up");
        mp.down_at = None;
    }

    pub fn move_to(&mut self, e: CPixel) -> Option<CFraction> {
        let mut mp = self.0.lock().unwrap();
        let at = e.as_fraction();
        if let Some(down_at) = mp.down_at {
            let delta = at - down_at;
            let new_delta = delta - mp.delta_applied.unwrap();
            mp.delta_applied = Some(delta);
            Some(new_delta.as_fraction())
        } else {
            None
        }
    }
}
