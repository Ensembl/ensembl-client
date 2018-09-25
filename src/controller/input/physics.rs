use std::sync::{ Arc, Mutex };
use types::{ CFraction, cfraction, CPixel };
use controller::global::{ CanvasState, CanvasRunner };
use controller::input::{ Event, events_run };
use types::{ Move, Distance, Units };

pub struct MousePhysicsImpl {
    last_t: Option<f64>,             /* last update */
    force_origin: Option<CFraction>, /* spring anchor */
    mouse_pos: Option<CFraction>,    /* spring free-end */
    drive: Option<CFraction>,        /* driving force */
    accel: CFraction,                /* accel */
    vel: CFraction,                  /* vel */
}

#[derive(Clone)]
pub struct MousePhysics(Arc<Mutex<MousePhysicsImpl>>);

const LETHARGY : f32 = 3500.;
const BOING : f32 = 1.00;

impl MousePhysicsImpl {
    pub fn set_drive(&mut self, f: CFraction) {
        self.drive = Some(f);
    }
    
    pub fn run_dynamics(&mut self, t: f64) -> CFraction {
        let dt = cfraction(t as f32,t as f32);
        let mut f = self.drive.unwrap_or(cfraction(0.,0.)) / cfraction(LETHARGY,LETHARGY);
        /* apply friction */
        let crit = (4./LETHARGY).sqrt()/BOING; // critical damping eq'n.
        let friction = (cfraction(0.,0.) - self.vel) * cfraction(crit,crit);
        f = f + friction;
        /* Run ODE */
        self.accel = f;
        self.vel = self.vel + self.accel * dt;
        return self.vel * dt;
    }

    pub fn move_by(&mut self, cg: &CanvasState, dx: CFraction) {
        events_run(cg,vec! {
            Event::Move(Move::Left(Distance(dx.0,Units::Pixels))),
            Event::Move(Move::Up(Distance(dx.1,Units::Pixels)))
        });
        if let Some(force_origin) = self.force_origin {
            self.force_origin = Some(force_origin + dx);
            if let Some(mouse_pos) = self.mouse_pos {
                self.set_drive(mouse_pos - force_origin);
            }
        } else {
            self.drive = None;
        }
    }
}

impl MousePhysics {
    pub fn new(ru: &mut CanvasRunner) -> MousePhysics {
        let out = MousePhysics(Arc::new(Mutex::new(MousePhysicsImpl {
            last_t: None,
            force_origin: None,
            mouse_pos: None,
            drive: None,
            accel: cfraction(0.,0.),
            vel: cfraction(0.,0.),
        })));
        let c = out.clone();
        ru.add_timer(move |cg,t| c.clone().tick(cg,t));
        out
    }

    pub fn tick(&mut self, cg: &CanvasState, t: f64) {
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
        mp.accel = cfraction(0.,0.);
        mp.vel = cfraction(0.,0.);
        mp.force_origin = Some(e.as_fraction());
        mp.mouse_pos = Some(e.as_fraction());
    }
    
    pub fn up(&mut self) {
        let mut mp = self.0.lock().unwrap();
        mp.force_origin = None;
    }

    pub fn move_to(&mut self, e: CPixel) {
        let mut mp = self.0.lock().unwrap();
        let at = e.as_fraction();            
        mp.mouse_pos = Some(at);
        if let Some(force_origin) = mp.force_origin {
            mp.set_drive(at - force_origin);
        }
    }
}
