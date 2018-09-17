use std::sync::{ Arc, Mutex };
use types::{ CFraction, cfraction, CPixel };
use controller::timers::Timers;
use controller::global::CanvasGlobal;
use controller::runner::Event;
use types::{ Move, Distance, Units };

pub struct MousePhysicsImpl {
    down_at: Option<CFraction>,
    delta_applied: Option<CFraction>,
    last_t: Option<f64>,
    /**/
    total_move: Option<CFraction>,
    /* temporary model: springs */
    force_origin: Option<CFraction>,
    mouse_pos: Option<CFraction>,
    
    drive: Option<CFraction>,
    accel: CFraction,
    vel: CFraction,
    
    dyn: i32
}

#[derive(Clone)]
pub struct MousePhysics(Arc<Mutex<MousePhysicsImpl>>);

impl MousePhysicsImpl {
    pub fn set_drive(&mut self, f: CFraction) {
        console!("drive {:?}",f);
        self.drive = Some(f);
    }
    
    pub fn run_dynamics(&mut self, t: f64) -> CFraction {
        self.dyn -= 1;
        let dt = cfraction(t as f32,t as f32);
        let mut f = self.drive.unwrap_or(cfraction(0.,0.));
        /* apply friction */
        let friction = (cfraction(0.,0.) - self.vel) * cfraction(50.,50.);
        f = f + friction;
        /* Run ODE */
        self.accel = f / cfraction(10000.,10000.);
        self.vel = self.vel + self.accel * dt;
        return self.vel * dt;
    }

    pub fn move_by(&mut self, cg: &CanvasGlobal, dx: CFraction) {
        cg.er.borrow_mut().run(vec! {
            Event::Move(Move::Left(Distance(dx.0,Units::Pixels))),
            Event::Move(Move::Up(Distance(dx.1,Units::Pixels)))
        });
        if let Some(force_origin) = self.force_origin {
            console!("fo={:?} mp={:?}",self.force_origin,self.mouse_pos);
            //self.force_origin = Some(force_origin + dx);
            if let Some(mouse_pos) = self.mouse_pos {
                self.set_drive(mouse_pos - force_origin);
            }
        } else {
            self.drive = None;
        }
    }
}

impl MousePhysics {
    pub fn new(timers: &mut Timers) -> MousePhysics {
        let out = MousePhysics(Arc::new(Mutex::new(MousePhysicsImpl {
            down_at: None,
            delta_applied: None,
            last_t: None,
            total_move: None,
            force_origin: None,
            mouse_pos: None,
            drive: None,
            accel: cfraction(0.,0.),
            vel: cfraction(0.,0.),
            dyn: 4,
        })));
        let c = out.clone();
        timers.add(move |cg,t| c.clone().tick(cg,t));
        out
    }

    pub fn tick(&mut self, cg: &CanvasGlobal, t: f64) {
        let mut mp = self.0.lock().unwrap();
        let mut dt = None;
        {
            if let Some(last_t) = mp.last_t {
                dt = Some(t - last_t);
            }
            mp.last_t = Some(t);
        }
        if let Some(dt) = dt {
            let dx = mp.run_dynamics(dt);
            mp.move_by(cg,dx);
        }
    }

    pub fn down(&mut self, e: CPixel) {
        let mut mp = self.0.lock().unwrap();
        debug!("mouse","down");
        mp.down_at = Some(e.as_fraction());
        mp.delta_applied = Some(cfraction(0.,0.));
        mp.accel = cfraction(0.,0.);
        mp.vel = cfraction(0.,0.);
        mp.force_origin = Some(e.as_fraction());
        mp.mouse_pos = Some(e.as_fraction());
    }
    
    pub fn up(&mut self) {
        let mut mp = self.0.lock().unwrap();
        debug!("mouse","up");
        mp.down_at = None;
        mp.force_origin = None;
    }

    pub fn move_to(&mut self, e: CPixel) {
        let mut mp = self.0.lock().unwrap();
        let at = e.as_fraction();
        if let Some(down_at) = mp.down_at {
            let delta = at - down_at;
            let new_delta = delta - mp.delta_applied.unwrap();
            mp.delta_applied = Some(delta);
            mp.total_move = Some(
                mp.total_move.unwrap_or_else(|| cfraction(0.,0.)) + 
                new_delta.as_fraction()
            );
            
            mp.mouse_pos = Some(at);
            if let Some(force_origin) = mp.force_origin {
                mp.set_drive(at - force_origin);
            }
        }
    }
}
